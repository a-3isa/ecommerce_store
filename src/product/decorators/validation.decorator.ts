import { applyDecorators, UsePipes, ValidationPipe } from '@nestjs/common';

/**
 * Validation decorator with custom options
 */
export function ValidateRequest() {
  return applyDecorators(
    UsePipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    ),
  );
}

/**
 * Validation decorator for optional request body
 */
export function ValidateOptional() {
  return applyDecorators(
    UsePipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
        skipMissingProperties: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    ),
  );
}
