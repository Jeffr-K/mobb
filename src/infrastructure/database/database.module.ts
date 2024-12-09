import { Module } from '@nestjs/common';
import { RDBMSModule } from './postgres/rdbms.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [RDBMSModule, RedisModule],
  exports: [RDBMSModule, RedisModule],
})
export class DatabaseModule {}
