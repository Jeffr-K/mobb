import { Injectable } from '@nestjs/common';
import { TokenGenerator } from '../../infrastructure/utils/token.generator';
import { TokenValidator } from '../../infrastructure/utils/token.validator';
import { Payload } from '../value/payload';

@Injectable()
export class TokenService {
  private payload: Payload;

  constructor(private readonly generator: TokenGenerator, private readonly validator: TokenValidator) {}

  async generate(payload: Payload): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.generator.generate(
      new Payload({
        email: payload.email,
        roles: payload.roles,
        permission: payload.permissions,
      }),
    );
  }

  async verify(token: string): Promise<boolean> {
    return await this.validator.validate(token);
  }
}
