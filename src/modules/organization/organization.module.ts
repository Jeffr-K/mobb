import { Module } from '@nestjs/common';
import { Embedded, EntityRepositoryType, PrimaryKey } from '@mikro-orm/core';
import { ActivityRepository } from '../user/infrastructure/repository/activity.repository';
import { AggregateRootIdentifier } from '../../infrastructure/utils/structure/aggregate-root-id';

@Module({})
export class OrganizationModule {
  [EntityRepositoryType]?: ActivityRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;
}
