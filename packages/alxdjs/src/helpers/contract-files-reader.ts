import fs from 'fs';
import path from 'path';
import isInvalidPath from 'is-invalid-path';
var JSZip = require("jszip");


export default class contractFilesReader {
    static readABIFromFile(abiPath) {
        return JSON.parse(fs.readFileSync(path.resolve(abiPath), 'utf8'));
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

