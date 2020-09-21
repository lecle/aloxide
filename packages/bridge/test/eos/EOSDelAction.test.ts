import { EOSDelAction } from '../../src/eos/EOSDelAction';
import { Table } from '../../src/type-definition/Table';

describe('test eos action del', () => {
  const entity: Table = {
    name: 'x',
    fields: [],
    primaryKeyField: {
      name: 'ee',
      type: 'es',
    },
  };

  it('pass config parameter', () => {
    const a = new EOSDelAction();
    a.template = jest.fn();
    a.implement(entity);
    expect(a.template).toBeCalledWith({
      _config: {
        logDataOnly: a.logDataOnly,
      },
      primaryKeyField: {
        name: 'ee',
        type: 'es',
      },
      tableName: 'x',
    });

    a.logDataOnly = true;
    a.implement(entity);
    expect(a.template).toBeCalledWith({
      _config: {
        logDataOnly: a.logDataOnly,
      },
      primaryKeyField: {
        name: 'ee',
        type: 'es',
      },
      tableName: 'x',
    });

    a.logDataOnly = false;
    a.implement(entity);
    expect(a.template).toBeCalledWith({
      _config: {
        logDataOnly: a.logDataOnly,
      },
      primaryKeyField: {
        name: 'ee',
        type: 'es',
      },
      tableName: 'x',
    });
  });
});
