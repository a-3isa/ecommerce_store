import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Coupon, DiscountType, CouponType } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Product } from 'src/product/entities/product.entity';
import { CacheLong, CacheWithKey } from '../product/decorators/cache.decorator';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const { applicableProductIds, ...couponData } = createCouponDto;

    const coupon = this.couponRepository.create(couponData);

    if (applicableProductIds && applicableProductIds.length > 0) {
      const products = await this.productRepository.findBy({
        id: In(applicableProductIds),
      });
      coupon.applicableProducts = products;
    }

    return this.couponRepository.save(coupon);
  }

  @CacheLong()
  async findAll(): Promise<Coupon[]> {
    return this.couponRepository.find({ relations: ['applicableProducts'] });
  }

  @CacheWithKey('coupon:findOne', 300000)
  async findOne(id: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { id },
      relations: ['applicableProducts'],
    });
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    return coupon;
  }

  async update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    const { applicableProductIds, ...updateData } = updateCouponDto;

    const coupon = await this.findOne(id);

    Object.assign(coupon, updateData);

    if (applicableProductIds !== undefined) {
      if (applicableProductIds.length > 0) {
        const products =
          await this.productRepository.findByIds(applicableProductIds);
        coupon.applicableProducts = products;
      } else {
        coupon.applicableProducts = [];
      }
    }

    return this.couponRepository.save(coupon);
  }

  async remove(id: string): Promise<void> {
    const coupon = await this.findOne(id);
    await this.couponRepository.remove(coupon);
  }

  // Validation methods
  isExpired(coupon: Coupon): boolean {
    return coupon.expirationDate ? new Date() > coupon.expirationDate : false;
  }

  isUsageLimitReached(coupon: Coupon): boolean {
    return coupon.usageLimit ? coupon.usedCount >= coupon.usageLimit : false;
  }

  isMinOrderValueMet(coupon: Coupon, orderTotal: number): boolean {
    return orderTotal >= coupon.minOrderValue;
  }

  async isValidForOrder(coupon: Coupon, orderTotal: number): Promise<boolean> {
    const isValid =
      coupon.isActive &&
      !this.isExpired(coupon) &&
      !this.isUsageLimitReached(coupon) &&
      this.isMinOrderValueMet(coupon, orderTotal);

    if (
      !isValid &&
      (this.isExpired(coupon) || this.isUsageLimitReached(coupon))
    ) {
      coupon.isActive = false;
      await this.couponRepository.save(coupon);
    }

    return isValid;
  }

  // Discount calculation
  calculateDiscount(coupon: Coupon, price: number): number {
    if (coupon.discountType === DiscountType.FIXED) {
      return Math.min(coupon.discountValue, price);
    } else {
      return (price * coupon.discountValue) / 100;
    }
  }

  // For product-level: check if product is applicable
  isApplicableToProduct(coupon: Coupon, productId: string): boolean {
    if (coupon.type === CouponType.ORDER) return true;
    return coupon.applicableProducts?.some((p) => p.id === productId) ?? false;
  }

  // Apply coupon to order items
  applyCouponToOrder(
    coupon: Coupon,
    orderItems: { productId: string; price: number; quantity: number }[],
    cartTotal: number,
  ): {
    discountedItems: {
      productId: string;
      price: number;
      discountedPrice: number;
      quantity: number;
    }[];
    totalDiscount: number;
  } {
    let totalDiscount = 0;
    const discountedItems = orderItems.map((item) => {
      let discountedPrice = item.price;
      if (coupon.type === CouponType.PRODUCT) {
        if (this.isApplicableToProduct(coupon, item.productId)) {
          const discount = this.calculateDiscount(coupon, item.price);
          discountedPrice = item.price - discount;
          totalDiscount += discount * item.quantity;
        }
      } else {
        // ORDER
        let discountPerUnit = 0;
        if (coupon.discountType === DiscountType.PERCENTAGE) {
          discountPerUnit = (item.price * coupon.discountValue) / 100;
        } else {
          // FIXED
          const itemSubtotal = item.price * item.quantity;
          const proportion = itemSubtotal / cartTotal;
          const itemTotalDiscount = coupon.discountValue * proportion;
          discountPerUnit = itemTotalDiscount / item.quantity;
        }
        discountedPrice = item.price - discountPerUnit;
        totalDiscount += discountPerUnit * item.quantity;
      }
      return { ...item, discountedPrice };
    });

    return { discountedItems, totalDiscount };
  }

  // Increment usage
  async incrementUsage(coupon: Coupon): Promise<void> {
    coupon.usedCount += 1;
    await this.couponRepository.save(coupon);
  }

  @CacheWithKey('coupon:findByCode', 300000)
  async findByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { code },
      relations: ['applicableProducts'],
    });
    if (!coupon) {
      throw new NotFoundException(`Coupon with code ${code} not found`);
    }
    return coupon;
  }
}
