import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileUploadCommandEvent } from '@modules/file/core/command/command.event';
import { FileConcreteBuilder } from '../factory/file.factory';
import { EntityManager, Transactional } from '@mikro-orm/postgresql';

@CommandHandler(FileUploadCommandEvent)
export class FileUploadCommandHandler implements ICommandHandler<FileUploadCommandEvent> {
  constructor(private readonly em: EntityManager) {}

  @Transactional()
  async execute(event: FileUploadCommandEvent) {
    const file = new FileConcreteBuilder()
      .setFilename(event.filename)
      .setFilesize(event.filesize)
      .setMimetype(event.mimetype)
      .setEncoding(event.encoding)
      .setMetadata(event.metadata)
      .setTimestamp()
      .build();

    await this.em.persistAndFlush(file);
  }
}
