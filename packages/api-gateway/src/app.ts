import { Model, ModelCtor } from 'sequelize/types';

import { appConfig } from './appConfig';
import { createRouter } from './express-router';
import { generateModelConfig } from './generateModelConfig';

class App {
  models: {
    [key: string]: ModelCtor<Model>;
  };

  init(modelPath?: string) {
    generateModelConfig();

    if (!modelPath) {
      modelPath = appConfig.modelPath;
    }

    appConfig.logger.debug('-- load model builder from:', modelPath);

    this.models = require(modelPath)?.bcModelBuilder(appConfig.sequelize);
    return createRouter();
  }
}

//@ts-ignore
export const app = new App();
