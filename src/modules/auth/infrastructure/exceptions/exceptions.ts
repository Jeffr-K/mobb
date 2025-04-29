import { HttpException, HttpStatus } from '@nestjs/common';
import { ServerErrorCode } from '@infrastructure/utils/base/errorcode';

export class JwtTokenExpiredException extends HttpException {
  constructor(message = '토큰이 만료되었습니다') {
    super(
      { message, errorCode: ServerErrorCode.JWT_TOKEN_EXPIRED, statusCode: HttpStatus.UNAUTHORIZED },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class SessionExpiredException extends HttpException {
  constructor(message = '세션이 만료되었습니다(로그인이 필요합니다)') {
    super(
      { message, errorCode: ServerErrorCode.SESSION_EXPIRED, statusCode: HttpStatus.UNAUTHORIZED },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
