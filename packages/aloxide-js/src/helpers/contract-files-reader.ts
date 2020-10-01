import fs from 'fs';
import isInvalidPath from 'is-invalid-path';

export default class ContractFilesReader {
  static readABIFromFile(abiPath) {
    return fs.readFileSync(abiPath);
  }

  static readWASMFromFile(wasmPath) {
    return fs.readFileSync(wasmPath);
  }
  static readPSFromFile(psPath) {
    return fs.readFileSync(psPath);
  }

  static doesAbiExists(abi) {
    return !isInvalidPath(abi);
  }
}
