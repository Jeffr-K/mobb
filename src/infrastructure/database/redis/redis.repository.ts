import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheRepository {
  private readonly redisClient: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redisClient = redisService.getClient();
  }

  async set<T>(key: string, value: T, ttl?: number) {
    return this.redisClient.set(key, await this.convert(value), 'EX', ttl);
  }

  async get(key: string) {
    return this.redisClient.get(key);
  }

  async delete(key: string) {
    return this.redisClient.del(key);
  }

  private async convert<T>(value: T): Promise<string> {
    return JSON.stringify(value);
  }
}
