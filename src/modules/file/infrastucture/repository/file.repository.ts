import { Nullable } from '@/infrastructure/utils/types/types';
import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { File } from '../../core/entity/file';

export class FileRepository extends ExtendedEntityRepository<File> {
  async selectFileBy(filter: { _id?: Nullable<number>; uuid?: Nullable<string> }): Promise<Nullable<File>> {
    let where: Record<string, any> = {};

    if (filter._id) {
      where = { ...where, _id: filter._id };
    }

    if (filter.uuid) {
      where = { ...where, uuid: filter.uuid };
    }

    return await this.createQueryBuilder()
      .select('*')
      .where({
        ...where,
      })
      .getSingleResult();
  }

  async selectFilesBy(filter: { uuids: Array<string> }): Promise<Array<File>> {
    return await this.createQueryBuilder()
      .select('*')
      .where({
        uuid: {
          $in: filter.uuids,
        },
      })
      .getResult();
  }
}
