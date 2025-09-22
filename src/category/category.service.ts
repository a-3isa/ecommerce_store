import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

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

  async findAll() {
    const categories = await this.categoryRepo.find();
    return categories;
  }

  async findOne(id: string) {
    return await this.categoryRepo.findOne({ where: { id } });
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
