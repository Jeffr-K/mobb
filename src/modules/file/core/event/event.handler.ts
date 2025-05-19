import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileRepository } from '../../infrastucture/repository/file.repository';
import { FileUpdateCommand } from './event';

@CommandHandler(FileUpdateCommand)
export class FileUpdateCommandHandler implements ICommandHandler<FileUpdateCommand> {
  constructor(private fileRepository: FileRepository) {}

  async execute(command: FileUpdateCommand): Promise<void> {
    const fileUuids = command.images.map((image) => image.uuid);

    const files = await this.fileRepository.selectFilesBy({ uuids: fileUuids });

    await Promise.all(
      files.map(async (file) => {
        file.feed = command.feed;
        file.timestamp.updatedAt = new Date();
        await this.fileRepository.persistAndFlush(file);
      }),
    );
  }
}
