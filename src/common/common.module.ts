import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { RateLimitInterceptor } from './interceptors/rate-limit.interceptor';
import { ValidationPipe } from './pipes/validation.pipe';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimitInterceptor,
    },
    {
      // Applies @Exclude() on entities, so password hashes never leave the API.
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  // Removed exports as these are global providers and shouldn't be exported
})
export class CommonModule {}
