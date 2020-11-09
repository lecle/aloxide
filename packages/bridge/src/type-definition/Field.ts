import { FieldTypeEnum } from './FieldTypeEnum';

type FieldType = string | FieldTypeEnum;

export interface Field {
  type: FieldType;
  name: string;
  meta?: {
    /**
     * Example: given type is string and meta.type is tiny
     * Then sequelize model datatype will be DataTypes.TEXT('tiny')
     */
    type?: string;

    /**
     * Example: given type is sring and meta.length is 64
     * Then sequelize model datatype will be DataTypes.STRING(64)
     */
    length?: number;
  };
}
