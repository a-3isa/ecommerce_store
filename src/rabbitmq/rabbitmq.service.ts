import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Order } from 'src/order/entities/order.entity';

@Injectable()
export class RabbitMQService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async sendOrderConfirmationEmail(order: Order) {
    await this.amqpConnection.publish(
      'email_exchange',
      'email.order.confirm',
      order,
    );
    console.log('📤 Message published to RabbitMQ');
  }
}
