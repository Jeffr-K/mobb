import { Exclude, Expose, Transform } from 'class-transformer';
import { User } from '../../../core/entity/user';

export class UseSearchModelSerializer {
  @Expose()
  _id: number;

  @Expose()
  @Transform(({ obj }) => obj.identifier.uuid)
  uuid: string;

  @Expose()
  @Transform(({ obj }) => obj.identifier.version)
  version: number;

  @Expose()
  @Transform(({ obj }) => obj.username.username)
  username: string | null;

  @Expose()
  @Transform(({ obj }) => obj.username.nickname)
  nickname: string | null;

  @Expose()
  @Transform(({ obj }) => obj.email.email)
  email: string;

  @Expose()
  @Transform(({ obj }) => obj.timestamp.createdAt)
  createdAt: Date;

  @Expose()
  @Transform(({ obj }) => obj.timestamp.updatedAt)
  updatedAt: Date | null;

  @Expose()
  @Transform(({ obj }) => obj.timestamp.deletedAt)
  deletedAt: Date | null;

  @Exclude()
  timestamp: any;

  @Exclude()
  identifier: any;

  @Exclude()
  password: any;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
