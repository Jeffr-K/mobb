import Transport from 'winston-transport';
import * as Sentry from '@sentry/node';

export class SentryTransport extends Transport {
  constructor(options = {}) {
    super(options);
  }

  log(info: { [x: string]: any; level: any; message: any }, callback: () => void) {
    const { level, message, ...meta } = info;

    if (level === 'error') {
      Sentry.captureMessage(message, {
        level: 'error' as Sentry.SeverityLevel,
        extra: meta,
      });
    } else if (level === 'warn') {
      Sentry.captureMessage(message, {
        level: 'warning' as Sentry.SeverityLevel,
        extra: meta,
      });
    }

    callback();
  }
}
