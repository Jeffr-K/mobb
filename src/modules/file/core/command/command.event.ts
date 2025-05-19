import { Nullable } from '@/infrastructure/utils/types/types';
import { Feed } from '@/modules/feed/core/entity/feed';
import { User } from '@/modules/user/core/entity/user';

export class FileRegisterCommandEvent {
  readonly filename: string;
  readonly filesize: number;
  readonly mimetype: string;
  readonly encoding: string;
  readonly metadata: string;
  readonly bucketName: string;
  readonly fileUrl: string;
  readonly user: User;
  readonly feed?: Nullable<Feed>;

  constructor(data: {
    filename: string;
    filesize: number;
    mimetype: string;
    encoding: string;
    metadata: string;
    bucketName: string;
    fileUrl: string;
    user: User;
    feed?: Nullable<Feed>;
  }) {
    this.filename = data.filename;
    this.filesize = data.filesize;
    this.mimetype = data.mimetype;
    this.encoding = data.encoding;
    this.metadata = data.metadata;
    this.bucketName = data.bucketName;
    this.fileUrl = data.fileUrl;
    this.user = data.user;
    this.feed = data.feed;
  }
}
