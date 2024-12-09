import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent, UserDroppedOutEvent } from '../../event/user.domain.event';

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
