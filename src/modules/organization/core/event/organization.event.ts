import { Organization } from '@modules/organization/core/entity/organization';

// Domain Events
export class OrganizationRegisteredEvent {
  constructor(public readonly organization: Organization) {}
}

export class OrganizationRemovedEvent {
  constructor(public readonly organization: Organization) {}
}

export class OrganizationEditedEvent {
  constructor(public readonly organization: Organization) {}
}
