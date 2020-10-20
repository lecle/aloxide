import { Aloxide, BlockchainAccount, BlockchainTypes } from '@aloxide/aloxide-js';
import { readAloxideConfig } from '@aloxide/abstraction';
import dotEnv from 'dotenv-extended';
import path from 'path';

(function loadEnv() {
  dotEnv.load({
    encoding: 'utf8',
    silent: true,
    path: path.resolve(__dirname, '../.env'),
    defaults: path.resolve(__dirname, '../.env.default'),
    schema: path.resolve(__dirname, '../.env.default'),
    errorOnMissing: true,
    errorOnExtra: true,
    errorOnRegex: false,
    includeProcessEnv: false,
    assignToProcessEnv: true,
    overrideProcessEnv: false,
  });
})();

const processArgs = process.argv;
const action: string = processArgs[2];
const entityName: string = processArgs[3];
const entities = readAloxideConfig(path.resolve(__dirname, '../aloxide.yml')).entities;
const restArguments: string[] = processArgs.slice(4);
const entityObj = entities.find(e => {
  return entityName.toLowerCase() === e.name.toLowerCase();
});
/* tslint:disable */
if (!entityObj) {
  console.log('Error: Entity not found, please check your "aloxide.yml" to update your schema');
}
/* tslint:enable */

function fillParams(entity, args) {
  const fields = entity.fields;
  const params = {};

  for (let i = 0; i < args.length; i++) {
    if (!fields[i]) {
      break;
    }

    params[fields[i].name] = args[i];
  }

  return params;
}

async function run(entity, command, args) {
  const config = process.env;
  const contract = config.app_blockchain_contract;
  const account = new BlockchainAccount(
    config.app_blockchain_account,
    config.app_blockchain_account_pk,
  );
  const params = fillParams(entity, args);
  const key = entity.key;

  // create service using .env config
  const service = await Aloxide.createService({
    name: config.app_blockchain_name,
    type: BlockchainTypes[config.app_blockchain_type.toUpperCase()],
    protocol: config.app_blockchain_protocol,
    host: config.app_blockchain_host,
    path: config.app_blockchain_path,
    port: parseInt(config.app_blockchain_port, 10),
    chainId: config.app_blockchain_chainId,
    coreToken: config.app_blockchain_token,
  });

  // create model
  const Model = await service.createModel(entity.name, contract, account);

  // Run command
  let result;

  switch (command) {
    case 'get':
      result = await Model.get({ [key]: args[0] });
      if (!result) {
        throw new Error(`${entity.name} with "${key} = ${args[0]}" was not found.`);
      }
      break;
    case 'create':
    case 'update':
      const existed = !!(await Model.get({ [key]: args[0] }));
      if (!existed) {
        result = await Model.add(params);
      } else {
        result = await Model.update(
          {
            [key]: args[0],
          },
          params,
        );
      }
      break;
    case 'delete':
      result = await Model.delete({ [key]: args[0] });
      break;
  }

  return result;
}

/* tslint:disable */
run(entityObj, action, restArguments).then(
  res => {
    console.log(res);
  },
  rej => {
    console.log(rej.message);
  },
);
/* tslint:enable */
