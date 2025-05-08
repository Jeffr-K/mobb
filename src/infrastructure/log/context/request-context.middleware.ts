import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { v4 } from 'uuid';
import { REQUEST_CONTEXT_STORAGE } from './constants';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {

  constructor(@Inject(REQUEST_CONTEXT_STORAGE) private readonly als: AsyncLocalStorage<Map<string, any>>) {}

  use(req: any, res: any, next: (error?: any) => void) {
    const requestId = req.headers['x-request-id'] ?? v4();
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);

    const store = new Map<string, any>();
    store.set('requestId', requestId);

    this.als.run(store, next);
  }
}