import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

interface RateLimitOptions {
  limit: number;
  ttl: number;
}

interface RequestWithConnection {
  ip?: string;
  connection?: {
    remoteAddress?: string;
  };
  method?: string;
  url?: string;
}

interface ResponseWithHeader {
  header: (name: string, value: string) => void;
}

@Injectable()
export class ProductRateLimitGuard implements CanActivate {
  private requests = new Map<string, { count: number; resetTime: number }>();

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request: RequestWithConnection = context.switchToHttp().getRequest();
    const response: ResponseWithHeader = context.switchToHttp().getResponse();

    const clientIp =
      request.ip || request.connection?.remoteAddress || 'unknown';
    const key = `${clientIp}:${request.method}:${request.url}`;

    const now = Date.now();
    const requestData = this.requests.get(key);

    // Clean up expired entries
    if (requestData && now > requestData.resetTime) {
      this.requests.delete(key);
    }

    // Default limits (can be overridden by decorators)
    const options: RateLimitOptions = this.reflector.get<RateLimitOptions>(
      'rateLimit',
      context.getHandler(),
    ) || {
      limit: 100,
      ttl: 60000, // 1 minute
    };

    if (!requestData) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + options.ttl,
      });

      this.setRateLimitHeaders(
        response,
        options.limit,
        options.limit - 1,
        now + options.ttl,
      );
      return true;
    }

    if (requestData.count >= options.limit) {
      this.setRateLimitHeaders(
        response,
        options.limit,
        0,
        requestData.resetTime,
      );
      return false;
    }

    requestData.count++;
    this.setRateLimitHeaders(
      response,
      options.limit,
      options.limit - requestData.count,
      requestData.resetTime,
    );
    return true;
  }

  private setRateLimitHeaders(
    response: ResponseWithHeader,
    limit: number,
    remaining: number,
    resetTime: number,
  ): void {
    response.header('X-RateLimit-Limit', limit.toString());
    response.header('X-RateLimit-Remaining', remaining.toString());
    response.header('X-RateLimit-Reset', new Date(resetTime).toISOString());
  }
}
