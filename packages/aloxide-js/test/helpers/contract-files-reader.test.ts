import fetch from 'node-fetch';
import { TextEncoder, TextDecoder } from 'util';
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import fs from 'fs';
const { readWASMFile, readPSFile, readABIFile } = jest.requireActual(
  '../../src/helpers/contract-files-reader',
);

describe('test contract-files-reader', () => {
  describe('readABIFile()', () => {
    it('should throw error when missing file path', () => {
      expect(() => {
        // @ts-ignore
        readABIFile(undefined);
      }).toThrowError('File path is required.');
    });

    it('should throw error when missing API instance', () => {
      expect(() => {
        // @ts-ignore
        readABIFile('some/path');
      }).toThrowError('Missing EOS API instance');
    });

    it('should read file and return serialized hex content', () => {
      const api = new Api({
        rpc: new JsonRpc('some_url', { fetch }),
        signatureProvider: new JsSignatureProvider([]),
        textEncoder: new TextEncoder(),
        textDecoder: new TextDecoder(),
      });

      const testFileBuffer = Buffer.from('{ "test": "test content" }', 'utf-8');
      const readFileSyncMock = jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValueOnce(testFileBuffer.toString('utf-8'));

      const res = readABIFile('some/path', api);
      expect(typeof res).toBe('string');
    });
  });

  describe('readWASMFile()', () => {
    it('should throw error when missing file path', () => {
      expect(() => {
        // @ts-ignore
        readWASMFile(undefined);
      }).toThrowError('File path is required.');
    });

    it('should throw Not Found error when reading from not-existing file', () => {
      const path = 'not/existing/file/path';

      expect(() => {
        readWASMFile(path);
      }).toThrowError('File not found!');
    });

    it('should throw error when reading failed', () => {
      const path = 'not/existing/file/path';
      const readFileSyncMock = jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
        throw new Error('Test Error');
      });

      expect(() => {
        readWASMFile(path);
      }).toThrowError('Test Error');
      expect(readFileSyncMock).toBeCalledWith(path);
    });

    it('should read file and convert to hex string', () => {
      const testFileBuffer = Buffer.from('test content', 'utf-8');
      const readFileSyncMock = jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(testFileBuffer);
      const wasmPath = 'some/wasm/path';

      const result = readWASMFile(wasmPath);
      expect(result).toBe(testFileBuffer.toString('hex'));
      expect(readFileSyncMock).toBeCalledWith(wasmPath);
    });
  });

  describe('readPSFile()', () => {
    it('should throw error when missing file path', () => {
      expect(() => {
        // @ts-ignore
        readPSFile(undefined);
      }).toThrowError('File path is required.');
    });

    it('should throw Not Found error when reading from not-existing file', () => {
      const path = 'not/existing/file/path';

      expect(() => {
        readPSFile(path);
      }).toThrowError('File not found!');
    });

    it('should throw error when reading failed', () => {
      const path = 'not/existing/file/path';
      const readFileSyncMock = jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
        throw new Error('Test Error');
      });

      expect(() => {
        readPSFile(path);
      }).toThrowError('Test Error');
      expect(readFileSyncMock).toBeCalledWith(path);
    });

    it('should read file and convert to hex string', () => {
      const testFileBuffer = Buffer.from('test content', 'utf-8');
      const readFileSyncMock = jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(testFileBuffer);
      const psPath = 'some/ps/path';

      const result = readPSFile(psPath);
      expect(result).toBe(testFileBuffer.toString('hex'));
      expect(readFileSyncMock).toBeCalledWith(psPath);
    });
  });
});
