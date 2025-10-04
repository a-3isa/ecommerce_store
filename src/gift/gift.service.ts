import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Gift } from './entities/gift.entity';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class GiftService {
  constructor(
    @InjectRepository(Gift)
    private giftRepository: Repository<Gift>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createGiftDto: CreateGiftDto): Promise<Gift> {
    const {
      triggerProductId,
      giftProductId,
      minQuantity,
      giftQuantity,
      isActive,
    } = createGiftDto;

    const [triggerProduct, giftProduct] = await Promise.all([
      this.productRepository.findOne({ where: { id: triggerProductId } }),
      this.productRepository.findBy({ id: In(giftProductId) }),
    ]);

    if (!triggerProduct) {
      throw new NotFoundException(
        `Trigger product with ID ${triggerProductId} not found`,
      );
    }
    if (giftProduct.length !== giftProductId.length) {
      throw new NotFoundException(`Some gift products not found`);
    }

    const gift = this.giftRepository.create({
      triggerProduct,
      giftProduct,
      minQuantity,
      giftQuantity,
      isActive,
    });

    return await this.giftRepository.save(gift);
  }

  async findAll(): Promise<Gift[]> {
    return this.giftRepository.find({
      relations: ['triggerProduct', 'giftProduct'],
    });
  }

  async findOne(id: string): Promise<Gift> {
    const gift = await this.giftRepository.findOne({
      where: { id },
      relations: ['triggerProduct', 'giftProduct'],
    });

    if (!gift) {
      throw new NotFoundException(`Gift with ID ${id} not found`);
    }

    return gift;
  }

  async update(id: string, updateGiftDto: UpdateGiftDto): Promise<Gift> {
    const gift = await this.findOne(id);

    const {
      triggerProductId,
      giftProductId,
      minQuantity,
      giftQuantity,
      isActive,
    } = updateGiftDto;

    if (triggerProductId) {
      const triggerProduct = await this.productRepository.findOne({
        where: { id: triggerProductId },
      });
      if (!triggerProduct) {
        throw new NotFoundException(
          `Trigger product with ID ${triggerProductId} not found`,
        );
      }
      gift.triggerProduct = triggerProduct;
    }

    if (giftProductId) {
      const giftProducts = await this.productRepository.findBy({
        id: In(giftProductId),
      });
      if (giftProducts.length !== giftProductId.length) {
        throw new NotFoundException(`Some gift products not found`);
      }
      gift.giftProduct = giftProducts;
    }

    if (minQuantity !== undefined) gift.minQuantity = minQuantity;
    if (giftQuantity !== undefined) gift.giftQuantity = giftQuantity;
    if (isActive !== undefined) gift.isActive = isActive;

    return await this.giftRepository.save(gift);
  }

  async remove(id: string): Promise<void> {
    const gift = await this.findOne(id);
    await this.giftRepository.remove(gift);
  }

  // Method to check applicable gifts for a given cart (map of productId to quantity)
  async getApplicableGifts(
    cart: Map<number, number>,
  ): Promise<{ giftProductId: string; quantity: number }[]> {
    const gifts: { giftProductId: string; quantity: number }[] = [];
    const activeGifts = await this.giftRepository.find({
      where: { isActive: true },
      relations: ['triggerProduct', 'giftProduct'],
    });

    for (const gift of activeGifts) {
      const triggerProductId = gift.triggerProduct.id;
      const quantity = cart.get(+triggerProductId) || 0;
      if (quantity >= gift.minQuantity) {
        const eligibleGifts =
          Math.floor(quantity / gift.minQuantity) * gift.giftQuantity;
        for (const giftProduct of gift.giftProduct) {
          gifts.push({
            giftProductId: giftProduct.id,
            quantity: eligibleGifts,
          });
        }
      }
    }

    return gifts;
  }
}
