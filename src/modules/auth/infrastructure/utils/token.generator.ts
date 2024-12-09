import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../../core/value/payload';

@Injectable()
export class TokenGenerator {
  constructor(private jwtService: JwtService) {}

  async generate(claims: Payload): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign({ email: claims.email }, { secret: 'C@ve!#15', expiresIn: '1h' });
    const refreshToken = this.jwtService.sign({ email: claims.email }, { secret: 'C@ve!#15', expiresIn: '7d' });

    return { accessToken, refreshToken };
  }
}
