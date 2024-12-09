import { Agreements } from '../value/embeddable/agreements';

export class UserRegisterCommand {
  constructor(
    public readonly username: string,
    public readonly nickname: string,
    public password: string,
    public readonly email: string,
    public readonly agreements: Agreements,
  ) {}
}

export class UserDropdownCommand {
  constructor(public readonly email: string) {}
}

export class UserEditPasswordCommand {
  readonly userId: number;
  readonly password: string;
  readonly newPassword: string;

  constructor(data: { userId: number; password: string; newPassword: string }) {
    this.userId = data.userId;
    this.password = data.password;
    this.newPassword = data.newPassword;
  }
}

export class UserEditEmailCommand {
  readonly userId: number;
  readonly email: string;
  readonly newEmail: string;

  constructor(data: { userId: number; email: string; newEmail: string }) {
    this.userId = data.userId;
    this.email = data.email;
    this.newEmail = data.newEmail;
  }
}

export class UserEditNicknameCommand {
  readonly userId: number;
  readonly username: string;
  readonly nickname: string;

  constructor(data: { readonly userId: number; readonly username: string; readonly nickname: string }) {
    this.userId = data.userId;
    this.username = data.username;
    this.nickname = data.nickname;
  }
}

export class UserEditNationCommand {
  readonly email: string;
  readonly nation: string;

  constructor(data: { email: string; nation: string }) {
    this.email = data.email;
    this.nation = data.nation;
  }
}

export class UserAddressEditCommand {
  readonly email: string;
  readonly address: string;

  constructor(data: { email: string; address: string }) {
    this.email = data.email;
    this.address = data.address;
  }
}
