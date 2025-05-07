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

export class FeedCategoryRegistrationFailedException extends HttpException {
  constructor(message: string = 'FeedCategory registration failed') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ParentCategoryNotFoundException extends HttpException {
  constructor() {
    super('Parent category not found', HttpStatus.NOT_FOUND);
  }
}

export class FeedCategoryNotFoundException extends HttpException {
  constructor(message: string = 'FeedCategory not found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class FeedCategoryDeletionFailedException extends HttpException {
  constructor(message: string = 'FeedCategory deletion failed') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class FeedCategoryHasAssociatedFeedsException extends HttpException {
  constructor(message: string = 'FeedCategory has associated feeds') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
