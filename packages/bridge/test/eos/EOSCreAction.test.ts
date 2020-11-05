import path from 'path';
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

  it('should create template', () => {
    const action = new EOSCreAction();
    const tableConfig: Table = {
      name: 'test_table',
      fields: [
        {
          name: 'field1',
          type: 'fieldtype1',
        },
        {
          name: 'field2',
          type: 'fieldtype2',
        },
      ],
      primaryKeyField: {
        name: 'field1',
        type: 'fieldtype1',
      },
    };
    action.makeActionName = jest.fn().mockReturnValue('actionNameTest');
    // @ts-ignore
    action.templateImplement = jest.fn().mockReturnValue('templateImplementTest');
    action.makeParams = jest.fn().mockReturnValue(tableConfig.fields);

    const res = action.create(tableConfig);

    expect(action.makeActionName).toBeCalledWith(tableConfig.name);
    // @ts-ignore
    expect(action.templateImplement).toBeCalledWith(tableConfig);
    expect(action.makeParams).toBeCalledWith(tableConfig);
    expect(res).toEqual({
      actionName: 'actionNameTest',
      code: 'templateImplementTest',
      params: tableConfig.fields,
    });
  });

  it('should implement template with necessary fields when "keepVerification" is true', () => {
    const action = new EOSCreAction();
    action.logDataOnly = true;
    action.keepVerification = true;
    action.templatePath = path.resolve(__dirname, '../../smart-contract-templates/eos');
    const tableConfig: Table = {
      name: 'test_table',
      fields: [
        {
          name: 'field1',
          type: 'fieldtype1',
        },
        {
          name: 'field2',
          type: 'fieldtype2',
        },
      ],
      primaryKeyField: {
        name: 'field1',
        type: 'fieldtype1',
      },
    };
    const necessaryFields = [tableConfig.primaryKeyField];

    action.implement = jest.fn();

    // @ts-ignore
    action.templateImplement(tableConfig);

    expect(action.implement).toBeCalledWith({
      ...tableConfig,
      fields: necessaryFields,
    });
  });

  it('pass config parameter', () => {
    const a = new EOSCreAction();
    a.template = jest.fn();
    a.implement(entity);
    expect(a.template).toBeCalledWith({
      _config: {
        useStateData: !(a.logDataOnly && !a.keepVerification),
      },
      fields: [],
      tableName: 'x',
    });

    a.logDataOnly = true;
    a.implement(entity);
    expect(a.template).toBeCalledWith({
      _config: {
        useStateData: !(a.logDataOnly && !a.keepVerification),
      },
      fields: [],
      tableName: 'x',
    });

    a.logDataOnly = true;
    a.keepVerification = false;
    a.implement(entity);
    expect(a.template).toBeCalledWith({
      _config: {
        useStateData: !(a.logDataOnly && !a.keepVerification),
      },
      fields: [],
      tableName: 'x',
    });

    a.logDataOnly = true;
    a.keepVerification = true;
    a.implement(entity);
    expect(a.template).toBeCalledWith({
      _config: {
        useStateData: !(a.logDataOnly && !a.keepVerification),
      },
      fields: [],
      tableName: 'x',
    });

    a.logDataOnly = false;
    a.implement(entity);
    expect(a.template).toBeCalledWith({
      _config: {
        useStateData: !(a.logDataOnly && !a.keepVerification),
      },
      fields: [],
      tableName: 'x',
    });

    a.logDataOnly = false;
    a.keepVerification = false;
    a.implement(entity);
    expect(a.template).toBeCalledWith({
      _config: {
        useStateData: !(a.logDataOnly && !a.keepVerification),
      },
      fields: [],
      tableName: 'x',
    });

    a.logDataOnly = false;
    a.keepVerification = true;
    a.implement(entity);
    expect(a.template).toBeCalledWith({
      _config: {
        useStateData: !(a.logDataOnly && !a.keepVerification),
      },
      fields: [],
      tableName: 'x',
    });
  });
});
