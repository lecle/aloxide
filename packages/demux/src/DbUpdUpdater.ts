import { AbsDbUpdater } from './AbsDbUpdater';

export class DbUpdUpdater extends AbsDbUpdater {
  handle(obj: any, user?: string): Promise<any> {
    const [pk] = this.model.primaryKeyAttributes;

    this.logger?.debug(`-- update obj [${pk}]`, obj[pk], this.model.name);

    return this.model.update(obj, {
      where: {
        [pk]: obj[pk],
      },
    });
  }
}
