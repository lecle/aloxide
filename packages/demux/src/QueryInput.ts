interface ConnectionArgs {
  after?: string;
  first?: number;
  before?: string;
  last?: number;
}

export interface QueryInput extends ConnectionArgs {
  [key: string]: string | number | boolean | any;
}
