import { AbsDbUpdater } from './AbsDbUpdater';

export class DbUpdUpdater extends AbsDbUpdater {
  handle(obj: any, user?: string): Promise<any> {
    const uObj = Object.assign({}, obj);
    delete uObj.id;

    return this.model.update(uObj, {
      where: {
        id: obj.id,
      },
    });
  }
}
