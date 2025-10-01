import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAttribute } from './entities/product-attr.entity';
import { CreateProductAttributeDto } from './dto/create-product-attr.dto';
import { UpdateProductAttrDto } from './dto/update-product-attr.dto';
import { InsertResult } from 'typeorm/browser';
import { ProductAttrIdDto } from './dto/product-attr-id.dto';

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
      relations: ['products', 'values'],
    });
  }

  async findOne({ id }: ProductAttrIdDto): Promise<ProductAttribute> {
    const productAttr = await this.productAttrRepository.findOne({
      where: { id },
      relations: ['products', 'values'],
    });
    if (!productAttr) {
      throw new NotFoundException(`ProductAttribute with ID ${id} not found`);
    }
    return productAttr;
  }

  async update(
    id: ProductAttrIdDto,
    updateProductAttrDto: UpdateProductAttrDto,
  ): Promise<ProductAttribute> {
    const productAttr = await this.findOne(id);
    Object.assign(productAttr, updateProductAttrDto);
    return this.productAttrRepository.save(productAttr);
  }

  async remove(id: ProductAttrIdDto): Promise<void> {
    const productAttr = await this.findOne(id);
    await this.productAttrRepository.remove(productAttr);
  }
}
