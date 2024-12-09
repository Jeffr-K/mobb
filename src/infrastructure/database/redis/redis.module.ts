import { Module } from '@nestjs/common';
import { RedisCacheService } from './redis.service';
import { RedisModule as RedisSyncModule } from '@liaoliaots/nestjs-redis';
import { RedisCacheRepository } from './redis.repository';

@Module({
  imports: [
    RedisSyncModule.forRoot({
      config: [
        {
          host: 'localhost',
          port: 6379,
          password: 'root',
          onClientCreated(client) {
            client.on('error', err => {
              console.log(`[ERROR] Redis 연결 과정 중 에러가 발생했습니다. ${err}`);
            });
            client.on('ready', () => {
              console.log(`[INFO] Redis 연결 과정이 성공하였습니다.`);
            });
          },
        },
      ],
    }),
  ],
  providers: [RedisCacheService, RedisCacheRepository],
  exports: [RedisCacheService, RedisCacheRepository],
})
export class RedisModule {}
