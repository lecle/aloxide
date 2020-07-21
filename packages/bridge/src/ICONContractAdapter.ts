import { AbsContractAdapter } from './AbsContractAdapter';

export class ICONContractAdapter extends AbsContractAdapter {
  constructor() {
    super('icon');
  }

  generateFromTemplate() {
    throw new Error('Method not implemented.');
  }
}
