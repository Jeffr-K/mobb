import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserSearchQuery, UsersSearchQuery } from './user.query.event';
import { User } from '../entity/user';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserNotFoundException } from '../exception/user.domain-exception';
import { IsUserExistQueryEvent } from '../../../auth/core/event/auth.domain.event';
import { Encrypter } from '../../infrastructure/utils/encrypter';
import { IsNotRightPasswordException } from '../../../auth/core/exception/auth.domain.exception';

@QueryHandler(UserSearchQuery)
export class UserSearchQueryEventHandler implements IQueryHandler<UserSearchQuery> {
  constructor(@InjectRepository(User) private readonly userRepository: UserRepository) {}

  async execute(query: UserSearchQuery): Promise<User> {
    const user = await this.userRepository.selectUserBy({
      userId: query.userId,
    });

    if (!user) throw new UserNotFoundException();

    return user;
  }
}

@QueryHandler(UsersSearchQuery)
export class UsersSearchQueryEventHandler implements IQueryHandler<UsersSearchQuery> {
  constructor(@InjectRepository(User) private userRepository: UserRepository) {}

  async execute(query: UsersSearchQuery): Promise<User[]> {
    return await this.userRepository.selectUsersBy({
      page: query.page,
      offset: query.offset,
      limit: query.limit,
    });
  }
}

@QueryHandler(IsUserExistQueryEvent)
export class IsUserExistQueryHandler implements IQueryHandler<IsUserExistQueryEvent> {
  constructor(@InjectRepository(User) private userRepository: UserRepository, private encrypter: Encrypter) {}

  async execute(query: IsUserExistQueryEvent): Promise<boolean> {
    const user = await this.userRepository.selectUserBy({ email: query.email });

    if (!user) throw new UserNotFoundException();

    if (query.password) {
      const isPasswordValid = await this.encrypter.compare(user.password.password, query.password);

      if (!isPasswordValid) throw new IsNotRightPasswordException();
    }

    return !!user;
  }
}
