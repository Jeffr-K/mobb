import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileRegisterCommandEvent } from '@modules/file/core/command/command.event';
import { FileConcreteBuilder } from '../factory/file.factory';
import { EntityManager, Transactional } from '@mikro-orm/postgresql';

@CommandHandler(FileRegisterCommandEvent)
export class FileRegisterCommandEventHandler implements ICommandHandler<FileRegisterCommandEvent> {
  constructor(private readonly em: EntityManager) {}

  @Transactional()
  async execute(event: FileRegisterCommandEvent): Promise<{ uuid: string; url: string }> {
    const file = new FileConcreteBuilder()
      .setFilename(event.filename)
      .setFilesize(event.filesize)
      .setMimetype(event.mimetype)
      .setEncoding(event.encoding)
      .setMetadata(event.metadata)
      .setBucketName(event.bucketName)
      .setFileUrl(event.fileUrl)
      .setUser(event.user)
      .setFeed(null)
      .setTimestamp()
      .build();

    await this.em.persistAndFlush(file);

    return { uuid: file.identifier.uuid, url: file.url };
  }
}
