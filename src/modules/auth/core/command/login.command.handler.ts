import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { UserLoginCommand } from './login.command.event';
import {
  SecureSessionCacheRepository,
  SecureSessionRepository,
} from '../../infrastructure/persistance/secure.sesion.concrete-repository';
import { TokenService } from '../service/token.service';
import { SecureSession } from '../entity/secure.session';
import { UserLogoutCommand } from './logout.command.event';
import { IsUserExistQueryEvent } from '../event/auth.domain.event';
import { IsNotCaveMemberException } from '../exception/auth.domain.exception';
import { LoginSuccessResponse } from '@modules/auth/interface/adapter/out/response';

@CommandHandler(UserLoginCommand)
export class LoginCommandEventHandler implements ICommandHandler<UserLoginCommand> {
  constructor(
    private readonly tokenService: TokenService,
    private readonly secureSessionRepository: SecureSessionRepository,
    private readonly secureSessionCacheRepository: SecureSessionCacheRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: UserLoginCommand): Promise<LoginSuccessResponse> {
    const isValidateUser: boolean = await this.queryBus.execute(
      new IsUserExistQueryEvent(command.email, command.password),
    );
    if (!isValidateUser) throw new IsNotCaveMemberException();

    const tokens = await this.tokenService.generate({
      email: command.email,
      roles: [],
      permissions: [],
    });

    // TODO: Thundering Herd Problem
    await this.secureSessionCacheRepository.persistToken({
      key: command.email,
      value: new SecureSession({
        email: command.email,
        accessToken: tokens.accessToken,
        refreshToken: null,
      }),
    });

    const secureSession = new SecureSession({
      email: command.email,
      accessToken: null,
      refreshToken: tokens.refreshToken,
    });

    await this.secureSessionRepository.persist(secureSession);

    return new LoginSuccessResponse(tokens.accessToken, tokens.refreshToken);
  }
}

@CommandHandler(UserLogoutCommand)
export class LogoutCommandEventHandler implements ICommandHandler<UserLogoutCommand> {
  constructor(private readonly secureSessionCacheRepository: SecureSessionCacheRepository) {}

  async execute(command: UserLogoutCommand): Promise<boolean> {
    await this.secureSessionCacheRepository.destroyToken({ key: command.email });
    return true;
  }
}
