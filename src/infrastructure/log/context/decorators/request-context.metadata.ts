import { REQUEST_CONTEXT_STORAGE } from '@infrastructure/log/context/constants';
import { AsyncLocalStorage } from 'node:async_hooks';
import 'reflect-metadata';

// 메타데이터 키 정의
export const REQUEST_CONTEXT_ENABLED = Symbol('request_context_enabled');
export const REQUEST_CONTEXT_OPTIONS = Symbol('request_context_options');

// 메타데이터 옵션 인터페이스
export interface AsyncRequestContextOptions {
  propagateToCommandQuery?: boolean; // 커맨드/쿼리에 요청 ID를 전파할지
  logEntryExit?: boolean; // 메서드 진입/종료 시 로깅할지
  logger?: any;
}

// AsyncLocalStorage 가져오기 유틸리티
export function getAsyncLocalStorage(target: any): AsyncLocalStorage<Map<string, any>> | undefined {
  return (
    target.asyncStorage || Reflect.getMetadata('asyncStorage', target) || global.moduleRef?.get(REQUEST_CONTEXT_STORAGE)
  );
}

// 요청 ID 가져오기 유틸리티
export function getRequestId(asyncStorage?: AsyncLocalStorage<Map<string, any>>): string | undefined {
  return asyncStorage?.getStore()?.get('requestId');
}

// 요청 컨텍스트 내에서 함수 실행
export async function runWithRequestContext<T>(
  asyncStorage: AsyncLocalStorage<Map<string, any>> | undefined,
  requestId: string | undefined,
  callback: () => Promise<T> | T,
): Promise<T> {
  if (!asyncStorage || !requestId) {
    return callback();
  }

  const currentStore = asyncStorage.getStore();
  const store = new Map<string, any>(currentStore || []);
  store.set('requestId', requestId);

  return new Promise<T>((resolve, reject) => {
    asyncStorage.run(store, async () => {
      try {
        const result = await callback();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  });
}
