import { REQUEST_CONTEXT_STORAGE } from '@infrastructure/log/context/constants';
import { AsyncLocalStorage } from 'node:async_hooks';

/**
 * 클래스 멤버 변수에 요청 ID 를 주입하는 데코레이터
 */
export function RequestId() {
  return function (target: any, propertyKey: string) {
    // requestId 프로퍼티를 정의하고 게터 설정
    Object.defineProperty(target, propertyKey, {
      get: function () {
        // this 컨텍스트에서 AsyncLocalStorage 가져오기 시도
        const asyncStorage: AsyncLocalStorage<Map<string, any>> =
          this.asyncStorage ??
          Reflect.getMetadata('asyncStorage', this) ??
          global.moduleRef?.get(REQUEST_CONTEXT_STORAGE);

        return asyncStorage?.getStore()?.get('requestId');
      },
      enumerable: true,
      configurable: true,
    });
  };
}
