import fs from 'fs';
import path from 'path';
import { FilePrinter, JsPrettier } from '../../src';
import createLoggerTest from '../createLoggerTest';

describe('FilePrinter', () => {
  it('no error', () => {
    const p = new FilePrinter('out', new JsPrettier(), createLoggerTest());
    const spyFormat = jest.spyOn(p.prettier, 'format').mockReturnValue('formated msg');
    const spyWriteFileSync = jest.spyOn(fs, 'writeFileSync').mockReturnValue();

    p.print('aa', 'data');

    expect(spyFormat).toBeCalledTimes(1);
    expect(spyFormat).toBeCalledWith('data', { semi: true, tabWidth: 4, useTabs: true });
    expect(spyWriteFileSync).toBeCalledTimes(1);
    expect(spyWriteFileSync).toBeCalledWith(path.resolve('out', 'aa'), 'formated msg');
  });

  describe('ensureExistingFolder', () => {
    it('exist', () => {
      const spyExistsSync = jest.spyOn(fs, 'existsSync');
      const spyMkdirSync = jest.spyOn(fs, 'mkdirSync').mockReturnValue('');
      const p = new FilePrinter('out', new JsPrettier(), createLoggerTest());

      const folderPath = path.resolve(__dirname, '../prettier');
      expect(p.ensureExistingFolder(folderPath)).toEqual(folderPath);
      expect(spyExistsSync).toBeCalledWith(folderPath);
      expect(spyMkdirSync).not.toBeCalled();
    });
    it('not exist', () => {
      const spyExistsSync = jest.spyOn(fs, 'existsSync');
      const spyMkdirSync = jest.spyOn(fs, 'mkdirSync').mockReturnValue('');
      const p = new FilePrinter('out', new JsPrettier(), createLoggerTest());

      expect(p.ensureExistingFolder('../kk')).toEqual('../kk');
      expect(spyExistsSync).toBeCalledWith('../kk');
      expect(spyMkdirSync).toBeCalledWith('../kk', { recursive: true });
    });
  });
});
