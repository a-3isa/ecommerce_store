import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GiftService } from './gift.service';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { GiftIdDto } from './dto/gift-id.dto';

@ApiTags('gift')
@Controller('gift')
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new gift rule' })
  @ApiResponse({ status: 201, description: 'Gift rule created successfully' })
  create(@Body() createGiftDto: CreateGiftDto) {
    return this.giftService.create(createGiftDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all gift rules' })
  @ApiResponse({ status: 200, description: 'List of all gift rules' })
  findAll() {
    return this.giftService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get gift rule by ID' })
  @ApiParam({ name: 'id', description: 'Gift rule ID' })
  @ApiResponse({ status: 200, description: 'Gift rule data' })
  @ApiResponse({ status: 404, description: 'Gift rule not found' })
  findOne(@Param() giftId: GiftIdDto) {
    const { id } = giftId;
    return this.giftService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update gift rule by ID' })
  @ApiParam({ name: 'id', description: 'Gift rule ID' })
  @ApiResponse({ status: 200, description: 'Gift rule updated successfully' })
  @ApiResponse({ status: 404, description: 'Gift rule not found' })
  update(@Param() giftId: GiftIdDto, @Body() updateGiftDto: UpdateGiftDto) {
    const { id } = giftId;
    return this.giftService.update(id, updateGiftDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete gift rule by ID' })
  @ApiParam({ name: 'id', description: 'Gift rule ID' })
  @ApiResponse({ status: 200, description: 'Gift rule deleted successfully' })
  @ApiResponse({ status: 404, description: 'Gift rule not found' })
  remove(@Param() giftId: GiftIdDto) {
    const { id } = giftId;
    return this.giftService.remove(id);
  }

  @Post('check-gifts')
  @ApiOperation({ summary: 'Check applicable gifts for cart' })
  @ApiResponse({ status: 200, description: 'List of applicable gifts' })
  checkGifts(@Body() cart: { [productId: number]: number }) {
    const cartMap = new Map<number, number>();
    for (const [key, value] of Object.entries(cart)) {
      cartMap.set(+key, value);
    }
    return this.giftService.getApplicableGifts(cartMap);
  }
}
