const path = require('path');

module.exports = (request, options) => {
  if (/packages\/.+\/src$/.test(request)) {
    return path.resolve(options.rootDir, request.replace('/packages', ''), 'index.ts');
  }

  return options.defaultResolver(request, options);
};
