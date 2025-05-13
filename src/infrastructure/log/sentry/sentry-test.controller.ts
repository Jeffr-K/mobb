import { Controller, Get } from '@nestjs/common';

@Controller('test-sentry')
export class SentryTestController {
  @Get()
  async triggerError(): Promise<string> {
    throw new Error('This is a test error for Sentry');
  }
}
