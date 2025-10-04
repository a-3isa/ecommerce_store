import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GiftService } from './gift.service';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';

@Controller('gift')
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @Post()
  create(@Body() createGiftDto: CreateGiftDto) {
    return this.giftService.create(createGiftDto);
  }

  @Get()
  findAll() {
    return this.giftService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.giftService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGiftDto: UpdateGiftDto) {
    return this.giftService.update(id, updateGiftDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giftService.remove(id);
  }

  @Post('check-gifts')
  checkGifts(@Body() cart: { [productId: number]: number }) {
    const cartMap = new Map<number, number>();
    for (const [key, value] of Object.entries(cart)) {
      cartMap.set(+key, value);
    }
    return this.giftService.getApplicableGifts(cartMap);
  }
}
