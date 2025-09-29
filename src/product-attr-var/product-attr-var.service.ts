import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from './entities/product-attr-var.entity';
import { CreateProductAttrVarDto } from './dto/create-product-attr-var.dto';
import { UpdateProductAttrVarDto } from './dto/update-product-attr-var.dto';

@Injectable()
export class ProductAttrVarService {
  constructor(
    @InjectRepository(ProductVariant)
    private productAttrVarRepository: Repository<ProductVariant>,
  ) {}

  async create(
    createProductAttrVarDto: CreateProductAttrVarDto,
  ): Promise<ProductVariant> {
    const productAttrVar = this.productAttrVarRepository.create(
      createProductAttrVarDto,
    );
    return this.productAttrVarRepository.save(productAttrVar);
  }

  async findAll(): Promise<ProductVariant[]> {
    return this.productAttrVarRepository.find({
      relations: ['product', 'attributeValues'],
    });
  }

  async findOne(id: string): Promise<ProductVariant> {
    const productAttrVar = await this.productAttrVarRepository.findOne({
      where: { id },
      relations: ['product', 'attributeValues'],
    });
    if (!productAttrVar) {
      throw new NotFoundException(`ProductVariant with ID ${id} not found`);
    }
    return productAttrVar;
  }

  async update(
    id: string,
    updateProductAttrVarDto: UpdateProductAttrVarDto,
  ): Promise<ProductVariant> {
    const productAttrVar = await this.findOne(id);
    Object.assign(productAttrVar, updateProductAttrVarDto);
    return this.productAttrVarRepository.save(productAttrVar);
  }

  async remove(id: string): Promise<void> {
    const productAttrVar = await this.findOne(id);
    await this.productAttrVarRepository.remove(productAttrVar);
  }
}
