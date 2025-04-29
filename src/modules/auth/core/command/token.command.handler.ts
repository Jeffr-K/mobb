import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserReIssueSessionCommand } from '@modules/auth/core/command/token.command.event';
import { TokenService } from '@modules/auth/core/service/token.service';
import {
  SecureSessionCacheRepository,
  SecureSessionRepository,
} from '@modules/auth/infrastructure/persistance/secure.sesion.concrete-repository';
import { SecureSession } from '@modules/auth/core/entity/secure.session';
import { LoginSuccessResponse } from '@modules/auth/interface/adapter/out/response';

@CommandHandler(UserReIssueSessionCommand)
export class TokenCommandHandler implements ICommandHandler<UserReIssueSessionCommand> {
  constructor(
    private readonly tokenService: TokenService,
    private readonly secureSessionRepository: SecureSessionRepository,
    private readonly secureSessionCacheRepository: SecureSessionCacheRepository,
  ) {}

  async execute(command: UserReIssueSessionCommand): Promise<LoginSuccessResponse> {
    const tokens = await this.tokenService.generate({
      email: command.user.email.email,
      roles: [],
      permissions: [],
    });

    await this.secureSessionCacheRepository.persistToken({
      key: command.user.email.email,
      value: new SecureSession({
        email: command.user.email.email,
        accessToken: tokens.accessToken,
        refreshToken: null,
      }),
    });

    // RTR
    // TODO: consider managing the blacklist for tokens
    await this.secureSessionRepository.updateToken({
      email: command.user.email.email,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    return new LoginSuccessResponse(tokens.accessToken, tokens.refreshToken);
  }
}
