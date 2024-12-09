import { HttpStatus } from '@nestjs/common';
import { ExceptionCode } from './user.exception.code';
import { BaseException } from 'src/infrastructure/utils/structure/base-exception';

// https://velog.io/@cataiden/nestjs-custom-exception
export class UserNotFoundException extends Error {
  constructor() {
    super('사용자를 찾을 수 없습니다.');
    this.name = 'UserNotFoundException';
  }
}

export class UserCannotEditEmailException extends BaseException {
  constructor() {
    super(ExceptionCode.CANNOT_EDIT_EMAIL, HttpStatus.BAD_REQUEST);
  }
}

export class UserCannotEditPasswordException extends BaseException {
  constructor() {
    super(ExceptionCode.CANNOT_EDIT_PASSWORD, HttpStatus.BAD_REQUEST);
  }
}

export class UserCannotEditNationException extends BaseException {
  constructor() {
    super(ExceptionCode.CANNOT_EDIT_NATION, HttpStatus.BAD_REQUEST);
  }
}

export class UserAlreadyExistsException extends BaseException {
  constructor() {
    super(ExceptionCode.USER_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
  }
}
