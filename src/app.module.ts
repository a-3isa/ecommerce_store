import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ProductAttrModule } from './product-attr/product-attr.module';
import { ProductAttrValModule } from './product-attr-val/product-attr-val.module';
import { ProductAttrVarModule } from './product-attr-var/product-attr-var.module';
import { GiftModule } from './gift/gift.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { TransactionModule } from './transaction/transaction.module';
import { CouponModule } from './coupon/coupon.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { MailerModule } from 'node_modules/@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'),
          secure: false,
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASS'),
          },
        },
        template: {
          dir: process.cwd() + '/templates',
          adapter: new HandlebarsAdapter(), // use handlebars
          options: {
            strict: true,
          },
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        port: configService.get('DB_PORT'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: configService.get('DB_AUTO_LOAD_ENTITIES') === 'true',
        synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    ProductAttrModule,
    ProductAttrValModule,
    ProductAttrVarModule,
    GiftModule,
    CartModule,
    OrderModule,
    TransactionModule,
    CouponModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
