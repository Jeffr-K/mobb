import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { AsyncLocalStorage } from 'async_hooks';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RequestContextUtils } from '../context/request-context-utils';
import { REQUEST_CONTEXT_STORAGE } from '@infrastructure/log/context/constants';
import { Scope } from '@sentry/node';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  constructor(
    @Inject(REQUEST_CONTEXT_STORAGE) private readonly asyncStorage?: AsyncLocalStorage<Map<string, any>>,
  ) {}

  /**
   * Sentry Interceptor
   * HTTP 요청을 가로채 Sentry 에 오류를 기록.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    RequestContextUtils.setSentryRequestIdTag(this.asyncStorage);

    return next.handle().pipe(
      catchError((error) => {
        this.captureException(error);
        throw error;
      }),
    );
  }

  /**
   * 예외를 Sentry 에 캡처하고 관련 컨텍스트 정보 추가.
   */
  private captureException(error: any): void {
    RequestContextUtils.withSentryScope(this.asyncStorage, (scope) => {
      this.setBasicErrorInfo(scope, error);
      this.addHttpContextIfAvailable(scope, error);
      Sentry.captureException(error);
    });
  }

  /**
   * 기본 오류 정보를 Sentry 스코프에 설정.
   */
  private setBasicErrorInfo(scope: Sentry.Scope, error: any): void {
    scope.setLevel('error');
    scope.setTag('errorType', error.name ?? typeof error);

    if (error.message) {
      scope.setExtra('errorMessage', error.message);
    }

    if (error.stack) {
      scope.setExtra('stackTrace', error.stack);
    }
  }

  /**
   * HTTP 관련 컨텍스트 정보가 있으면 Sentry 스코프에 추가
   */
  private addHttpContextIfAvailable(scope: Scope, error: any): void {
    if (error.status) {
      scope.setTag('statusCode', error.status.toString());
    }

    if (error.request) {
      scope.setContext('requestDetails', this.sanitizeRequestData(error.request));
    }

    if (error.response) {
      scope.setContext('responseDetails', this.sanitizeResponseData(error.response));
    }
  }

  /**
   * 요청 데이터에서 민감한 정보를 제거하고 필요한 정보만 추출
   */
  private sanitizeRequestData(request: Request): Record<string, any> {
    const sanitizedHeaders = { ...request.headers };

    ['authorization', 'cookie'].forEach((header) => {
      if (sanitizedHeaders[header]) {
        sanitizedHeaders[header] = '[REDACTED]';
      }
    });

    return {
      method: request.method,
      url: request.url,
      headers: sanitizedHeaders,
    };
  }

  /**
   * 응답 데이터에서 필요한 정보만 추출
   */
  private sanitizeResponseData(response: Response): Record<string, any> {
    return {
      status: response.status,
      statusText: response.statusText,
    };
  }
}
