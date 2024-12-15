import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileUploadCommandEvent } from '@modules/file/core/command/command.event';
import { FileRepository } from '@modules/file/infrastucture/repository/file.repository';

@CommandHandler(FileUploadCommandEvent)
export class FileUploadCommandHandler implements ICommandHandler<FileUploadCommandEvent> {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(event: FileUploadCommandEvent) {
    console.log('FileUploadCommandHandler', event);
  }
}
