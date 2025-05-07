import { HttpException, HttpStatus } from '@nestjs/common';

export class FeedCategoryRegistrationFailedException extends HttpException {
  constructor(reason?: string) {
    super(`FeedCategory registration failed: ${!reason ? 'unknown' : reason}`, HttpStatus.BAD_REQUEST);
  }
}
