import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private requests = new Map<string, { count: number; resetTime: number }>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const clientIp =
      request.ip || request.connection?.remoteAddress || 'unknown';
    const key = `${clientIp}:${request.method}:${request.url}`;

    const now = Date.now();
    const requestData = this.requests.get(key);

    // Clean up expired entries
    if (requestData && now > requestData.resetTime) {
      this.requests.delete(key);
    }

    // Default rate limits
    const limit = 100; // requests per minute
    const ttl = 60000; // 1 minute in milliseconds

    if (!requestData) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + ttl,
      });

      this.setRateLimitHeaders(response, limit, limit - 1, now + ttl);
      return next.handle();
    }

    if (requestData.count >= limit) {
      this.setRateLimitHeaders(response, limit, 0, requestData.resetTime);
      return throwError(
        () =>
          new HttpException(
            {
              statusCode: HttpStatus.TOO_MANY_REQUESTS,
              message: 'Too many requests',
              error: 'Too Many Requests',
            },
            HttpStatus.TOO_MANY_REQUESTS,
          ),
      );
    }

    requestData.count++;
    this.setRateLimitHeaders(
      response,
      limit,
      limit - requestData.count,
      requestData.resetTime,
    );

    return next.handle().pipe(
      catchError((error: unknown) => {
        // Log rate-limited requests or other errors if needed
        return throwError(() => error);
      }),
    );
  }

  private setRateLimitHeaders(
    response: Response,
    limit: number,
    remaining: number,
    resetTime: number,
  ): void {
    response.header('X-RateLimit-Limit', limit.toString());
    response.header('X-RateLimit-Remaining', remaining.toString());
    response.header('X-RateLimit-Reset', new Date(resetTime).toISOString());
  }
}
