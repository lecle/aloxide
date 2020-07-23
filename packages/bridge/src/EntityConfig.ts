export interface EntityConfig {
  name: string;
  fields: {
    name: string;
    type: string;
  }[];
  key: string;
}
