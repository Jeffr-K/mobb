import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { REQUEST_CONTEXT_STORAGE } from '@infrastructure/log/context/constants';
import { AsyncLocalStorage } from 'node:async_hooks';
import { WithRequestContext } from '@infrastructure/log/context/decorators/with-request-context.decorator';
import { HealthService } from './health.service';
import { PerformHealthCheckCommand } from '@infrastructure/health/event';
import { RequestId } from '@infrastructure/log/context/decorators/requestId.decorator';

@CommandHandler(PerformHealthCheckCommand)
export class PerformHealthCheckCommandHandler implements ICommandHandler<PerformHealthCheckCommand> {
  private readonly logger = new Logger(PerformHealthCheckCommandHandler.name);

  @RequestId() private readonly requestId: string;

  constructor(
    private readonly healthService: HealthService,
    @Inject(REQUEST_CONTEXT_STORAGE) private readonly asyncStorage: AsyncLocalStorage<Map<string, any>>
  ) {}

  @WithRequestContext()
  async execute(command: PerformHealthCheckCommand): Promise<string> {
    this.logger.log(`CommandHandler: Executing command with requestId: ${this.requestId}`);

    const result = await this.healthService.checkHealth({
      source: 'command',
      type: command.checkType,
      params: command.params,
    });

    this.logger.log(`CommandHandler: Command completed with requestId: ${this.requestId}`);
    return result;
  }
}