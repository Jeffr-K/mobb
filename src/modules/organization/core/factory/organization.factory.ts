import { Organization } from '@modules/organization/core/entity/organization';
import { Information } from '@modules/organization/core/value/embeddable/company.information';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';

export interface OrganizationBuilder {
  get Identifier(): AggregateRootIdentifier;
  build(): Organization;
}

export class OrganizationConcreteBuilder implements OrganizationBuilder {
  private readonly organization: Organization;

  constructor() {
    this.organization = new Organization();
    this.organization.identifier = new AggregateRootIdentifier({});
  }

  get Identifier(): AggregateRootIdentifier {
    return this.organization.identifier;
  }

  setInformation(information: Information): this {
    this.organization.information = new Information({
      name: information.name,
      industry: information.industry,
      description: information.description,
      location: information.location,
    });

    return this;
  }

  setTimestamp(): this {
    this.organization.timestamp = new Timestamp({
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    return this;
  }

  build(): Organization {
    return this.organization;
  }
}
