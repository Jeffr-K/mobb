import { HttpException, HttpStatus } from '@nestjs/common';

export class FeedRegistrationFailedException extends HttpException {
  constructor() {
    super('Feed registration failed', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class FeedNotFoundException extends HttpException {
  constructor() {
    super('Feed not found', HttpStatus.NOT_FOUND);
  }
}
