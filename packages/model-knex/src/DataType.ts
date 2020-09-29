import type { Field } from '@aloxide/bridge';
import type { CreateTableBuilder, ColumnBuilder } from 'knex';

export type DataType = (table: CreateTableBuilder, f: Field, key: string) => ColumnBuilder;
