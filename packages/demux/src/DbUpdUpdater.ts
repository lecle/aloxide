import { AbsDbUpdater } from './AbsDbUpdater';

export class DbUpdUpdater extends AbsDbUpdater {
  handle(obj: any, user?: string): Promise<any> {
    const [pk] = this.model.primaryKeyAttributes;
    return this.model.update(obj, {
      where: {
        [pk]: obj[pk],
      },
    });
  }
}
