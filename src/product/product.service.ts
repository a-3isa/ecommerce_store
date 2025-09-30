import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductIdDto } from './dto/product-id.dto';
import { ProductAttribute } from 'src/product-attr/entities/product-attr.entity';
import { ProductAttributeValue } from 'src/product-attr-val/entities/product-attr-val.entity';

// Type definitions for safe operations
export interface ValidationRules {
  min?: number;
  max?: number;
  pattern?: string;
  required?: boolean;
}

export interface CategoryAttributeData {
  categoryId: string;
  categoryName: string;
  attributes: Map<string, AttributeData>;
}

export interface AttributeData {
  id: string;
  name: string;
  displayName: string;
  isRequired: boolean;
  isActive: boolean;
  sortOrder: number;
  values: Set<string>;
}

export interface CategoryFilterResult {
  categoryId: string;
  categoryName: string;
  attributes: Array<{
    id: string;
    name: string;
    displayName: string;
    isRequired: boolean;
    isActive: boolean;
    sortOrder: number;
    values: string[];
  }>;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductAttribute)
    private attributeRepository: Repository<ProductAttribute>,
    @InjectRepository(ProductAttributeValue)
    private attributeValueRepository: Repository<ProductAttributeValue>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create({
      name: createProductDto.name,
      slug: createProductDto.slug,
      description: createProductDto.description,
      // price: createProductDto.price,
      stock: createProductDto.stock,
      sku: createProductDto.sku,
      barcode: createProductDto.barcode,
      // isActive: createProductDto.isActive,
    });

    const savedProduct = await this.productRepository.insert(product);

    if (!savedProduct.identifiers[0]?.id) {
      throw new BadRequestException('Failed to save product');
    }

    // Handle EAV attributes if provided
    if (createProductDto.attributes && createProductDto.attributes.length > 0) {
      await this.createProductAttributes(
        savedProduct.identifiers[0]?.id,
        createProductDto.attributes,
      );
    }

    return this.findOne(savedProduct.identifiers[0]?.id);
  }

  public async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: [
        'attributeValues',
        'attributeValues.attribute',
        'category',
        'variants',
        'images',
      ],
    });
  }

  public async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: [
        'attributeValues',
        'attributeValues.attribute',
        'category',
        'variants',
        'images',
      ],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  public async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    // Update basic product fields
    Object.assign(product, {
      name: updateProductDto.name ?? product.name,
      slug: updateProductDto.slug ?? product.slug,
      description: updateProductDto.description ?? product.description,
      // price: updateProductDto.price ?? product.price,
      stock: updateProductDto.stock ?? product.stock,
      sku: updateProductDto.sku ?? product.sku,
      barcode: updateProductDto.barcode ?? product.barcode,
      // isActive: updateProductDto.isActive ?? product.isActive,
    });

    await this.productRepository.insert(product);

    // Handle EAV attributes if provided
    if (updateProductDto.attributes) {
      await this.updateProductAttributes(id, updateProductDto.attributes);
    }

    return this.findOne(id);
  }

  public async remove(productId: ProductIdDto): Promise<void> {
    const { id } = productId;
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  // EAV-specific methods - NO AUTO-CREATION
  public async createProductAttributes(
    productId: string,
    attributes: Array<{
      attributeId: string;
    }>,
  ): Promise<void> {
    for (const attr of attributes) {
      let attribute: ProductAttribute;

      // Only allow attributeId - no auto-creation
      if (attr.attributeId) {
        const existingAttribute = await this.attributeRepository.findOne({
          where: { id: attr.attributeId },
        });

        if (!existingAttribute) {
          throw new BadRequestException(
            `Attribute with ID ${attr.attributeId} not found. Please create the attribute first through admin panel.`,
          );
        }
        attribute = existingAttribute;
      } else {
        throw new BadRequestException(
          'attributeId is required. Auto-creation of attributes is disabled. Please create attributes first through admin panel.',
        );
      }

      const attributeValue = this.attributeValueRepository.create({
        product: { id: productId },
        attr: attribute,
      });

      await this.attributeValueRepository.insert(attributeValue);
    }
  }

  public async updateProductAttributes(
    productId: string,
    attributes: Array<{
      attributeId: string;
    }>,
  ): Promise<void> {
    // First, deactivate existing attributes
    // await this.attributeValueRepository.update(
    //   { product: { id: productId } },
    //   { isActive: false }
    // );

    // Then create new ones
    await this.createProductAttributes(productId, attributes);
  }

  public async getProductAttributes(
    productId: string,
  ): Promise<ProductAttributeValue[]> {
    return this.attributeValueRepository.find({
      where: {
        product: { id: productId },
      },
      relations: ['attribute'],
    });
  }

  public async searchProducts(
    categories?: number[], // 🔹 category filter
    page = 1,
    limit = 20,
    sortBy?: 'price' | 'createdAt',
    order: 'ASC' | 'DESC' = 'ASC',
    filters?: { [attrId: number]: string[] },
    search?: string,
  ) {
    // 1️⃣ Query products
    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category');

    // ✅ Category filter
    if (categories && categories.length > 0) {
      qb.andWhere('category.id IN (:...categories)', { categories });
    }

    // ✅ Search filter
    if (search) {
      qb.andWhere(
        '(product.name LIKE :search OR product.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // ✅ Attribute filters
    if (filters) {
      let index = 0;
      for (const [attrId, values] of Object.entries(filters)) {
        qb.innerJoin(
          'product.attrValues',
          `av${index}`,
          `av${index}.attrId = :attrId${index} AND av${index}.value IN (:...values${index})`,
          {
            [`attrId${index}`]: Number(attrId),
            [`values${index}`]: values,
          },
        );
        index++;
      }
    }

    // ✅ Select fields
    qb.select([
      'product.id AS id',
      'product.name AS name',
      'product.image AS image',
      'product.price AS price',
      'product.createdAt AS createdAt',
      'category.id AS categoryId',
      'category.name AS categoryName',
    ]);

    // ✅ Sorting
    if (sortBy) {
      qb.orderBy(`product.${sortBy}`, order);
    }

    // ✅ Pagination
    qb.offset((page - 1) * limit).limit(limit);

    const products = await qb.getRawMany();

    // 2️⃣ Build attribute filters
    const rawAttrs: { attrId: number; attrName: string; value: string }[] =
      await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.category', 'category')
        .leftJoin('product.attrValues', 'attrValue')
        .leftJoin('attrValue.attr', 'attr')
        .where(
          categories && categories.length > 0
            ? 'category.id IN (:...categories)'
            : '1=1',
          { categories },
        )
        .andWhere(
          search
            ? '(product.name LIKE :search OR product.description LIKE :search)'
            : '1=1',
          { search: `%${search ?? ''}%` },
        )
        .select([
          'attr.id AS attrId',
          'attr.name AS attrName',
          'attrValue.value AS value',
        ])
        .distinct(true)
        .getRawMany();

    const attrMap = new Map<
      number,
      { id: number; name: string; values: string[] }
    >();

    for (const row of rawAttrs) {
      if (!row.attrId) continue;
      if (!attrMap.has(row.attrId)) {
        attrMap.set(row.attrId, {
          id: row.attrId,
          name: row.attrName ?? '',
          values: [],
        });
      }
      if (row.value) {
        const entry = attrMap.get(row.attrId)!;
        if (!entry.values.includes(row.value)) {
          entry.values.push(row.value);
        }
      }
    }

    const availableAttributes = Array.from(attrMap.values());

    // 3️⃣ Build category filters (unique categories from products)
    const rawCats: { id: number; name: string }[] = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .where(
        search
          ? '(product.name LIKE :search OR product.description LIKE :search)'
          : '1=1',
        { search: `%${search ?? ''}%` },
      )
      .select(['category.id AS id', 'category.name AS name'])
      .distinct(true)
      .getRawMany();

    const availableCategories = rawCats.map((c) => ({
      id: c.id,
      name: c.name,
    }));

    // 4️⃣ Final return
    return {
      products,
      filters: {
        categories: availableCategories,
        attributes: availableAttributes,
      },
    };
  }

  // Admin methods for attribute management
  public async createAttribute(createAttributeDto: {
    name: string;
    displayName: string;
    description?: string;
    isRequired?: boolean;
    isActive?: boolean;
    validationRules?: ValidationRules;
    sortOrder?: number;
  }): Promise<InsertResult> {
    const attribute = this.attributeRepository.create(createAttributeDto);
    return this.attributeRepository.insert(attribute);
  }

  public async updateAttribute(
    id: string,
    updateAttributeDto: Partial<ProductAttribute>,
  ): Promise<InsertResult> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }

    Object.assign(attribute, updateAttributeDto);
    return this.attributeRepository.insert(attribute);
  }

  public async deleteAttribute(id: string): Promise<void> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }

    await this.attributeRepository.remove(attribute);
  }

  public async getAllAttributes(): Promise<ProductAttribute[]> {
    const cacheKey = 'all_active_attributes';

    // Try to get from cache first
    const cachedResult =
      await this.cacheManager.get<ProductAttribute[]>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const result = await this.attributeRepository.find({});

    // Cache the result for 15 minutes
    await this.cacheManager.set(cacheKey, result, 900000);

    return result;
  }

  public async getAttributeById(id: string): Promise<ProductAttribute> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }

    return attribute;
  }
}
