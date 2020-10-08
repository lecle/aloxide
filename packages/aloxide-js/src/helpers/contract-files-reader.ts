import { Api, Serialize } from 'eosjs';
import fs from 'fs';

/**
 *
 * @param abiPath string
 * @returns Serialized hex string
 */
export function readABIFile(abiPath: string | Buffer | URL, api: Api): string {
  if (!abiPath) {
    throw new Error('File path is required.');
  }

  if (!api) {
    throw new Error('Missing EOS API instance');
  }

  const buffer = new Serialize.SerialBuffer({
    textEncoder: api.textEncoder,
    textDecoder: api.textDecoder,
  });

  let abiJSON = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
  const abiDefinitions = api.abiTypes.get('abi_def');

  // Ensures that the .abi file contains the fields that an .abi file is expected to contain
  abiJSON = abiDefinitions.fields.reduce(
    (acc, { name: fieldName }) => Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
    abiJSON,
  );
  abiDefinitions.serialize(buffer, abiJSON);

  return Buffer.from(buffer.asUint8Array()).toString('hex');
}

/**
 *
 * @param wasmPath
 * @returns hex string
 */
export function readWASMFile(wasmPath: string | Buffer | URL): string {
  try {
    if (!wasmPath) {
      throw new Error('File path is required.');
    }

    return fs.readFileSync(wasmPath).toString('hex');
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error('File not found!');
    } else {
      throw err;
    }
  }
}

/**
 *
 * @param psPath file path
 * @returns hex string
 */
export function readPSFile(psPath: string | Buffer | URL): string {
  try {
    if (!psPath) {
      throw new Error('File path is required.');
    }

    return fs.readFileSync(psPath).toString('hex');
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error('File not found!');
    } else {
      throw err;
    }
  }
}
