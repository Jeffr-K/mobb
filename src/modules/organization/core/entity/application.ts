import { Embedded, Entity, EntityRepositoryType, Enum, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { ApplicationRepository } from '@modules/organization/infrastructure/application.repository';
import { Property } from '@mikro-orm/postgresql';
import { Organization } from '@modules/organization/core/entity/organization';
// import { ApplicationStatus } from '@modules/organization/core/value/embeddable/application.status';
import { AggregateRoot } from '@nestjs/cqrs';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { ApplicationConcreteBuilder } from '@modules/organization/core/factory/application.factory';
import { Position } from '@modules/organization/core/value/embeddable/position';

@Entity({ repository: () => ApplicationRepository })
export class Application extends AggregateRoot {
  [EntityRepositoryType]?: ApplicationRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  // @Enum({ items: () => ApplicationStatus, default: ApplicationStatus.PENDING })
  // status: ApplicationStatus;

  @Property()
  description: string;

  @Enum({ items: () => Position })
  position: Position;

  @Property()
  stacks: string[];

  @Property()
  roleDescription: string;

  @Property()
  employProcesses: string[];

  @Property()
  qualifications: string[]; // 필수 조건

  @Property()
  requirements: string[]; // 자격 조건

  @Property()
  optionalRequirements: string[]; // 우대 조건

  @Property()
  welfares: string[];

  @Property()
  workingPlace: string;

  @Property()
  photos: string[];

  @Embedded(() => Timestamp, { prefix: false })
  timestamp: Timestamp;

  @ManyToOne()
  organization!: Organization;

  constructor() {
    super();
  }

  static async register(application: {
    // version: number;
    // status: ApplicationStatus;
    description: string;
    position: Position;
    stacks: string[];
    roleDescription: string;
    employProcesses: string[];
    qualifications: string[];
    requirements: string[];
    optionalRequirements: string[];
    welfares: string[];
    workingPlace: string;
    photos: string[];
    organization: Organization;
  }): Promise<Application> {
    return (
      new ApplicationConcreteBuilder()
        // .setVersion(application.version)
        // .setStatus(application.status)
        .setDescription(application.description)
        .setPosition(application.position)
        .setStacks(application.stacks)
        .setRoleDescription(application.roleDescription)
        .setEmployProcess(application.employProcesses)
        .setQualifications(application.qualifications)
        .setRequirements(application.requirements)
        .setOptionalRequirements(application.optionalRequirements)
        .setWelfares(application.welfares)
        .setWorkingPlace(application.workingPlace)
        .setPhotos(application.photos)
        .setTimestamp()
        .setOrganization(application.organization)
        .build()
    );
  }

  // async edit() {}
  //
  // async delete() {}
}
