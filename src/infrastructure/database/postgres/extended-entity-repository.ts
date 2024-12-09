import { EntityManager, EntityRepository, AnyEntity } from '@mikro-orm/postgresql';

export class ExtendedEntityRepository<T extends object> extends EntityRepository<T> {
  async persist(entity: AnyEntity | AnyEntity[]): Promise<EntityManager> {
    return this.em.persist(entity);
  }

  async persistAndFlush(entity: AnyEntity | AnyEntity[]): Promise<void> {
    await this.em.persistAndFlush(entity);
  }

  async remove(entity: AnyEntity): Promise<EntityManager> {
    return this.em.remove(entity);
  }

  async removeAndFlush(entity: AnyEntity): Promise<void> {
    await this.em.removeAndFlush(entity);
  }

  async flush(): Promise<void> {
    return await this.em.flush();
  }
}
