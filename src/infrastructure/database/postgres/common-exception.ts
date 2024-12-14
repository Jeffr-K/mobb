import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUUIDFormatException extends HttpException {
  constructor() {
    super('Invalid UUID format', HttpStatus.BAD_REQUEST);
  }
}

export class DatabaseOperationException extends HttpException {
  constructor(message: string) {
    super(`Database operation failed: ${message}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
