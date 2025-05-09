import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { RequestContextMiddleware } from '@infrastructure/log/context/request-context.middleware';
import { REQUEST_CONTEXT_STORAGE } from '@infrastructure/log/context/constants';

@Global()
@Module({
  providers: [
    {
      provide: REQUEST_CONTEXT_STORAGE,
      useValue: new AsyncLocalStorage(),
    },
    RequestContextMiddleware,
  ],
  exports: [REQUEST_CONTEXT_STORAGE, RequestContextMiddleware],
})
export class RequestContextModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
