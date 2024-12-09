export class IsUserExistQueryEvent {
  constructor(public readonly email: string, public readonly password?: string) {}
}
