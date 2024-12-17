import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginCommandAdapter {
  @IsString()
  @IsNotEmpty()
  public readonly email: string;

  @IsString()
  @IsNotEmpty()
  public readonly password: string;
}

export class UserLogoutCommandAdapter {
  @IsString()
  @IsNotEmpty()
  public readonly email: string;
}
