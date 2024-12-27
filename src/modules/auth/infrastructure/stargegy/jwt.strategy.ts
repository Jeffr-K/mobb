import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserNotFoundException } from '@modules/user/core/exception/user.domain-exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserLookupEvent } from '@modules/user/core/event/handler/event/user.query.event';

import { Request } from 'express';
import { SecureSessionCacheRepository } from '@modules/auth/infrastructure/persistance/secure.sesion.concrete-repository';
import { SessionExpiredException } from '@modules/auth/infrastructure/exceptions/exceptions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly secureSessionCacheRepository: SecureSessionCacheRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(request: Request) {
    // TODO: exception 정리좀 하자.
    try {
      const secureSession = await this.secureSessionCacheRepository.getToken({ key: request['email'] });
      if (!secureSession) {
        throw new SessionExpiredException();
      }

      return await this.eventEmitter
        .emitAsync('user.lookup', new UserLookupEvent({ email: request['email'] }))
        .then((results) => results[0]);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UnauthorizedException({ message: '회원이 존재하지 않습니다.' });
      }
      throw error;
    }
  }
}
