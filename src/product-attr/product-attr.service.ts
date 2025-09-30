import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAttribute } from './entities/product-attr.entity';
import { CreateProductAttributeDto } from './dto/create-product-attr.dto';
import { UpdateProductAttrDto } from './dto/update-product-attr.dto';
import { InsertResult } from 'typeorm/browser';

@Injectable()
export class ProductAttrService {
  constructor(
    @InjectRepository(ProductAttribute)
    private productAttrRepository: Repository<ProductAttribute>,
  ) {}

  async create(
    createProductAttrDto: CreateProductAttributeDto,
  ): Promise<InsertResult> {
    const productAttr = this.productAttrRepository.create(createProductAttrDto);
    return this.productAttrRepository.insert(productAttr);
  }

  async findAll(): Promise<ProductAttribute[]> {
    return this.productAttrRepository.find({
      relations: ['product', 'values'],
    });
  }

  async findOne(id: string): Promise<ProductAttribute> {
    const productAttr = await this.productAttrRepository.findOne({
      where: { id },
      relations: ['product', 'values'],
    });
    if (!productAttr) {
      throw new NotFoundException(`ProductAttribute with ID ${id} not found`);
    }
    return productAttr;
  }

  async update(
    id: string,
    updateProductAttrDto: UpdateProductAttrDto,
  ): Promise<ProductAttribute> {
    const productAttr = await this.findOne(id);
    Object.assign(productAttr, updateProductAttrDto);
    return this.productAttrRepository.save(productAttr);
  }

  async remove(id: string): Promise<void> {
    const productAttr = await this.findOne(id);
    await this.productAttrRepository.remove(productAttr);
  }
}
