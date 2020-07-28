import { AbsDbUpdater } from './AbsDbUpdater';

export class DbDelUpdater extends AbsDbUpdater {
  handle(obj: any, user?: string): Promise<any> {
    return this.model.destroy({
      where: {
        id: obj.id,
      },
    });
  }
}
