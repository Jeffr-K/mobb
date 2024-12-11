export class GetOrganizationQuery {
  constructor(public readonly identifier: string) {}
}

export class GetOrganizationsQuery {
  constructor(public readonly page: number = 1, public readonly limit: number = 10) {}
}
