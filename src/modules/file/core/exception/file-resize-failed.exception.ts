import { HttpException, HttpStatus } from '@nestjs/common';

export class FileResizeFailedException extends HttpException {
  constructor(reason?: string) {
    super(`FeedCategory registration failed: ${!reason ? 'unknown' : reason}`, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
