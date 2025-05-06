import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Controller({ path: '/feed/category', version: '1' })
export class FeedCategoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async createCategory() {
    const result = this.commandBus.execute();
  }

  async editCategory() {
    const result = this.commandBus.execute();
  }

  async deleteCategory() {
    const result = this.commandBus.execute();
  }

  async categories() {}

  async category() {}
}