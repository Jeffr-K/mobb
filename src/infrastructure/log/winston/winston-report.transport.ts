import Transport from 'winston-transport';
import * as Sentry from '@sentry/node';
import { Inject, Optional } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { RequestContextUtils } from '@infrastructure/log/context/request-context-utils';
import { Scope, SeverityLevel } from '@sentry/node';
import { REQUEST_CONTEXT_STORAGE } from '@infrastructure/log/context/constants';

export class SentryReportTransport extends Transport {
  private readonly asyncStorage?: AsyncLocalStorage<Map<string, any>>;

  constructor(
    options = {},
    @Optional() @Inject(REQUEST_CONTEXT_STORAGE) asyncStorage?: AsyncLocalStorage<Map<string, any>>,
  ) {
    super(options);
    this.asyncStorage = asyncStorage;
  }

  /**
   * SentryTransport `log()`
   * Winston 로그를 Sentry로 전송합니다.
   * @param info 로그 정보
   * @param callback 완료 후 호출할 콜백 함수
   */
  log(info: { [x: string]: any; level: any; message: any }, callback: () => void) {
    const { level, message, ...meta } = info;

    RequestContextUtils.withSentryScope(this.asyncStorage, (scope) => {
      scope.setExtras(meta);

      this.processBySeverity(scope, level, message);
    });

    callback();
  }

  /**
   * 로그 레벨(심각도)에 따라 Sentry 메시지를 처리.
   * @param scope Sentry 스코프
   * @param level 로그 레벨
   * @param message 로그 메시지
   */
  private processBySeverity(scope: Scope, level: string, message: string): void {
    switch (level) {
      case 'error':
        this.captureWithSeverity(scope, message, 'error');
        break;
      case 'warn':
        this.captureWithSeverity(scope, message, 'warning');
        break;
      case 'info':
        this.captureWithSeverity(scope, message, 'info');
        break;
      case 'debug':
        this.captureWithSeverity(scope, message, 'debug');
        break;
      default:
        this.handleUnknownLevel(scope, level, message);
        break;
    }
  }

  /**
   * 지정된 심각도로 Sentry 메시지를 캡처.
   * @param scope Sentry 스코프
   * @param message 로그 메시지
   * @param severity 심각도 레벨
   */
  private captureWithSeverity(scope: Scope, message: string, severity: SeverityLevel): void {
    scope.setLevel(severity);
    Sentry.captureMessage(message, severity);
  }

  /**
   * 알 수 없는 로그 레벨을 처리.
   * @param scope Sentry 스코프
   * @param level 원본 로그 레벨
   * @param message 로그 메시지
   */
  private handleUnknownLevel(scope: Scope, level: string, message: string): void {
    scope.setLevel('info');
    scope.setTag('unknown', level);
    scope.setContext('log_details', {
      original_level: level,
      message_type: typeof message,
      timestamp: new Date().toISOString(),
    });

    console.warn(`Unknown log level '${level}' sent to SentryTransport`);
    Sentry.captureMessage(`[Unknown Level] ${message}`, 'info');
  }
}