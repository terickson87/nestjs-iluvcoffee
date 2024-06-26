import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ConfigModule } from '@nestjs/config';
import { WrapResponseInterceptor } from './interceptors/wrap-response.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  imports: [ConfigModule],
  providers: [
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    { provide: APP_INTERCEPTOR, useClass: WrapResponseInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
