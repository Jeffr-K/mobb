export class OrganizationRegisterCommand {
  constructor(public readonly data: { name: string; description: string; industry: string; location: string }) {}
}

export class OrganizationEditCommand {
  constructor(
    public readonly data: {
      uuid: string;
      name: string;
      industry: string;
      description: string;
      location: string;
    },
  ) {}
}

export class OrganizationRemoveCommand {
  constructor(public readonly data: { uuid: string }) {}
}
