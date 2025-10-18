import { Controller, Get, Body, Patch } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiTags('cart')
@ApiBearerAuth('JWT-auth')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: "Get user's cart" })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMyCart(@GetUser() user: User) {
    return this.cartService.getCartByUser(user);
  }

  @Patch()
  @ApiOperation({ summary: 'Update cart items' })
  @ApiResponse({ status: 200, description: 'Cart updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateCart(@GetUser() user: User, @Body() dto: UpdateCartDto) {
    return this.cartService.updateCart(user, dto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cartService.findOne(id);
  // }
}
