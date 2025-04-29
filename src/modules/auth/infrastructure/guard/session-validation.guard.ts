import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SecureSessionCacheRepository } from '@modules/auth/infrastructure/persistance/secure.sesion.concrete-repository';
import { SessionExpiredException } from '@modules/auth/infrastructure/exceptions/exceptions';

@Injectable()
export class SessionValidationGuard implements CanActivate {
  constructor(private readonly secureSessionCacheRepository: SecureSessionCacheRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('인증이 필요합니다.');
    }

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('토큰이 입력되지 않았습니다.');
    }

    const redisResult = await this.secureSessionCacheRepository.getToken({ key: user['email']['email'] });

    const secureSession = typeof redisResult === 'string' ? JSON.parse(redisResult) : redisResult;

    if (!secureSession) {
      throw new SessionExpiredException();
    }

    if (secureSession.accessToken !== token) {
      throw new SessionExpiredException();
    }

    return true;
  }
}
