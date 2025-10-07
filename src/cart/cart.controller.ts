import { Controller, Get, Body, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('me')
  getMyCart(@GetUser() user: User) {
    return this.cartService.getCartByUser(user);
  }

  @Patch()
  updateCart(@GetUser() user: User, @Body() dto: UpdateCartDto) {
    return this.cartService.updateCart(user, dto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cartService.findOne(id);
  // }
}
