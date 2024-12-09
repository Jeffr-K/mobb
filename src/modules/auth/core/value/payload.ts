export class Payload {
  public email: string;
  public roles: string[];
  public permissions: string[];

  constructor(data: { email: string; roles: string[]; permission: string[] }) {
    this.email = data.email;
    this.roles = data.roles;
    this.permissions = data.permission;
  }
}
