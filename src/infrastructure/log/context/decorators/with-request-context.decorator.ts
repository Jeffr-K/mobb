import { Logger } from '@nestjs/common';
import {
  REQUEST_CONTEXT_ENABLED,
  REQUEST_CONTEXT_OPTIONS,
  RequestContextOptions,
  getAsyncLocalStorage,
  getRequestId,
  runWithRequestContext,
} from './request-context.metadata';

/**
 * 메서드 실행 시 현재 요청 컨텍스트를 유지하고 CQRS 객체에 요청 ID를 전파하는 데코레이터
 */
export function WithRequestContext(options: RequestContextOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // 메타데이터 설정
    Reflect.defineMetadata(REQUEST_CONTEXT_ENABLED, true, target, propertyKey);
    Reflect.defineMetadata(REQUEST_CONTEXT_OPTIONS, options, target, propertyKey);

    const originalMethod = descriptor.value;
    const methodLogger = new Logger(`${target.constructor.name}.${propertyKey}`);

    descriptor.value = async function (...args: any[]) {
      // AsyncLocalStorage 가져오기
      const asyncStorage = getAsyncLocalStorage(this);
      if (!asyncStorage) {
        methodLogger.warn('AsyncLocalStorage not found, continuing without request context');
        return originalMethod.apply(this, args);
      }

      // 현재 요청 ID 가져오기
      const currentRequestId = getRequestId(asyncStorage);

      // CQRS 객체 (command/query/event)가 첫 번째 인자인지 확인
      const cqrsObject = args[0];
      if (options.propagateToCommandQuery !== false && cqrsObject && typeof cqrsObject === 'object') {
        // 요청 ID가 없고 현재 컨텍스트에 있으면 추가
        if (!cqrsObject.requestId && currentRequestId) {
          cqrsObject.requestId = currentRequestId;
        }
      }

      // 로깅 설정에 따라 진입 로그 출력
      if (options.logEntryExit !== false && currentRequestId) {
        methodLogger.log(`Entering method with requestId: ${currentRequestId}`);
      }

      try {
        // 요청 컨텍스트와 함께 원본 메서드 실행
        const requestId = cqrsObject?.requestId || currentRequestId;
        const result = await runWithRequestContext(asyncStorage, requestId, () => originalMethod.apply(this, args));

        // 로깅 설정에 따라 종료 로그 출력
        if (options.logEntryExit !== false && requestId) {
          methodLogger.log(`Exiting method with requestId: ${requestId}`);
        }

        return result;
      } catch (error) {
        // 오류 로깅
        const requestId = cqrsObject?.requestId ?? currentRequestId;
        methodLogger.error(`Error in method with requestId: ${requestId ?? 'unknown'}`, error.stack);
        throw error;
      }
    };

    return descriptor;
  };
}
