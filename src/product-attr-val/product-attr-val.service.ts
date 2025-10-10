import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { ProductAttributeValue } from './entities/product-attr-val.entity';
import { CreateProductAttrValDto } from './dto/create-product-attr-val.dto';
import { UpdateProductAttrValDto } from './dto/update-product-attr-val.dto';
import { ProductAttribute } from 'src/product-attr/entities/product-attr.entity';

@Injectable()
export class ProductAttrValService {
  constructor(
    @InjectRepository(ProductAttributeValue)
    private productAttrValRepository: Repository<ProductAttributeValue>,
    @InjectRepository(ProductAttribute)
    private productAttrRepository: Repository<ProductAttribute>,
  ) {}

  async create(
    createProductAttrValDto: CreateProductAttrValDto,
  ): Promise<InsertResult> {
    // console.log(createProductAttrValDto);
    const { attrId, value } = createProductAttrValDto;
    const productAttr = await this.productAttrRepository.findOne({
      where: { id: attrId },
    });
    if (!productAttr) {
      throw new NotFoundException(
        `ProductAttribute with ID ${attrId} not found`,
      );
    }
    const productAttrVal = this.productAttrValRepository.create({
      value,
      attr: productAttr,
    });
    return this.productAttrValRepository.insert(productAttrVal);
  }

  async findAll(): Promise<ProductAttributeValue[]> {
    return this.productAttrValRepository.find({
      relations: ['attr', 'variants'],
    });
  }

  async findOne(id: string): Promise<ProductAttributeValue> {
    const productAttrVal = await this.productAttrValRepository.findOne({
      where: { id },
      relations: ['attr', 'variants'],
    });
    if (!productAttrVal) {
      throw new NotFoundException(
        `ProductAttributeValue with ID ${id} not found`,
      );
    }
    return productAttrVal;
  }

  async update(
    id: string,
    updateProductAttrValDto: UpdateProductAttrValDto,
  ): Promise<ProductAttributeValue> {
    const productAttrVal = await this.findOne(id);
    Object.assign(productAttrVal, updateProductAttrValDto);
    return this.productAttrValRepository.save(productAttrVal);
  }

  async remove(id: string): Promise<void> {
    const productAttrVal = await this.findOne(id);
    await this.productAttrValRepository.remove(productAttrVal);
  }
}
