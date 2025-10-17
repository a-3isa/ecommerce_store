/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { Product } from './entities/product.entity';
import { ProductIdDto } from './dto/product-id.dto';
import { ProductAttribute } from 'src/product-attr/entities/product-attr.entity';
import { ProductAttributeValue } from 'src/product-attr-val/entities/product-attr-val.entity';
import { Category } from 'src/category/entities/category.entity';
import { CacheLong, CacheWithKey } from './decorators/cache.decorator';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductAttribute)
    private attributeRepository: Repository<ProductAttribute>,
    @InjectRepository(ProductAttributeValue)
    private attributeValueRepository: Repository<ProductAttributeValue>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  public async create(createProductDto: CreateProductDto): Promise<Product> {
    const [attributes, attributeValues, category] = await Promise.all([
      this.attributeRepository.findBy({
        id: In(createProductDto.attributesId),
      }),
      this.attributeValueRepository.findBy({
        id: In(createProductDto.attributesValId),
      }),
      this.categoryRepository.findOne({
        where: { id: createProductDto.categoryId },
      }),
    ]);

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createProductDto.categoryId} not found`,
      );
    }
    if (!attributes || attributes.length === 0) {
      throw new NotFoundException(
        `Attributes not found for IDs: ${createProductDto.attributesId}`,
      );
    }
    if (!attributeValues || attributeValues.length === 0) {
      throw new NotFoundException(
        `Attribute values not found for IDs: ${createProductDto.attributesValId}`,
      );
    }

    const product = this.productRepository.create({
      name: createProductDto.name,
      slug: createProductDto.slug,
      description: createProductDto.description,
      // price: createProductDto.price,
      // stock: createProductDto.stock,
      sku: createProductDto.sku,
      barcode: createProductDto.barcode,
      category: category,
      attr: attributes,
      attrValues: attributeValues,
    });

    return await this.productRepository.save(product);
  }

  @CacheLong()
  public async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: [
        'attrValues',
        'attr',
        'category',
        'variants',
        'triggerGift',
        'giftProduct',
      ],
    });
  }

  public async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: [
        'attrValues',
        'attr',
        'category',
        'variants',
        'triggerGift',
        'giftProduct',
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
      // stock: updateProductDto.stock ?? product.stock,
      sku: updateProductDto.sku ?? product.sku,
      barcode: updateProductDto.barcode ?? product.barcode,
      // isActive: updateProductDto.isActive ?? product.isActive,
    });

    await this.productRepository.insert(product);

    return this.findOne(id);
  }

  public async remove(productId: ProductIdDto): Promise<void> {
    const { id } = productId;
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  @CacheWithKey('products:search', 300000)
  public async searchProducts(filterDto: ProductFilterDto) {
    const {
      search,
      categoryId,
      minPrice,
      maxPrice,
      isActive = true,
      attributeFilters,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filterDto;

    const qb = this.productRepository
      .createQueryBuilder('product')
      .innerJoin('product.category', 'category')
      .innerJoin('product.variants', 'variant')
      .innerJoin('variant.attributeValues', 'variantAttrValue')
      .innerJoin('product.attrValues', 'attrValue')
      .innerJoin('attrValue.attr', 'attr');

    // Filter by isActive
    qb.andWhere('product.isActive = :isActive', { isActive });

    // Filter by categoryId
    if (categoryId) {
      const catIdNum = Number(categoryId);
      if (!isNaN(catIdNum)) {
        qb.andWhere('category.id = :categoryId', { categoryId: catIdNum });
      }
    }

    // Search filter (name, description, sku, barcode)
    if (search) {
      qb.andWhere(
        '(product.name LIKE :search OR product.description LIKE :search OR product.sku LIKE :search OR product.barcode LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Price range filter on variant.price
    if (minPrice !== undefined) {
      qb.andWhere('variant.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      qb.andWhere('variant.price <= :maxPrice', { maxPrice });
    }

    // Parse attributeFilters: array of "attributeId:value"
    if (attributeFilters && attributeFilters.length > 0) {
      const attrFilterMap = new Map<number, string[]>();
      for (const filter of attributeFilters) {
        const [attrIdStr, value] = filter.split(':');
        const attrId = Number(attrIdStr);
        if (!attrFilterMap.has(attrId)) {
          attrFilterMap.set(attrId, []);
        }
        attrFilterMap.get(attrId)!.push(value);
      }

      let index = 0;
      for (const [attrId, values] of attrFilterMap.entries()) {
        qb.innerJoin(
          'variant.attributeValues',
          `variantAttrValueFilter${index}`,
          `variantAttrValueFilter${index}.attrId = :attrId${index} AND variantAttrValueFilter${index}.value IN (:...values${index})`,
          {
            [`attrId${index}`]: attrId,
            [`values${index}`]: values,
          },
        );
        index++;
      }
    }

    // Select fields with MIN(variant.price) as price
    qb.select([
      'product.id AS id',
      'product.name AS name',
      'product.image AS image',
      'MIN(variant.price) AS price',
      'product.createdAt AS createdAt',
      'category.id AS categoryId',
      'category.name AS categoryName',
    ]);

    qb.groupBy('product.id')
      .addGroupBy('category.id')
      .addGroupBy('category.name');

    // Sorting
    if (sortBy === 'price') {
      qb.orderBy('MIN(variant.price)', sortOrder);
    } else if (['name', 'createdAt', 'updatedAt'].includes(sortBy)) {
      qb.orderBy(`product.${sortBy}`, sortOrder);
    } else {
      qb.orderBy('product.createdAt', 'DESC');
    }

    // Pagination
    qb.offset((page - 1) * limit).limit(limit);

    const products = await qb.getRawMany();

    // Build available attributes filters from product.attrValues
    const rawAttrs: { attrId: number; attrName: string; value: string }[] =
      await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.category', 'category')
        .leftJoin('product.attrValues', 'attrValue')
        .leftJoin('attrValue.attr', 'attr')
        .where(categoryId ? 'category.id = :categoryId' : '1=1', {
          categoryId: categoryId ? Number(categoryId) : undefined,
        })
        .andWhere(
          search
            ? '(product.name LIKE :search OR product.description LIKE :search OR product.sku LIKE :search OR product.barcode LIKE :search)'
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

    // Build available categories filters
    const rawCats: { id: number; name: string }[] = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .where(
        search
          ? '(product.name LIKE :search OR product.description LIKE :search OR product.sku LIKE :search OR product.barcode LIKE :search)'
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

    return {
      products,
      filters: {
        categories: availableCategories,
        attributes: availableAttributes,
      },
    };
  }
}
