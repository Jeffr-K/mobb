import { InjectRepository } from '@mikro-orm/nestjs';
import { CommandBus, CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Encrypter } from '@modules/user/infrastructure/utils/encrypter';
import { UserRepository } from '@modules/user/infrastructure/repository/user.repository';
import { User } from '@modules/user/core/entity/user';
import { UserAlreadyExistsException, UserNotFoundException } from '@modules/user/core/exception/user.domain-exception';
import { UserDropdownCommand, UserRegisterCommand } from '@modules/user/core/command/user.command.event';
import { UserRegisteredEvent } from '@modules/user/core/event/event/user.domain.event';
import { Email } from '@modules/user/core/value/embeddable/email';
import { ProfileRegisterCommandEvent } from '@modules/user/core/command/profile.command.event';

@CommandHandler(UserRegisterCommand)
export class UserRegisterCommandEventHandler implements ICommandHandler<UserRegisterCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    @InjectRepository(User) private readonly userRepository: UserRepository,
    private readonly commandBus: CommandBus,
    private readonly encrypter: Encrypter,
  ) {}

  async execute(command: UserRegisterCommand): Promise<void> {
    const exists = await this.userRepository.findOne({
      email: new Email(command.email),
    });
    if (exists) {
      throw new UserAlreadyExistsException();
    }

    command.password = await this.encrypter.encrypt(command.password);

    const user: User = await User.register(command);

    await this.commandBus.execute(new ProfileRegisterCommandEvent({ user: user }));

    await this.userRepository.persistAndFlush(user);

    user.apply(new UserRegisteredEvent(user._id, user.email.email));

    const published = this.publisher.mergeObjectContext(user);

    published.commit();
  }
}

@CommandHandler(UserDropdownCommand)
export class UserDropdownCommandEventHandler implements ICommandHandler<UserDropdownCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    @InjectRepository(User) private readonly userRepository: UserRepository,
  ) {}

  async execute(command: UserDropdownCommand): Promise<void> {
    const [user] = await Promise.all([
      this.userRepository.findOne({
        email: new Email(command.email),
      }),
    ]);

    if (!user) throw new UserNotFoundException();

    const [publishedUser] = await Promise.all([this.publisher.mergeObjectContext(user)]);

    await publishedUser.dropdown({ user: publishedUser });

    await this.userRepository.persistAndFlush(publishedUser);

    publishedUser.commit();
  }
}
