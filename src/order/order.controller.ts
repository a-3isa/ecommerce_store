import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  Res,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Request, Response } from 'express';
import { ShipmentIndexesDto } from './dto/shipment-index.dto';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/checkout')
  @ApiOperation({ summary: 'Checkout and pay with Stripe' })
  @ApiResponse({ status: 201, description: 'Payment initiated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  payStripe(
    @Body() shipmentIndexes: ShipmentIndexesDto,
    @GetUser() user: User,
  ) {
    return this.orderService.payStripe(shipmentIndexes, user);
  }

  // @Post('/checkout')
  // payStripe(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
  //   return this.orderService.payStripe(createOrderDto, user);
  // }

  @Post('/webhook')
  @ApiOperation({ summary: 'Handle Stripe webhook' })
  @ApiHeader({ name: 'stripe-signature', description: 'Stripe signature' })
  @ApiResponse({ status: 200, description: 'Webhook handled successfully' })
  @ApiResponse({ status: 400, description: 'Webhook error' })
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      const result = await this.orderService.handleWebhook(req.body, signature);
      res.json(result);
    } catch (error) {
      res.status(400).send(`Webhook Error: ${error}`);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get user orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  findAll(@GetUser() user: User) {
    return this.orderService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Param() id: string, @GetUser() user: User) {
    return this.orderService.findOne(id, user);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.orderService.update(id, updateOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string, @GetUser() user: User) {
  //   return this.orderService.remove(id, user);
  // }
}
