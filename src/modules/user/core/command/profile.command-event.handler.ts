import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProfileEditCommandEvent } from './profile.command.event';

@CommandHandler(ProfileEditCommandEvent)
export class ProfileCommandEventHandler implements ICommandHandler<ProfileEditCommandEvent> {
  execute(command: ProfileEditCommandEvent): Promise<any> {
    console.log(command);
    throw new Error('Method not implemented.');
  }
}
