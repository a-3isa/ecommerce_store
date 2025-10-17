import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CouponIdDto } from './dto/coupon-id.dto';
import { CouponCodeDto } from './dto/coupon-code.dto';
import { CacheInterceptor } from 'node_modules/@nestjs/cache-manager';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  findAll() {
    return this.couponService.findAll();
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  findOne(@Param() couponId: CouponIdDto) {
    const { id } = couponId;
    return this.couponService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param() couponId: CouponIdDto,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    const { id } = couponId;
    return this.couponService.update(id, updateCouponDto);
  }

  @Delete(':id')
  remove(@Param() couponId: CouponIdDto) {
    const { id } = couponId;
    return this.couponService.remove(id);
  }

  @Get('code/:code')
  @UseInterceptors(CacheInterceptor)
  findByCode(@Param() couponCode: CouponCodeDto) {
    const { code } = couponCode;
    return this.couponService.findByCode(code);
  }
}
