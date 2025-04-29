import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { Application } from '@modules/organization/core/entity/application';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApplicationRepository extends ExtendedEntityRepository<Application> {}
