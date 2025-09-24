import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

/**
 * Custom caching decorator with configurable key and TTL
 */
export function CacheResponse(key?: string, ttl?: number) {
  const decorators = [UseInterceptors(CacheInterceptor)];

  if (key) {
    decorators.push(CacheKey(key));
  }

  if (ttl) {
    decorators.push(CacheTTL(ttl));
  }

  return applyDecorators(...decorators);
}

/**
 * Cache with short TTL for frequently changing data
 */
export function CacheShort() {
  return CacheResponse(undefined, 30000); // 30 seconds
}

/**
 * Cache with medium TTL for moderately changing data
 */
export function CacheMedium() {
  return CacheResponse(undefined, 300000); // 5 minutes
}

/**
 * Cache with long TTL for rarely changing data
 */
export function CacheLong() {
  return CacheResponse(undefined, 900000); // 15 minutes
}

/**
 * Cache with custom key for specific data
 */
export function CacheWithKey(key: string, ttl?: number) {
  return CacheResponse(key, ttl);
}
