import { Agreements } from '../../../core/value/embeddable/agreements';
import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UserRegisterCommandAdapter {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsString()
  @IsNotEmpty()
  public nickname: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsObject()
  @IsNotEmpty()
  public agreements: Agreements;
}

export class UserDropdownCommandAdapter {
  @IsEmail()
  @IsNotEmpty()
  public email: string;
}

export class UserEditPasswordCommandAdapter {
  public readonly userId: number;
  public readonly password: string;
  public readonly newPassword: string;
}

export class UserEditEmailCommandAdapter {
  public readonly userId: number;
  public readonly email: string;
  public readonly newEmail: string;
}

export class UserEditNationCommandAdapter {
  public readonly email: string;
  public readonly nation: string;
}

export class UserAddressEditCommandAdapter {
  public readonly email: string;
  public readonly address: string;
}
