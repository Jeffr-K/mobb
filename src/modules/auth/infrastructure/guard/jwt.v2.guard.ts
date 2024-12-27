import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { JwtTokenExpiredException } from '@modules/auth/infrastructure/exceptions/exceptions';

@Injectable()
export class TokenGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (err instanceof SyntaxError) {
      throw new UnauthorizedException('토큰이 입력되지 않았습니다.');
    }
    if (err instanceof JsonWebTokenError) {
      throw new BadRequestException(err.message);
    }
    if (err instanceof TokenExpiredError) {
      throw new JwtTokenExpiredException();
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
