import path from 'path';
import fs from 'fs';

import { EntityConfig, FilePrinter, ICONContractAdapter, JsPrettier } from '../src';

describe('test ICON contract addapter', () => {
  const blockchain = 'icon';
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

  describe('test generate', () => {
    const outputPath = path.resolve(__dirname, '../out');

    it('should call generateFromTemplate', () => {
      const adapter = new ICONContractAdapter();
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
      const adapter = new ICONContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };
      const templatePath = 'test-path';
      adapter.templatePath = templatePath;

      const spyGenerateInit = jest.spyOn(adapter, 'generateInit');
      spyGenerateInit.mockImplementation(jest.fn());

      const spyGeneratePackage = jest.spyOn(adapter, 'generatePackage');
      spyGeneratePackage.mockImplementation(jest.fn());

      const spyGenerateMainPy = jest.spyOn(adapter, 'generateMainPy');
      spyGenerateMainPy.mockImplementation(jest.fn());

      const spyGenerateCallAPI = jest.spyOn(adapter, 'generateCallAPI');
      spyGenerateCallAPI.mockImplementation(jest.fn());

      const spyGenerateTXAPI = jest.spyOn(adapter, 'generateTXAPI');
      spyGenerateTXAPI.mockImplementation(jest.fn());

      adapter.generateFromTemplate();
      expect(adapter.templatePath).toEqual(path.resolve(templatePath, blockchain));

      expect(spyGenerateInit).toBeCalledTimes(1);
      expect(spyGeneratePackage).toBeCalledTimes(1);
      expect(spyGenerateMainPy).toBeCalledTimes(1);
      expect(spyGenerateCallAPI).toBeCalledTimes(1);
      expect(spyGenerateTXAPI).toBeCalledTimes(1);
    });
  });

  describe('test generateInit', () => {
    it('should generateInit successful', () => {
      const fileName = '__init__.py';
      const adapter = new ICONContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };
      const templatePath = 'temp-path';
      adapter.templatePath = templatePath;
      adapter.jsFilePrinter = new FilePrinter('./out', new JsPrettier(), adapter.logger);
      const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('');
      const spyPrint = jest.spyOn(adapter.jsFilePrinter, 'print').mockReturnValueOnce('');

      adapter.generateInit();
      expect(spyReadFileSync).toBeCalledTimes(1);
      expect(spyReadFileSync).toBeCalledWith(
        path.resolve(templatePath, adapter.folderName, `${fileName}.hbs`),
        'utf-8',
      );
      expect(spyPrint).toBeCalledTimes(1);
      expect(spyPrint).toBeCalledWith(fileName, '', adapter.folderName);
    });
  });
  describe('test generatePackage', () => {
    it('should generatePackage successful', () => {
      const fileName = 'package.json';
      const adapter = new ICONContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };
      const templatePath = 'temp-path';
      adapter.templatePath = templatePath;
      adapter.jsFilePrinter = new FilePrinter('./out', new JsPrettier(), adapter.logger);
      const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('');
      const spyPrint = jest.spyOn(adapter.jsFilePrinter, 'print').mockReturnValueOnce('');

      adapter.generatePackage();
      expect(spyReadFileSync).toBeCalledTimes(1);
      expect(spyReadFileSync).toBeCalledWith(
        path.resolve(templatePath, adapter.folderName, `${fileName}.hbs`),
        'utf-8',
      );
      expect(spyPrint).toBeCalledTimes(1);
      expect(spyPrint).toBeCalledWith(fileName, '', adapter.folderName);
    });
  });

  describe('test generateMainPy', () => {
    it('should generateMainPy successful', () => {
      const fileName = 'icon_hello.py';
      const adapter = new ICONContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };
      const templatePath = 'temp-path';
      adapter.templatePath = templatePath;
      adapter.jsFilePrinter = new FilePrinter('./out', new JsPrettier(), adapter.logger);
      const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(`{{#each tables}}
      @external
      def get{{name}}(self, {{#each fields}}{{#if @first}}{{name}}: {{type}}{{/if}}{{/each}}) -> str:
          return self._{{name}}_table[{{#each fields}}{{#if @first}}{{name}}{{/if}}{{/each}}]
      {{/each}}`);
      const spyPrint = jest.spyOn(adapter.jsFilePrinter, 'print').mockReturnValueOnce('');

      adapter.generateMainPy();
      expect(spyReadFileSync).toBeCalledTimes(1);
      expect(spyReadFileSync).toBeCalledWith(
        path.resolve(templatePath, adapter.folderName, `${fileName}.hbs`),
        'utf-8',
      );
      expect(spyPrint).toBeCalledTimes(1);
      expect(spyPrint).toBeCalledWith(
        fileName,
        `      @external
      def getpoll(self, id: int) -> str:
          return self._poll_table[id]
      @external
      def getvote(self, id: int) -> str:
          return self._vote_table[id]
`,
        adapter.folderName,
      );
    });
  });

  describe('test generateCallAPI', () => {
    it('should generateCallAPI successful', () => {
      const fileName = 'call.json';
      const actionName1 = 'getPoll.json';
      const actionName2 = 'getVote.json';
      const adapter = new ICONContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };

      const templatePath = 'temp-path';
      adapter.templatePath = templatePath;
      adapter.jsFilePrinter = new FilePrinter('./out', new JsPrettier(), adapter.logger);
      const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'icx_call',
          params: {
            to: '',
            dataType: 'call',
            data: {
              method: '{{action}}',
              params: {
                '{{key.name}}': '',
              },
            },
          },
          id: 1,
        }),
      );
      const spyPrint = jest.spyOn(adapter.jsFilePrinter, 'print').mockReturnValueOnce('');

      adapter.generateCallAPI();
      expect(spyReadFileSync).toBeCalledTimes(1);
      expect(spyReadFileSync).toBeCalledWith(
        path.resolve(templatePath, adapter.folderName, `${fileName}.hbs`),
        'utf-8',
      );
      expect(spyPrint).toBeCalledTimes(2);
      expect(spyPrint).toHaveBeenCalledWith(
        actionName1,
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'icx_call',
          params: {
            to: '',
            dataType: 'call',
            data: {
              method: 'getpoll',
              params: {
                id: '',
              },
            },
          },
          id: 1,
        }),
        adapter.folderName,
      );
      expect(spyPrint).toHaveBeenCalledWith(
        actionName2,
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'icx_call',
          params: {
            to: '',
            dataType: 'call',
            data: {
              method: 'getvote',
              params: {
                id: '',
              },
            },
          },
          id: 1,
        }),
        adapter.folderName,
      );
    });
  });

  describe('test generateTXAPI', () => {
    it('should generateTXAPI successful', () => {
      const fileName = 'tx.json';
      const crtFileName = 'crePoll.json';
      const crtUptFileName = 'updPoll.json';
      const crtRmvFileName = 'delPoll.json';
      const adapter = new ICONContractAdapter();
      adapter.entityConfigs = entityConfigs;
      adapter.logger = {
        info: jest.fn(),
        debug: jest.fn(),
      };
      const templatePath = 'temp-path';
      adapter.templatePath = templatePath;
      adapter.jsFilePrinter = new FilePrinter('./out', new JsPrettier(), adapter.logger);
      const spyReadFileSync = jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'icx_call',
          params: {
            nid: '0x3',
            to: '',
            dataType: 'call',
            data: {
              method: '{{action}}',
              params: {
                '{{name}}': '',
              },
            },
          },
        }),
      );
      const spyPrint = jest.spyOn(adapter.jsFilePrinter, 'print').mockReturnValueOnce('');

      adapter.generateTXAPI();
      expect(spyReadFileSync).toBeCalledTimes(1);
      expect(spyReadFileSync).toBeCalledWith(
        path.resolve(templatePath, adapter.folderName, `${fileName}.hbs`),
        'utf-8',
      );
      expect(spyPrint).toBeCalledTimes(6);
      expect(spyPrint).toHaveBeenCalledWith(
        crtFileName,
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'icx_call',
          params: {
            nid: '0x3',
            to: '',
            dataType: 'call',
            data: {
              method: 'crepoll',
              params: { '': '' },
            },
          },
        }),
        adapter.folderName,
      );
      expect(spyPrint).toHaveBeenCalledWith(
        crtUptFileName,
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'icx_call',
          params: {
            nid: '0x3',
            to: '',
            dataType: 'call',
            data: {
              method: 'updpoll',
              params: { '': '' },
            },
          },
        }),
        adapter.folderName,
      );
      expect(spyPrint).toHaveBeenCalledWith(
        crtRmvFileName,
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'icx_call',
          params: {
            nid: '0x3',
            to: '',
            dataType: 'call',
            data: {
              method: 'delpoll',
              params: { '': '' },
            },
          },
        }),
        adapter.folderName,
      );
    });
  });
});
