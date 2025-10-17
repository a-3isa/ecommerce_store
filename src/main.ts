import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { raw } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/order/webhook', raw({ type: 'application/json' }));
  // Global validation, rate limiting, and error handling are now handled by CommonModule
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
