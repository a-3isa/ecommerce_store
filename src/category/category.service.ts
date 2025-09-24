import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { IsNull } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepo.create(createCategoryDto);
    await this.categoryRepo.save(category);
    return category;
  }

  async findMainCategories() {
    return this.categoryRepo.find({
      select: { id: true, name: true },
      where: { parent: IsNull() },
    });
  }

  async findSubCategories(parentId: string) {
    return this.categoryRepo.find({
      select: { id: true, name: true },
      where: { parent: { id: parentId } },
    });
  }

  async getCategoryProducts(
    categoryId: string,
    page: number,
    limit = 20,
    sortBy?: 'price' | 'createdAt',
    order: 'ASC' | 'DESC' = 'ASC',
    filters?: { [attrId: number]: string[] }, // e.g. { 1: ['red'], 2: ['XL'] }
  ) {
    // 1️⃣ Query products
    const qb = this.categoryRepo
      .createQueryBuilder('category')
      .leftJoin('category.products', 'product')
      .where('category.id = :categoryId', { categoryId });

    // ✅ Apply filters if provided
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

    // ✅ Select product fields
    qb.select([
      'product.id AS id',
      'product.name AS name',
      'product.image AS image',
      'product.price AS price',
      'product.createdAt AS createdAt',
    ]);

    // ✅ Apply sorting if provided
    if (sortBy) {
      qb.orderBy(`product.${sortBy}`, order);
    }

    // ✅ Pagination
    qb.offset((page - 1) * limit).limit(limit);

    const products = await qb.getRawMany();

    // 2️⃣ Build filters (always fetched, not paginated)
    const rawAttrs: { attrId: number; attrName: string; value: string }[] =
      await this.categoryRepo
        .createQueryBuilder('category')
        .leftJoin('category.products', 'product')
        .leftJoin('product.attrValues', 'attrValue')
        .leftJoin('attrValue.attr', 'attr')
        .where('category.id = :categoryId', { categoryId })
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

    const availableFilters = Array.from(attrMap.values());

    // 3️⃣ Return both
    return {
      products,
      filters: availableFilters,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepo.update(id, updateCategoryDto);
    return await this.categoryRepo.findOne({ where: { id } });
  }

  async remove(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (category) {
      await this.categoryRepo.remove(category);
    }
    return category;
  }
}
