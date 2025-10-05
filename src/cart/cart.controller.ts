import { Controller, Get, Body, Param, Patch } from '@nestjs/common';
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

  // @Post('add')
  // addToCart(@GetUser() user: User, @Body() addToCartDto: AddToCartDto) {
  //   return this.cartService.addToCart(user, addToCartDto);
  // }

  @Patch()
  updateCart(
    @GetUser() user: User, // ← your custom decorator for current user
    @Body() dto: UpdateCartDto,
  ) {
    return this.cartService.updateCart(user.id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
  //   return this.cartService.update(id, updateCartDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cartService.remove(id);
  // }
}
