import { Injectable, Global } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

export const globalAsyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

@Global()
@Injectable()
export class RequestContextService {
  private static instance: RequestContextService;

  // 싱글톤 인스턴스 얻기
  static getInstance(): RequestContextService {
    if (!RequestContextService.instance) {
      RequestContextService.instance = new RequestContextService();
    }
    return RequestContextService.instance;
  }

  // 요청 ID 가져오기
  getRequestId(): string | undefined {
    return globalAsyncLocalStorage.getStore()?.get('requestId');
  }

  // 요청 컨텍스트 내에서 콜백 실행
  runWithContext<T>(requestId: string, callback: () => Promise<T> | T): Promise<T> {
    const store = new Map<string, any>();
    store.set('requestId', requestId);

    return new Promise<T>((resolve, reject) => {
      globalAsyncLocalStorage.run(store, async () => {
        try {
          const result = await callback();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  // 스토어에서 값 가져오기
  getStoreValue<T>(key: string): T | undefined {
    return globalAsyncLocalStorage.getStore()?.get(key) as T | undefined;
  }

  // 스토어에 값 설정
  setStoreValue(key: string, value: any): void {
    const store = globalAsyncLocalStorage.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  // 전체 스토어 가져오기
  getStore(): Map<string, any> | undefined {
    return globalAsyncLocalStorage.getStore();
  }
}
