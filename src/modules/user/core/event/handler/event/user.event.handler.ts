import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent, UserDroppedOutEvent } from '../../event/user.domain.event';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@modules/user/core/entity/user';
import { UserLookupEvent } from '@modules/user/core/event/handler/event/user.query.event';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRepository } from '@modules/user/infrastructure/repository/user.repository';

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredEventHandler implements IEventHandler<UserRegisteredEvent> {
  handle(event: UserRegisteredEvent) {
    console.log('Event handler called');
    console.log('Event received:', event);
    console.log(`사용자 등록됨: ${event.userId}`);
  }
}

@EventsHandler(UserDroppedOutEvent)
export class UserDroppedOutEventHandler implements IEventHandler<UserDroppedOutEvent> {
  handle(event: UserDroppedOutEvent) {
    console.log(`사용자 탈퇴함: ${event.userId}`);
    // 필요한 후속 작업 수행
  }
}

@Injectable()
export class UserEventHandler {
  constructor(private readonly userRepository: UserRepository) {}

  @OnEvent('user.lookup')
  async handleUserLookup(event: UserLookupEvent): Promise<User> {
    const user = await this.userRepository.selectUserBy({ userId: event.userId });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
