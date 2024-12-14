import { Module } from '@nestjs/common';
import { domainModules } from './modules';
import { ConfigModule } from '@nestjs/config';
import { BootcampModule } from '@modules/bootcamp/bootcamp.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { EmploymentModule } from './modules/employment/employment.module';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { AdminModule } from './modules/admin/admin.module';
import { FeedModule } from './modules/feed/feed.module';

@Module({
  imports: [
    ...domainModules,
    ConfigModule.forRoot({
      envFilePath: `src/infrastructure/configs/env/.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    DatabaseModule,
    AdminModule,
    FeedModule,
  ],
  exports: [...domainModules, ConfigModule, BootcampModule, PromotionModule, EmploymentModule, DatabaseModule],
})
export class AppModule {}
