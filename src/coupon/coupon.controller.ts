import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CouponIdDto } from './dto/coupon-id.dto';
import { CouponCodeDto } from './dto/coupon-code.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { RoleGuard } from 'src/auth/roles.guard';

@ApiTags('coupon')
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @UseGuards(RoleGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new coupon' })
  @ApiResponse({ status: 201, description: 'Coupon created successfully' })
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @UseGuards(RoleGuard)
  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get all coupons' })
  @ApiResponse({ status: 200, description: 'List of all coupons' })
  findAll() {
    return this.couponService.findAll();
  }

  @UseGuards(RoleGuard)
  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get coupon by ID' })
  @ApiParam({ name: 'id', description: 'Coupon ID' })
  @ApiResponse({ status: 200, description: 'Coupon data' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  findOne(@Param() couponId: CouponIdDto) {
    const { id } = couponId;
    return this.couponService.findOne(id);
  }

  @UseGuards(RoleGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update coupon by ID' })
  @ApiParam({ name: 'id', description: 'Coupon ID' })
  @ApiResponse({ status: 200, description: 'Coupon updated successfully' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  update(
    @Param() couponId: CouponIdDto,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    const { id } = couponId;
    return this.couponService.update(id, updateCouponDto);
  }

  @UseGuards(RoleGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete coupon by ID' })
  @ApiParam({ name: 'id', description: 'Coupon ID' })
  @ApiResponse({ status: 200, description: 'Coupon deleted successfully' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  remove(@Param() couponId: CouponIdDto) {
    const { id } = couponId;
    return this.couponService.remove(id);
  }

  @Get('code/:code')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get coupon by code' })
  @ApiParam({ name: 'code', description: 'Coupon code' })
  @ApiResponse({ status: 200, description: 'Coupon data' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  findByCode(@Param() couponCode: CouponCodeDto) {
    const { code } = couponCode;
    return this.couponService.findByCode(code);
  }
}
