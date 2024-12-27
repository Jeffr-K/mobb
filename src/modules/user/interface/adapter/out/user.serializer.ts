import { Exclude, Expose, Transform } from 'class-transformer';
import { User } from '../../../core/entity/user';

export class UseSearchModelSerializer {
  @Expose()
  _id!: number;

  @Expose()
  @Transform(({ value, obj }) => obj.identifier?.uuid)
  uuid!: string;

  @Expose()
  @Transform(({ value, obj }) => obj.username?.username)
  username!: string;

  @Expose()
  @Transform(({ value, obj }) => obj.username?.nickname)
  nickname!: string | null;

  @Expose()
  @Transform(({ value, obj }) => obj.email?.email)
  email!: string;

  @Expose()
  @Transform(({ value, obj }) => obj.timestamp?.createdAt)
  createdAt!: Date;

  @Expose()
  @Transform(({ value, obj }) => obj.timestamp?.updatedAt)
  updatedAt!: Date | null;

  @Exclude()
  profile!: any;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
