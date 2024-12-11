import { HttpException, HttpStatus } from '@nestjs/common';

export class OrganizationNameAlreadyRegisteredException extends HttpException {
  constructor() {
    super('Organization name is already registered', HttpStatus.CONFLICT);
  }
}

export class OrganizationNotFoundException extends HttpException {
  constructor() {
    super('Organization not found', HttpStatus.NOT_FOUND);
  }
}