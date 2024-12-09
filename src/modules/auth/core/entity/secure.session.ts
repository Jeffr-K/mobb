import { Entity, EntityRepositoryType, PrimaryKey, Property } from '@mikro-orm/core';
import { SecureSessionRepository } from '../../infrastructure/persistance/secure.sesion.concrete-repository';
import { ExtendsAggregateRoot } from 'src/infrastructure/utils/structure/extends-aggregate-root';

@Entity({ repository: () => SecureSessionRepository })
export class SecureSession extends ExtendsAggregateRoot {
  [EntityRepositoryType]?: SecureSessionRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Property()
  email?: string;

  @Property()
  accessToken?: string;

  @Property()
  refreshToken?: string;

  constructor(data: { email?: string; accessToken?: string; refreshToken?: string }) {
    super();
    this.email = data.email ? data.email : null;
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
  }
}
