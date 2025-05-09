import { AsyncLocalStorage } from 'node:async_hooks';
import * as Sentry from '@sentry/node';

export class RequestContextUtils {
  /**
   * AsyncLocalStorage 에서 요청 ID 조회.
   */
  static getRequestId(asyncStorage?: AsyncLocalStorage<Map<string, any>>): string | undefined {
    return asyncStorage?.getStore()?.get('requestId');
  }

  /**
   * Sentry 스코프에 요청 ID 를 태그 추가.
   */
  static setSentryRequestIdTag(asyncStorage?: AsyncLocalStorage<Map<string, any>>): void {
    const requestId = this.getRequestId(asyncStorage);

    if (requestId) {
      Sentry.withScope((scope) => {
        scope.setTag('requestId', requestId);
      });
    }
  }

  /**
   * Sentry.withScope 함수와 함께 요청 ID 를 사용하는 유틸리티 함수.
   */
  static withSentryScope<T>(
    asyncStorage: AsyncLocalStorage<Map<string, any>> | undefined,
    callback: (scope: Sentry.Scope) => T,
  ): T {
    return Sentry.withScope((scope) => {
      const requestId = this.getRequestId(asyncStorage);
      if (requestId) {
        scope.setTag('requestId', requestId);
      }
      return callback(scope);
    });
  }
}
