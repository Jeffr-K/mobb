import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserNotFoundException } from '@modules/user/core/exception/user.domain-exception';
import { SecureSessionCacheRepository } from '@modules/auth/infrastructure/persistance/secure.sesion.concrete-repository';
import { SessionExpiredException } from '@modules/auth/infrastructure/exceptions/exceptions';
import { UserRepository } from '@/modules/user/infrastructure/repository/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly secureSessionCacheRepository: SecureSessionCacheRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    try {
      const secureSession = await this.secureSessionCacheRepository.getToken({ key: payload.email });
      if (!secureSession) {
        throw new SessionExpiredException();
      }

      const user = await this.userRepository.selectUserBy({ email: payload.email });

      if (!user) {
        throw new UserNotFoundException();
      }

      return user;
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UnauthorizedException({ message: '회원이 존재하지 않습니다.' });
      }
      throw error;
    }
  }
}
