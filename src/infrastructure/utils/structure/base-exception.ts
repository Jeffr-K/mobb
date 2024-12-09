import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthExceptionCode } from '../../../modules/auth/core/exception/auth.exception.code';
import { ExceptionCode } from '../../../modules/user/core/exception/user.exception.code';

type ExceptionCodeType = ExceptionCode | AuthExceptionCode;

export class BaseException extends HttpException {
  public exceptionCode: ExceptionCodeType;
  public statusCode: HttpStatus;

  constructor(exceptionCode: ExceptionCodeType, statusCode: number) {
    super(exceptionCode, statusCode);
    this.exceptionCode = exceptionCode;
    this.statusCode = statusCode;
  }
}
