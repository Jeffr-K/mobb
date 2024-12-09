import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IsUserExistQueryEvent } from '../../core/event/auth.domain.event';

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
    const isValidateUser: boolean = await this.queryBus.execute(new IsUserExistQueryEvent(payload.email));

    if (!isValidateUser) {
      throw new UnauthorizedException({ message: '회원이 존재하지 않습니다.' });
    }

    return {
      email: payload.email,
    };
  }
}

export interface Payload {
  email: string;
}
