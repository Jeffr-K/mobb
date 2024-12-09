import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenValidator {
  async validate(token: string): Promise<boolean> {
    console.log(token);
    return true;
  }
}
