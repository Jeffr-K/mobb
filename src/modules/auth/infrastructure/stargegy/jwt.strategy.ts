import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IsUserExistQueryEvent } from '../../core/event/auth.domain.event';
import { UserNotFoundException } from '@modules/user/core/exception/user.domain-exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly queryBus: QueryBus, private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    try {
      await this.queryBus.execute(new IsUserExistQueryEvent(payload.email));

      return {
        email: payload.email,
      };
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UnauthorizedException({ message: '회원이 존재하지 않습니다.' });
      }
    }
  }
}

export interface Payload {
  email: string;
}
