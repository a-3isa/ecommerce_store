import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { Product } from './entities/product.entity';
import {
  ProductAttribute,
  AttributeType,
} from './entities/product-attribute.entity';
import { ProductAttributeValue } from './entities/product-attribute-value.entity';

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
  type: AttributeType;
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
    type: AttributeType;
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

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create({
      name: createProductDto.name,
      slug: createProductDto.slug,
      description: createProductDto.description,
      price: createProductDto.price,
      stock: createProductDto.stock,
      type: createProductDto.type,
      sku: createProductDto.sku,
      barcode: createProductDto.barcode,
      isActive: createProductDto.isActive,
    });

    const savedProduct = await this.productRepository.save(product);

    if (!savedProduct.id) {
      throw new BadRequestException('Failed to save product');
    }

    // Handle EAV attributes if provided
    if (createProductDto.attributes && createProductDto.attributes.length > 0) {
      await this.createProductAttributes(
        savedProduct.id,
        createProductDto.attributes,
      );
    }

    return this.findOne(savedProduct.id);
  }

  async findAll(): Promise<Product[]> {
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

  async findOne(id: string): Promise<Product> {
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

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    // Update basic product fields
    Object.assign(product, {
      name: updateProductDto.name ?? product.name,
      slug: updateProductDto.slug ?? product.slug,
      description: updateProductDto.description ?? product.description,
      price: updateProductDto.price ?? product.price,
      stock: updateProductDto.stock ?? product.stock,
      type: updateProductDto.type ?? product.type,
      sku: updateProductDto.sku ?? product.sku,
      barcode: updateProductDto.barcode ?? product.barcode,
      isActive: updateProductDto.isActive ?? product.isActive,
    });

    await this.productRepository.save(product);

    // Handle EAV attributes if provided
    if (updateProductDto.attributes) {
      await this.updateProductAttributes(id, updateProductDto.attributes);
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  // EAV-specific methods - NO AUTO-CREATION
  async createProductAttributes(
    productId: string,
    attributes: Array<{
      attributeId: string;
      value: string;
      isActive?: boolean;
    }>,
  ): Promise<void> {
    for (const attr of attributes) {
      let attribute: ProductAttribute;

      // Only allow attributeId - no auto-creation
      if (attr.attributeId) {
        const existingAttribute = await this.attributeRepository.findOne({
          where: { id: attr.attributeId, isActive: true },
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
        value: attr.value,
        isActive: attr.isActive ?? true,
      });

      await this.attributeValueRepository.save(attributeValue);
    }
  }

  async updateProductAttributes(
    productId: string,
    attributes: Array<{
      attributeId: string;
      value: string;
      isActive?: boolean;
    }>,
  ): Promise<void> {
    // First, deactivate existing attributes
    await this.attributeValueRepository.update(
      { product: { id: productId } },
      { isActive: false },
    );

    // Then create new ones
    await this.createProductAttributes(productId, attributes);
  }

  async getProductAttributes(
    productId: string,
  ): Promise<ProductAttributeValue[]> {
    return this.attributeValueRepository.find({
      where: {
        product: { id: productId },
        isActive: true,
      },
      relations: ['attribute'],
    });
  }

  // Admin methods for attribute management
  async createAttribute(createAttributeDto: {
    name: string;
    displayName: string;
    type?: AttributeType;
    description?: string;
    isRequired?: boolean;
    isActive?: boolean;
    validationRules?: ValidationRules;
    sortOrder?: number;
  }): Promise<ProductAttribute> {
    const attribute = this.attributeRepository.create(createAttributeDto);
    return this.attributeRepository.save(attribute);
  }

  async updateAttribute(
    id: string,
    updateAttributeDto: Partial<ProductAttribute>,
  ): Promise<ProductAttribute> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }

    Object.assign(attribute, updateAttributeDto);
    return this.attributeRepository.save(attribute);
  }

  async deleteAttribute(id: string): Promise<void> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }

    await this.attributeRepository.remove(attribute);
  }

  async getAllAttributes(): Promise<ProductAttribute[]> {
    const cacheKey = 'all_active_attributes';

    // Try to get from cache first
    const cachedResult =
      await this.cacheManager.get<ProductAttribute[]>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const result = await this.attributeRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });

    // Cache the result for 15 minutes
    await this.cacheManager.set(cacheKey, result, 900000);

    return result;
  }

  async getAttributeById(id: string): Promise<ProductAttribute> {
    const attribute = await this.attributeRepository.findOne({
      where: { id, isActive: true },
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }

    return attribute;
  }

  // Filtering and search methods
  async findWithFilters(filters: ProductFilterDto): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.attributeValues', 'attributeValues')
      .leftJoinAndSelect('attributeValues.attribute', 'attribute')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images');

    // Apply filters
    if (filters.search) {
      queryBuilder.andWhere(
        '(product.name LIKE :search OR product.description LIKE :search OR product.sku LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters.categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
        minPrice: filters.minPrice || 0,
        maxPrice: filters.maxPrice || 999999,
      });
    }

    if (filters.isActive !== undefined) {
      queryBuilder.andWhere('product.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    // Apply attribute filters
    if (filters.attributeFilters && filters.attributeFilters.length > 0) {
      for (let i = 0; i < filters.attributeFilters.length; i++) {
        const filterParts = filters.attributeFilters[i].split(':');
        if (filterParts.length >= 2) {
          const attributeId = filterParts[0];
          const value = filterParts[1];
          if (attributeId && value) {
            queryBuilder.andWhere(
              `EXISTS (SELECT 1 FROM product_attribute_values pav${i}
                       WHERE pav${i}.productId = product.id
                       AND pav${i}.attributeId = :attributeId${i}
                       AND pav${i}.value = :value${i}
                       AND pav${i}.isActive = true)`,
              { [`attributeId${i}`]: attributeId, [`value${i}`]: value },
            );
          }
        }
      }
    }

    // Apply sorting
    const validSortFields = ['name', 'price', 'createdAt', 'updatedAt'];
    const sortByField = filters.sortBy ?? 'createdAt';
    const sortBy = validSortFields.includes(sortByField)
      ? `product.${sortByField}`
      : 'product.createdAt';

    queryBuilder.orderBy(sortBy, filters.sortOrder);

    // Apply pagination
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 10, 100);
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      products,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.attributeValues', 'attributeValues')
      .leftJoinAndSelect('attributeValues.attribute', 'attribute')
      .leftJoinAndSelect('product.category', 'category')
      .where(
        'product.name LIKE :search OR product.description LIKE :search OR product.sku LIKE :search',
        { search: `%${searchTerm}%` },
      )
      .andWhere('product.isActive = :isActive', { isActive: true })
      .orderBy('product.name', 'ASC')
      .getMany();
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { category: { id: categoryId }, isActive: true },
      relations: [
        'attributeValues',
        'attributeValues.attribute',
        'category',
        'variants',
        'images',
      ],
      order: { name: 'ASC' },
    });
  }

  async getProductsByAttribute(
    attributeId: string,
    value: string,
  ): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.attributeValues', 'attributeValues')
      .leftJoinAndSelect('attributeValues.attribute', 'attribute')
      .leftJoinAndSelect('product.category', 'category')
      .where('attributeValues.attributeId = :attributeId', { attributeId })
      .andWhere('attributeValues.value = :value', { value })
      .andWhere('attributeValues.isActive = :isActive', { isActive: true })
      .andWhere('product.isActive = :productActive', { productActive: true })
      .orderBy('product.name', 'ASC')
      .getMany();
  }

  async getCategoryFilterAttributes(
    categoryId?: string,
  ): Promise<CategoryFilterResult[]> {
    const cacheKey = `category_filter_attributes_${categoryId || 'all'}`;

    // Try to get from cache first
    const cachedResult =
      await this.cacheManager.get<CategoryFilterResult[]>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.attributeValues', 'attributeValues')
      .leftJoinAndSelect('attributeValues.attribute', 'attribute')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true })
      .andWhere('attributeValues.isActive = :attrActive', { attrActive: true })
      .andWhere('attribute.isActive = :attributeActive', {
        attributeActive: true,
      });

    if (categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    const products = await queryBuilder.getMany();

    // Group attributes by category and collect unique attributes with their values
    const categoryAttributes = new Map<string, CategoryAttributeData>();

    products.forEach((product) => {
      const catId = product.category?.id || 'uncategorized';
      const catName = product.category?.name || 'Uncategorized';

      if (!categoryAttributes.has(catId)) {
        categoryAttributes.set(catId, {
          categoryId: catId,
          categoryName: catName,
          attributes: new Map<string, AttributeData>(),
        });
      }

      const categoryData = categoryAttributes.get(catId);
      if (!categoryData) return;

      product.attributeValues.forEach((attrValue) => {
        if (!attrValue.attribute) return;

        const attrId = attrValue.attribute.id;
        const attrName = attrValue.attribute.name;
        const displayName = attrValue.attribute.displayName;
        const type = attrValue.attribute.type;
        const isRequired = attrValue.attribute.isRequired;
        const isActive = attrValue.attribute.isActive;
        const sortOrder = attrValue.attribute.sortOrder;

        if (!categoryData.attributes.has(attrId)) {
          categoryData.attributes.set(attrId, {
            id: attrId,
            name: attrName,
            displayName: displayName,
            type: type,
            isRequired: isRequired,
            isActive: isActive,
            sortOrder: sortOrder,
            values: new Set<string>(),
          });
        }

        // Collect unique values for this attribute
        const attrData = categoryData.attributes.get(attrId);
        if (attrData) {
          attrData.values.add(attrValue.value);
        }
      });
    });

    // Convert to desired format
    const result: CategoryFilterResult[] = Array.from(
      categoryAttributes.values(),
    ).map((categoryData) => ({
      categoryId: categoryData.categoryId,
      categoryName: categoryData.categoryName,
      attributes: Array.from(categoryData.attributes.values())
        .map((attr) => ({
          id: attr.id,
          name: attr.name,
          displayName: attr.displayName,
          type: attr.type,
          isRequired: attr.isRequired,
          isActive: attr.isActive,
          sortOrder: attr.sortOrder,
          values: Array.from(attr.values).sort(),
        }))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));

    const finalResult = categoryId
      ? result.filter((c) => c.categoryId === categoryId)
      : result;

    // Cache the result for 10 minutes
    await this.cacheManager.set(cacheKey, finalResult, 600000);

    return finalResult;
  }

  async getCategoryAttributeValues(categoryId: string, attributeId: string) {
    if (!categoryId) {
      throw new BadRequestException('Category ID is required');
    }

    const products = await this.productRepository.find({
      where: {
        category: { id: categoryId },
        isActive: true,
      },
      relations: ['attributeValues', 'attributeValues.attribute'],
    });

    const attributeValues = new Set<string>();

    products.forEach((product) => {
      product.attributeValues.forEach((attrValue) => {
        if (attrValue.attribute.id === attributeId && attrValue.isActive) {
          attributeValues.add(attrValue.value);
        }
      });
    });

    return Array.from(attributeValues).sort();
  }
}
