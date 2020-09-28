<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of content**

- [Package `@aloxide/model-sequelize`](#package-aloxidemodel-sequelize)
  - [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Package `@aloxide/model-sequelize`

A model builder for Sequelize

## Usage

[sample](../example-api-gateway/src/models.ts)

```javascript
import { ModelBuilder } from '@aloxide/model-sequelize';

// create model builder from an Aloxide configuration
const modelBuilder = new ModelBuilder({
  aloxideConfigPath: config.aloxideConfigPath,
  logger: Logger.createLogger({
    level: 'debug',
    name: 'models',
  }),
});

// using mapField
import { indexStateSchema } from '@aloxide/demux';
const typeInterpreter = new SequelizeTypeInterpreter();

const indexStateSequelizeFields = ModelBuilder.mapField(
  typeInterpreter,
  indexStateSchema.fields,
  indexStateSchema.key,
);

// use the model builder
import { Sequelize } from 'sequelize';
const sequelize = new Sequelize('sqlite::memory:');
const models = modelBuilder.build(sequelize);

models.push(sequelize.define(name, indexStateSequelizeFields));
```
