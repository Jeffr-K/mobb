import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Application } from '@modules/organization/core/entity/application';
// import { ApplicationStatus } from '@modules/organization/core/value/embeddable/application.status';
import { Position } from '@modules/organization/core/value/embeddable/position';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { Organization } from '@modules/organization/core/entity/organization';

export interface ApplicationBuilder {
  get Identifier(): AggregateRootIdentifier;
  build(): Application;
}

export class ApplicationConcreteBuilder implements ApplicationBuilder {
  private readonly application: Application;

  constructor() {
    this.application = new Application();
    this.application.identifier = new AggregateRootIdentifier();
  }

  get Identifier(): AggregateRootIdentifier {
    return this.application.identifier;
  }

  // setVersion(version: number = 1): this {
  //   this.application.version = version;
  //   return this;
  // }

  // setStatus(status: ApplicationStatus = ApplicationStatus.OPEN): this {
  //   this.application.status = status;
  //   return this;
  // }

  setDescription(description: string): this {
    this.application.description = description;
    return this;
  }

  setPosition(position: Position = Position.FRONTEND): this {
    this.application.position = position;
    return this;
  }

  setStacks(stacks: string[]): this {
    this.application.stacks = stacks;
    return this;
  }

  setRoleDescription(role: string): this {
    this.application.roleDescription = role;
    return this;
  }

  setEmployProcess(processes: string[]): this {
    this.application.employProcesses = processes;
    return this;
  }

  setQualifications(qualifications: string[]): this {
    this.application.qualifications = qualifications;
    return this;
  }

  setRequirements(requirements: string[]): this {
    this.application.requirements = requirements;
    return this;
  }

  setOptionalRequirements(optionalRequirements: string[]): this {
    this.application.optionalRequirements = optionalRequirements;
    return this;
  }

  setWelfares(welfares: string[]): this {
    this.application.welfares = welfares;
    return this;
  }

  setWorkingPlace(workingPlace: string): this {
    this.application.workingPlace = workingPlace;
    return this;
  }

  setPhotos(photos: string[]): this {
    this.application.photos = photos;
    return this;
  }

  setTimestamp(): this {
    this.application.timestamp = new Timestamp({
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    return this;
  }

  setOrganization(organization: Organization): this {
    this.application.organization = organization;
    return this;
  }

  build(): Application {
    return this.application;
  }
}
