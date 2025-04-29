import { Embedded, Entity, EntityRepositoryType, PrimaryKey } from '@mikro-orm/core';
import { AggregateRoot } from '@nestjs/cqrs';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Information } from '@modules/organization/core/value/embeddable/company.information';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { OrganizationRepository } from '@modules/organization/infrastructure/organization.repository';
import { OrganizationRegisterCommand } from '@modules/organization/core/command/command.event';
import { OrganizationConcreteBuilder } from '@modules/organization/core/factory/organization.factory';

@Entity({ repository: () => OrganizationRepository })
export class Organization extends AggregateRoot {
  [EntityRepositoryType]?: OrganizationRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @Embedded({ prefix: false })
  information: Information;

  // @OneToMany(() => News, news => news.organization)
  // news: News[];
  //
  // @OneToMany(() => Feed, feeds => feeds.organization)
  // feeds: Feed[];
  //
  // @OneToMany(() => Member, member => member.organization)
  // members: Member[];
  //
  // @OneToOne(() => Pool, pool => pool.organization, { owner: true })
  // pool: Pool;

  @Embedded(() => Timestamp, { prefix: false })
  timestamp: Timestamp;

  constructor() {
    super();
  }

  static async register(command: OrganizationRegisterCommand): Promise<Organization> {
    return new OrganizationConcreteBuilder()
      .setInformation({ ...command.data })
      .setTimestamp()
      .build();
  }

  async remove(organization: Organization): Promise<Organization> {
    this.timestamp.deletedAt = new Date();
    return organization;
  }

  async edit(organization: { information: Information }): Promise<Organization> {
    if (this.timestamp.deletedAt) {
      throw new Error('Organization is already deleted');
    }
    this.information = organization.information;
    return this;
  }
}
