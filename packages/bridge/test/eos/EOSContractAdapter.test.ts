import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

import { CplusplusPrettier, EntityConfig, EOSContractAdapter, FilePrinter } from '../../src';
import { EOSCreAction } from '../../src/eos/EOSCreAction';
import { EOSDelAction } from '../../src/eos/EOSDelAction';
import { EOSUpdAction } from '../../src/eos/EOSUpdAction';

jest.mock('../../src/printer/FilePrinter');

describe('test EOS contract addapter', () => {
  const blockchain = 'eos';
  const entityConfigs: EntityConfig[] = [
    {
      fields: [
        { name: 'id', type: 'uint64_t' },
        { name: 'name', type: 'string' },
        { name: 'body', type: 'string' },
      ],
      key: 'id',
      name: 'Poll',
    },
    {
      fields: [
        { name: 'id', type: 'uint64_t' },
        { name: 'pollId', type: 'uint64_t' },
        { name: 'ownerId', type: 'uint64_t' },
        { name: 'point', type: 'number' },
      ],
      key: 'id',
      name: 'Vote',
    },
  ];

  describe('constructor', () => {
    const a = new EOSContractAdapter({
      blockchainType: 'can',
    });
    expect(a.blockchainType).toEqual('can');
  });

  describe('test generate', () => {
    const outputPath = path.resolve(__dirname, '../../out');

    it('should call generateFromTemplate', () => {
      const adapter = new EOSContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };

      const spyGenerateFromTemplate = jest.spyOn(adapter, 'generateFromTemplate');
      spyGenerateFromTemplate.mockImplementation(jest.fn());

      adapter.generate(outputPath);
      expect(adapter.logger.debug).toBeCalledWith(
        `output path is: ${path.resolve(outputPath, blockchain)}, blockchain type: ${blockchain}`,
      );

      expect(adapter.templatePath).toEqual(
        path.resolve(
          path.dirname(require.resolve('@aloxide/bridge')),
          '../smart-contract-templates',
        ),
      );

      expect(adapter.outputPath).toEqual(path.resolve(outputPath, blockchain));

      expect(spyGenerateFromTemplate).toBeCalledTimes(1);
    });
  });
  describe('test generateFromTemplate', () => {
    it('should update templatePath to specific blockchain', () => {
      const adapter = new EOSContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };
      const templatePath = path.resolve(__dirname, '../../smart-contract-templates');
      adapter.templatePath = templatePath;

      const createTables = jest.spyOn(adapter, 'createTables');
      createTables.mockImplementation(jest.fn());

      const createActions = jest.spyOn(adapter, 'createActions');
      createActions.mockImplementation(jest.fn());

      const spyGenerateCpp = jest.spyOn(adapter, 'generateCpp');
      spyGenerateCpp.mockImplementation(jest.fn());

      const spyGenerateHpp = jest.spyOn(adapter, 'generateHpp');
      spyGenerateHpp.mockImplementation(jest.fn());

      adapter.generateFromTemplate();
      expect(adapter.templatePath).toEqual(path.resolve(templatePath, blockchain));

      expect(createActions).toBeCalledTimes(1);
      expect(createActions).toBeCalledTimes(1);
      expect(spyGenerateCpp).toBeCalledTimes(1);
      expect(spyGenerateHpp).toBeCalledTimes(1);
    });

    it('should pass config to the template handler', () => {
      const adapter = new EOSContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };

      const templatePath = 'test-path';
      adapter.templatePath = templatePath;

      const createTables = jest.spyOn(adapter, 'createTables');
      createTables.mockImplementation(jest.fn());

      const createActions = jest.spyOn(adapter, 'createActions');
      createActions.mockImplementation(jest.fn());

      const spyGenerateHpp = jest.spyOn(adapter, 'generateHpp');
      spyGenerateHpp.mockImplementation(jest.fn());

      const spyReadFileSync = jest.spyOn(fs, 'readFileSync');
      spyReadFileSync.mockImplementation(jest.fn());

      const template = jest.fn();
      const spyCompile = jest.spyOn(Handlebars, 'compile');
      spyCompile.mockReturnValue(template);

      adapter.generateFromTemplate();
      expect(adapter.templatePath).toEqual(path.resolve(templatePath, blockchain));

      expect(createActions).toBeCalledTimes(1);
      expect(createActions).toBeCalledTimes(1);
      expect(spyGenerateHpp).toBeCalledTimes(1);

      expect(spyCompile).toBeCalledTimes(1);
      expect(template).toBeCalledWith({
        _config: { useStateData: !(adapter.logDataOnly && !adapter.keepVerification) },
        actions: undefined,
        contractName: undefined,
      });

      adapter.logDataOnly = false;
      adapter.generateFromTemplate();

      expect(template).toBeCalledWith({
        _config: { useStateData: !(adapter.logDataOnly && !adapter.keepVerification) },
        actions: undefined,
        contractName: undefined,
      });

      adapter.logDataOnly = true;
      adapter.generateFromTemplate();

      expect(template).toBeCalledWith({
        _config: { useStateData: !(adapter.logDataOnly && !adapter.keepVerification) },
        actions: undefined,
        contractName: undefined,
      });

      adapter.logDataOnly = true;
      adapter.keepVerification = true;
      adapter.generateFromTemplate();

      expect(template).toBeCalledWith({
        _config: { useStateData: !(adapter.logDataOnly && !adapter.keepVerification) },
        actions: undefined,
        contractName: undefined,
      });
    });
  });

  describe('test generateCpp', () => {
    it('should generateCpp successful', () => {
      const adapter = new EOSContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };
      const templatePath = path.resolve(__dirname, '../../smart-contract-templates/eos');
      adapter.templatePath = templatePath;
      adapter.contractName = 'contractName';
      adapter.printer = new FilePrinter(
        adapter.outputPath,
        new CplusplusPrettier(),
        adapter.logger,
      );
      const spyPrint = jest.spyOn(adapter.printer, 'print').mockResolvedValueOnce('');

      adapter.generateCpp();
      expect(spyPrint).toBeCalledTimes(1);
    });
  });
  describe('test generateHpp', () => {
    it('should generate smart contract Hpp file successful which use state data', () => {
      const adapter = new EOSContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };
      const templatePath = path.resolve(__dirname, '../../smart-contract-templates/eos');
      adapter.templatePath = templatePath;
      adapter.contractName = 'contractName';
      adapter.printer = new FilePrinter(
        adapter.outputPath,
        new CplusplusPrettier(),
        adapter.logger,
      );

      const templateMock = jest.fn();
      jest.spyOn(Handlebars, 'compile').mockReturnValueOnce(templateMock);
      templateMock.mockReturnValueOnce('Generated test content');
      const spyPrint = jest.spyOn(adapter.printer, 'print').mockResolvedValueOnce('');

      adapter.generateHpp();

      expect(templateMock).toBeCalledWith(
        expect.objectContaining({
          _config: {
            useStateData: true,
          },
        }),
      );
      expect(spyPrint).toBeCalledTimes(1);
      expect(spyPrint).toBeCalledWith('contractName.hpp', 'Generated test content');
    });

    it("should generate Hpp smart contract which doesn't use state data", () => {
      const adapter = new EOSContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };
      const templatePath = path.resolve(__dirname, '../../smart-contract-templates/eos');
      adapter.templatePath = templatePath;
      adapter.contractName = 'contractName';
      adapter.printer = new FilePrinter(
        adapter.outputPath,
        new CplusplusPrettier(),
        adapter.logger,
      );
      adapter.logDataOnly = true;

      const templateMock = jest.fn();
      jest.spyOn(Handlebars, 'compile').mockReturnValueOnce(templateMock);
      templateMock.mockReturnValueOnce('Generated test content');
      const spyPrint = jest.spyOn(adapter.printer, 'print').mockResolvedValueOnce('');

      adapter.generateHpp();

      expect(templateMock).toBeCalledWith(
        expect.objectContaining({
          _config: {
            useStateData: false,
          },
        }),
      );
      expect(spyPrint).toBeCalledTimes(1);
      expect(spyPrint).toBeCalledWith('contractName.hpp', 'Generated test content');
    });

    it('should generate Hpp smart contract which use simple state data', () => {
      const adapter = new EOSContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };
      const templatePath = path.resolve(__dirname, '../../smart-contract-templates/eos');
      adapter.templatePath = templatePath;
      adapter.contractName = 'contractName';
      adapter.printer = new FilePrinter(
        adapter.outputPath,
        new CplusplusPrettier(),
        adapter.logger,
      );
      adapter.logDataOnly = true;
      adapter.keepVerification = true;

      const templateMock = jest.fn();
      jest.spyOn(Handlebars, 'compile').mockReturnValueOnce(templateMock);
      templateMock.mockReturnValueOnce('Generated test content');
      const spyPrint = jest.spyOn(adapter.printer, 'print').mockResolvedValueOnce('');

      // Create tables to use
      adapter.createTables();
      adapter.generateHpp();

      expect(templateMock).toBeCalledWith(
        expect.objectContaining({
          _config: {
            useStateData: true,
          },
          tables: expect.arrayContaining(
            adapter.tables.map(t => ({
              ...t,
              fields: [t.primaryKeyField],
            })),
          ),
        }),
      );
      expect(spyPrint).toBeCalledTimes(1);
      expect(spyPrint).toBeCalledWith('contractName.hpp', 'Generated test content');
    });
  });

  describe('test generateCpp', () => {
    it('should generateCpp successful', () => {
      const adapter = new EOSContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };
      const templatePath = path.resolve(__dirname, '../../smart-contract-templates/eos');
      adapter.templatePath = templatePath;
      adapter.contractName = 'contractName';
      adapter.printer = new FilePrinter(
        adapter.outputPath,
        new CplusplusPrettier(),
        adapter.logger,
      );
      const spyPrint = jest.spyOn(adapter.printer, 'print').mockResolvedValueOnce('');

      adapter.generateCpp();
      expect(spyPrint).toBeCalledTimes(1);
    });
  });
  describe('test generateHpp', () => {
    it('should generateHpp successful', () => {
      const adapter = new EOSContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };
      const templatePath = path.resolve(__dirname, '../../smart-contract-templates/eos');
      adapter.templatePath = templatePath;
      adapter.contractName = 'contractName';
      adapter.printer = new FilePrinter(
        adapter.outputPath,
        new CplusplusPrettier(),
        adapter.logger,
      );
      const spyPrint = jest.spyOn(adapter.printer, 'print').mockResolvedValueOnce('');

      adapter.generateHpp();
      expect(spyPrint).toBeCalledTimes(1);
    });
  });

  describe('test createTables', () => {
    it('should createTables successful', () => {
      const adapter = new EOSContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };
      const table = [
        {
          name: 'poll',
          fields: [
            { name: 'id', type: 'uint64_t' },
            { name: 'name', type: 'std::string' },
            { name: 'body', type: 'std::string' },
          ],
          primaryKeyField: { name: 'id', type: 'uint64_t' },
        },
        {
          name: 'vote',
          fields: [
            { name: 'id', type: 'uint64_t' },
            { name: 'pollId', type: 'uint64_t' },
            { name: 'ownerId', type: 'uint64_t' },
            { name: 'point', type: 'double' },
          ],
          primaryKeyField: { name: 'id', type: 'uint64_t' },
        },
      ];

      adapter.createTables();
      expect(adapter.tables).toEqual(table);
    });
  });

  describe('test createActions', () => {
    it('should createActions successful', () => {
      const adapter = new EOSContractAdapter();
      adapter.entityConfigs = entityConfigs;
      const table = [
        {
          name: 'poll',
          fields: [
            { name: 'id', type: 'uint64_t' },
            { name: 'name', type: 'std::string' },
            { name: 'body', type: 'std::string' },
          ],
          primaryKeyField: { name: 'id', type: 'uint64_t' },
        },
        {
          name: 'vote',
          fields: [
            { name: 'id', type: 'uint64_t' },
            { name: 'pollId', type: 'uint64_t' },
            { name: 'ownerId', type: 'uint64_t' },
            { name: 'point', type: 'uint64_t' },
          ],
          primaryKeyField: { name: 'id', type: 'uint64_t' },
        },
      ];
      adapter.tables = table;
      const templatePath = path.resolve(__dirname, '../../smart-contract-templates/eos');
      adapter.templatePath = templatePath;
      adapter.actionCreators = [new EOSCreAction(), new EOSUpdAction(), new EOSDelAction()];
      adapter.actionCreators.forEach(ac => {
        ac.templatePath = adapter.templatePath;
        ac.logDataOnly = adapter.logDataOnly;
      });
      adapter.createActions();
      expect(adapter.actions).toBeDefined();
    });
  });
});
