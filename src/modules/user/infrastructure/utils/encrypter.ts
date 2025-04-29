import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export interface Encryptable {
  /**
   * Encrypt password by bcrypt (default)
   * @param password
   */
  encrypt(password: string): Promise<string>;

  /**
   * Compare encrypted password with plain password
   * @param encryptedPassword
   * @param password
   */
  compare(encryptedPassword: string, password: string): Promise<boolean>;
}

@Injectable()
export class Encrypter {
  async encrypt(password: string): Promise<string> {
    return await bcrypt.hash(password, await bcrypt.genSalt(10));
  }

  async compare(encryptedPassword: string, password: string): Promise<boolean> {
    return await bcrypt.compare(password, encryptedPassword);
  }
}
