import { Logger } from '@nestjs/common';

/**
 * Simple logging decorator for controller methods
 */
export function LogMethod() {
  return function (
    target: object,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value as (...args: unknown[]) => unknown;
    const logger = new Logger(`${target.constructor.name}.${propertyName}`);

    const wrappedMethod = async function (this: unknown, ...args: unknown[]) {
      const startTime = Date.now();
      logger.log(`🚀 Method called: ${propertyName}`);

      try {
        const result = await (
          originalMethod as (...args: unknown[]) => unknown
        )(...args);
        const executionTime = Date.now() - startTime;

        logger.log(`✅ Method completed: ${propertyName} (${executionTime}ms)`);
        return result;
      } catch (error: unknown) {
        const executionTime = Date.now() - startTime;
        const errorMessage = `❌ Method failed: ${propertyName} (${executionTime}ms)`;

        // Safely access error properties
        const stack = error instanceof Error ? error.stack : undefined;

        logger.error(errorMessage, stack);
        throw error;
      }
    };

    Object.defineProperty(descriptor, 'value', {
      value: wrappedMethod,
      writable: true,
    });
  };
}
