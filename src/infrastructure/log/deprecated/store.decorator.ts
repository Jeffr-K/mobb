import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_CONTEXT_STORAGE } from '@infrastructure/log/context/constants';
import { AsyncLocalStorage } from 'node:async_hooks';

/**
 * AsyncLocalStorage의 스토어 또는 특정 키 값을 파라미터로 주입하는 데코레이터
 * @param key (선택사항) 스토어에서 가져올 특정 키. 지정하지 않으면 전체 스토어 맵을 반환
 */
export const Store = createParamDecorator((key: string | undefined, ctx: ExecutionContext) => {
  // NestJS 컨텍스트에서는 컨텍스트를 통해 AsyncLocalStorage를 가져올 수 있지만
  // CQRS 핸들러 등에서는 의존성 주입으로 가져와야 함
  const req = ctx?.switchToHttp()?.getRequest();

  // 글로벌 모듈에서 AsyncLocalStorage 가져오기 시도
  const asyncStorage: AsyncLocalStorage<Map<string, any>> =
    req?.app?.get(REQUEST_CONTEXT_STORAGE) ?? global.moduleRef?.get(REQUEST_CONTEXT_STORAGE);

  if (!asyncStorage) {
    return key ? undefined : new Map<string, any>();
  }

  const store = asyncStorage.getStore();

  // 키가 제공되면 해당 키의 값을 반환, 아니면 전체 스토어 반환
  return key ? store?.get(key) : store;
});

/**
 * AsyncLocalStorage의 특정 키 값을 파라미터로 주입하는 데코레이터 (비 NestJS 컨텍스트용)
 * CQRS 핸들러 등에서 사용
 */
export function StoreValue(key?: string) {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
    // 원본 메서드 레퍼런스 저장
    const originalMethod = target[propertyKey];

    // 메서드 오버라이드
    target[propertyKey] = function (...args: any[]) {
      // this 컨텍스트에서 AsyncLocalStorage 가져오기 시도
      const asyncStorage: AsyncLocalStorage<Map<string, any>> =
        this.asyncStorage ||
        Reflect.getMetadata('asyncStorage', this) ||
        global.moduleRef?.get(REQUEST_CONTEXT_STORAGE);

      if (asyncStorage) {
        const store = asyncStorage.getStore();

        // 키가 제공되면 해당 키의 값을 인자로 전달, 아니면 전체 스토어 전달
        args[parameterIndex] = key ? store?.get(key) : store;
      }

      return originalMethod.apply(this, args);
    };
  };
}
