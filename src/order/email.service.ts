import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Order } from './entities/order.entity';
import { RabbitSubscribe } from 'node_modules/@golevelup/nestjs-rabbitmq/lib';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  @RabbitSubscribe({
    exchange: 'email_exchange',
    routingKey: 'email.order.confirm',
    queue: 'email_queue',
  })
  async sendOrderConfirmationEmail(order: Order): Promise<void> {
    const user = order.user;
    const items = order.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
    }));
    console.log('*******************');
    const sender = {
      address: 'hello@demomailtrap.co',
      name: 'Mailtrap Test',
    };

    await this.mailerService.sendMail({
      from: sender,
      to: user.email,
      subject: 'Order Confirmation - Your Order Has Been Paid Successfully',
      template: './order-confirmation',
      context: {
        userName: user.username,
        orderId: order.id,
        total: order.total,
        discountAmount: order.discountAmount,
        orderDate: order.createdAt,
        items: items,
      },
    });
  }
}
