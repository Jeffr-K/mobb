import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Controller({ path: 'connect', version: ['1'] })
export class ConnectController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  // @Post('/')
  // async connect() {}
  //
  // @Delete('/disconnect')
  // async disconnect() {}
}
