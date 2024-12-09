export class UserRegisteredEvent {
  constructor(public readonly userId: number, public readonly email: string) {}
}

export class UserDroppedOutEvent {
  constructor(public readonly userId: string) {}
}

export class UserAddressEditedEvent {
  readonly userId: number;
  readonly address: string;

  constructor(data: { userId: number; address: string }) {
    this.userId = data.userId;
    this.address = data.address;
  }
}

export class UserEmailEditedEvent {
  readonly userId: number;
  readonly email: string;
  readonly newEmail: string;

  constructor(data: { userId: number; email: string; newEmail: string }) {
    this.userId = data.userId;
    this.email = data.email;
    this.newEmail = data.newEmail;
  }
}

export class UserBlockedEvent {
  readonly userId: number;

  constructor(data: { userId: number }) {
    this.userId = data.userId;
  }
}

export class UserUnblockedEvent {
  readonly userId: number;

  constructor(data: { userId: number }) {
    this.userId = data.userId;
  }
}

export class UserNotificationPausedEvent {
  readonly userId: number;

  constructor(data: { userId: number }) {
    this.userId = data.userId;
  }
}

export class UserNotificationResumedEvent {
  readonly userId: number;

  constructor(data: { userId: number }) {
    this.userId = data.userId;
  }
}

export class UserPhoneEditedEvent {
  readonly userId: number;
  readonly phone: string;

  constructor(data: { userId: number; phone: string }) {
    this.userId = data.userId;
    this.phone = data.phone;
  }
}

export class UserNicknameEditedEvent {
  readonly userId: number;
  readonly username: string;
  readonly nickname: string;

  constructor(data: { userId: number; username: string; nickname: string }) {
    this.userId = data.userId;
    this.username = data.username;
    this.nickname = data.nickname;
  }
}

export class UserLikedEvent {
  readonly userId: number;

  constructor(data: { userId: number }) {
    this.userId = data.userId;
  }
}

export class UserUnLikedEvent {
  readonly userId: number;

  constructor(data: { userId: number }) {
    this.userId = data.userId;
  }
}

export class UserFollowedEvent {
  readonly userId: number;

  constructor(data: { userId: number }) {
    this.userId = data.userId;
  }
}

export class UserUnFollowedEvent {
  readonly userId: number;

  constructor(data: { userId: number }) {
    this.userId = data.userId;
  }
}
