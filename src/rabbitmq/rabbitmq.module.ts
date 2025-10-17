import { Module } from '@nestjs/common';
import { RabbitMQModule as GolevelupRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  imports: [
    GolevelupRabbitMQModule.forRoot({
      uri: 'amqp://guest:guest@localhost:5672',
      exchanges: [
        {
          name: 'email_exchange',
          type: 'topic',
        },
      ],
    }),
  ],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
