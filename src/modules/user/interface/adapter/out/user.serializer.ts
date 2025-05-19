import { User } from '../../../core/entity/user';

export class UseSearchModelSerializer {
  _id!: number;
  uuid!: string;
  username!: string;
  nickname!: string | null;
  email!: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  profile!: any;

  constructor(user: User) {
    this._id = user._id;
    this.uuid = user.identifier?.uuid;
    this.username = user.username?.username;
    this.nickname = user.username?.nickname;
    this.email = user.email?.email;
    this.createdAt = user.timestamp?.createdAt;
    this.updatedAt = user.timestamp?.updatedAt;
    this.profile = user.profile;
  }

  json() {
    return {
      _id: this._id,
      uuid: this.uuid,
      username: this.username,
      nickname: this.nickname,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
