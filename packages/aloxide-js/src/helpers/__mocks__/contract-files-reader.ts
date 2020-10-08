const readerMock: any = jest.createMockFromModule('../contract-files-reader');
const { readABIFile, readWASMFile, readPSFile } = jest.requireActual('../contract-files-reader');
let fileContents = {};

readerMock.__setMockFileContent = (content, extension) => {
  fileContents[extension] = content;
};

readerMock.__resetMockFileContent = extension => {
  // Reset all
  if (!extension) {
    fileContents = {};
  } else {
    // reset by extension
    fileContents[extension] = '';
  }
};

const createReadFileMockFn = (originalFn, extension) => {
  return (...args) => {
    if (!fileContents[extension]) {
      return originalFn(...args);
    }

    return fileContents[extension];
  };
};

readerMock.readABIFile = createReadFileMockFn(readABIFile, 'abi');
readerMock.readWASMFile = createReadFileMockFn(readWASMFile, 'wasm');
readerMock.readPSFile = createReadFileMockFn(readPSFile, 'ps');

module.exports = readerMock;
