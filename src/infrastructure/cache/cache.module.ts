import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule } from '@nestjs/cache-manager';

// https://github.com/dabroek/node-cache-manager-redis-store/issues/40
// TODO: 추가적으로 고쳐야 할 부분(나에게 잘 맞는 구성 정보를 추적하면서 찾아야 함.)
// TOOD: https://redis.io/insight/#insight-form 이게 뭔지 알아내야 함.
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        await redisStore({ ttl: 5000 });
      },
    }),
  ],
})
export class CacheTrafficModule {}
