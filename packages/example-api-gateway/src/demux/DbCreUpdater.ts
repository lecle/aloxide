import { AbsDbUpdater } from './AbsDbUpdater';

export class DbCreUpdater extends AbsDbUpdater {
  handle(obj: any, user?: string): Promise<any> {
    return this.model.create(obj);
  }
}
