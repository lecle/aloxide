import { AbsDbUpdater } from './AbsDbUpdater';

export class DbDelUpdater extends AbsDbUpdater {
  handle(obj: any, user?: string): Promise<any> {
    const [pk] = this.model.primaryKeyAttributes;

    return this.model.destroy({
      where: {
        [pk]: obj[pk],
      },
    });
  }
}
