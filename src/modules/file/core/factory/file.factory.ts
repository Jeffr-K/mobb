import { AggregateRootIdentifier } from '@/infrastructure/utils/structure/aggregate-root-id';
import { File } from '../entity/file';

export class FileConcreteBuilder {
  private readonly file: File;

  constructor() {
    this.file = new File();
    this.file.identifier = new AggregateRootIdentifier({});
  }

  get Identifier(): AggregateRootIdentifier {
    return this.file.identifier;
  }

  setFilename(filename: string): this {
    this.file.filename = filename;
    return this;
  }

  setFilesize(filesize: number): this {
    this.file.filesize = filesize;
    return this;
  }

  setMimetype(mimetype: string): this {
    this.file.mimetype = mimetype;
    return this;
  }

  setEncoding(encoding: string): this {
    this.file.encoding = encoding;
    return this;
  }

  setMetadata(metadata: string): this {
    this.file.metadata = metadata;
    return this;
  }

  setTimestamp(): this {
    this.file.timestamp = {
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    };
    return this;
  }

  setUser(user: any): this {
    this.file.user = user;
    return this;
  }

  setFeed(feed: any): this {
    this.file.feed = feed;
    return this;
  }

  build(): File {
    return this.file;
  }
}
