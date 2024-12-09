import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Encrypter {
  async encrypt(password: string): Promise<string> {
    return await bcrypt.hash(password, await bcrypt.genSalt(10));
  }

  async compare(encryptedPassword: string, password: string): Promise<boolean> {
    return await bcrypt.compare(password, encryptedPassword);
  }
}
