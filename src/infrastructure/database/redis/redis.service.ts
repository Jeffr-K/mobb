import { Injectable } from '@nestjs/common';
import { RedisCacheRepository } from './redis.repository';

@Injectable()
export class RedisCacheService {
  constructor(private readonly redisCacheRepository: RedisCacheRepository) {}

  async set(data: { key: string; value: any; ttl?: number }): Promise<void> {
    await this.redisCacheRepository.set(data.key, data.value, data.ttl);
  }

  async get(data: { key: string }): Promise<any> {
    return await this.redisCacheRepository.get(data.key);
  }

  async delete(data: { key: string }): Promise<void> {
    await this.redisCacheRepository.delete(data.key);
  }
}
