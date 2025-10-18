import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { raw } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Ecommerce Store API')
    .setDescription('API documentation for the Ecommerce Store backend')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('categories', 'Category management')
    .addTag('products', 'Product management')
    .addTag('cart', 'Shopping cart')
    .addTag('orders', 'Order management')
    .addTag('transactions', 'Transaction management')
    .addTag('coupons', 'Coupon management')
    .addTag('gifts', 'Gift management')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.use('/order/webhook', raw({ type: 'application/json' }));
  // Global validation, rate limiting, and error handling are now handled by CommonModule
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
