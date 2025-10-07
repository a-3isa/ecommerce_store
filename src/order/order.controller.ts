import { Controller, Post, Body, Headers, Req, Res } from '@nestjs/common';
import { OrderService } from './order.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Request, Response } from 'express';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/checkout')
  payStripe(@GetUser() user: User) {
    return this.orderService.payStripe(user);
  }

  // @Post('/checkout')
  // payStripe(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
  //   return this.orderService.payStripe(createOrderDto, user);
  // }

  @Post('/webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      const result = await this.orderService.handleWebhook(req.body, signature);
      res.json(result);
    } catch (error) {
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }

  // @Get()
  // findAll(@GetUser() user: User) {
  //   return this.orderService.findAll(user);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string, @GetUser() user: User) {
  //   return this.orderService.findOne(id, user);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateOrderDto: UpdateOrderDto,
  //   @GetUser() user: User,
  // ) {
  //   return this.orderService.update(id, updateOrderDto, user);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string, @GetUser() user: User) {
  //   return this.orderService.remove(id, user);
  // }
}
