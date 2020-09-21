import { EOSCreAction } from '../../src/eos/EOSCreAction';
import { Table } from '../../src/type-definition/Table';

describe('test eos action cre', () => {
  const entity: Table = {
    name: 'x',
    fields: [],
    primaryKeyField: {
      name: 'ee',
      type: 'es',
    },
  };

  it('pass config parameter', () => {
    const a = new EOSCreAction();
    a.template = jest.fn();
    a.implement(entity);
    expect(a.template).toBeCalledWith({
      _config: {
        logDataOnly: a.logDataOnly,
      },
      fields: [],
      tableName: 'x',
    });

    a.logDataOnly = true;
    a.implement(entity);
    expect(a.template).toBeCalledWith({
      _config: {
        logDataOnly: a.logDataOnly,
      },
      fields: [],
      tableName: 'x',
    });

    a.logDataOnly = false;
    a.implement(entity);
    expect(a.template).toBeCalledWith({
      _config: {
        logDataOnly: a.logDataOnly,
      },
      fields: [],
      tableName: 'x',
    });
  });
});
