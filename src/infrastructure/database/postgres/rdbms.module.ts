import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityCaseNamingStrategy } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';
import * as path from 'path';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      driver: PostgreSqlDriver,
      dbName: 'mob_db',
      user: 'mob_user',
      password: 'mob_password',
      host: 'localhost',
      port: 5432,
      entities: [
        path.resolve(process.cwd(), 'dist/modules/*/**/core/entity/*.js'),
        path.resolve(process.cwd(), 'dist/modules/*/**/core/value/*.js'),
        path.resolve(process.cwd(), 'dist/modules/*/**/core/value/embeddable/*.js'),
        path.resolve(process.cwd(), 'dist/infrastructure/utils/structure/*.js'),
      ],
      entitiesTs: [
        path.resolve(process.cwd(), 'src/modules/*/**/core/entity/*.ts'),
        path.resolve(process.cwd(), 'src/modules/*/**/core/value/*.ts'),
        path.resolve(process.cwd(), 'dist/modules/*/**/core/value/embeddable/*.js'),
        path.resolve(process.cwd(), 'dist/infrastructure/utils/structure/*.ts'),
      ],
      discovery: {
        warnWhenNoEntities: false,
        requireEntitiesArray: false,
        alwaysAnalyseProperties: true,
      },
      autoLoadEntities: false,
      namingStrategy: EntityCaseNamingStrategy,
      forceUtcTimezone: true,
      debug: true,
      logger: console.log.bind(console),
      highlighter: new SqlHighlighter(),
      connect: true,
      pool: {
        min: 0,
        max: 10,
        createTimeoutMillis: 8000,
        acquireTimeoutMillis: 8000,
        idleTimeoutMillis: 8000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
      },
    }),
  ],
  exports: [],
})
export class RDBMSModule {}
