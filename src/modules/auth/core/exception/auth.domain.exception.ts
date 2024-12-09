import { HttpStatus } from '@nestjs/common';
import { AuthExceptionCode } from './auth.exception.code';
import { BaseException } from 'src/infrastructure/utils/structure/base-exception';

export class IsNotCaveMemberException extends BaseException {
  constructor() {
    super(AuthExceptionCode.IS_NOT_CAVE_MEMBER, HttpStatus.BAD_REQUEST);
  }
}

export class IsNotRightPasswordException extends BaseException {
  constructor() {
    super(AuthExceptionCode.IS_NOT_RIGHT_PASSWORD, HttpStatus.BAD_REQUEST);
  }
}
