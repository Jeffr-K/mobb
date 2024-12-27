import { RedisCacheService } from 'src/infrastructure/database/redis/redis.service';
import { SecureSession } from '../../core/entity/secure.session';
import { Injectable } from '@nestjs/common';
import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';

@Injectable()
export class SecureSessionCacheRepository {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  async persistToken<T = SecureSession>(data: { key: string; value: T }) {
    await this.redisCacheService.set({
      key: data.key,
      value: data.value,
      ttl: 60 * 60 * 24 * 30,
    });
  }

  async destroyToken(data: { key: string }) {
    await this.redisCacheService.delete({ key: data.key });
  }

  async getToken(data: { key: string }): Promise<SecureSession> {
    return await this.redisCacheService.get({ key: data.key });
  }
}

@Injectable()
export class SecureSessionRepository extends ExtendedEntityRepository<SecureSession> {
  async removeSecureSession(data: { email: string }): Promise<void> {
    await this.createQueryBuilder().delete().where({ email: data.email }).execute();
  }

  async updateToken(data: { email: string; accessToken: string; refreshToken: string }): Promise<void> {
    await this.createQueryBuilder()
      .update({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })
      .where({ email: data.email })
      .execute();
  }
}
