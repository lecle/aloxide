const inquirer = require('inquirer');
const emojis = require('node-emoji');
const fs = require('fs');
const path = require('path');
const YAML = require('json2yaml');

console.log(`Hi Guy! ${emojis.random().emoji}, This is processer to generate entity for you!${
  emojis.random().emoji
}
\nPlease answers the questions below to do it!${emojis.random().emoji}
\n\n--------------------------------------------\n\n`);
const DEFAULT_FILE_NAME = 'aloxide';
const DEFAULT_PATH = path.resolve(__dirname);
const ENTITY_NAME_QUESTION = "What's your entity name?\n";
const PROP_NAME_QUESTION = "What's your property name?\n";
const PROP_TYPE_QUESTION = "What's your property type?\n";
const CONFIRM_PROP_QUESTION = "Do you want to continue create new Entity's property?\n";
const CONFIRM_ENTITY_QUESTION = 'Do you want to continue generate Entity?\n';
const KEY_QUESTION = "Which's the property you choose to become to Key?\n";
const FILE_NAME_QUESTION = "What's your file name? \n";
const FILE_TYPE_QUESTION = "Which's the file type you want to generate?\n";
const FILE_PATH_QUESTION = "Where's the file you want to store?\n";
const FILE_TYPE = { JSON: 'JSON', YML: 'YML' };

let aloxideEntities = { entities: [] };
let isProcessing = true;
let isGeneratingEntity = true;

const entityPropTypeQuestion = {
  type: 'list',
  name: 'propType',
  message: PROP_TYPE_QUESTION,
  choices: ['string', 'number', 'uint16_t', 'uint32_t', 'uint64_t', 'bool', 'account', 'double'],
};

const isDoneEntityQuestion = {
  type: 'confirm',
  name: 'isGeneratingEntity',
  message: CONFIRM_PROP_QUESTION,
};

const isDoneProcessQuestion = {
  type: 'confirm',
  name: 'isProcessing',
  message: CONFIRM_ENTITY_QUESTION,
};

const fileTypeQuestion = {
  type: 'list',
  name: 'fileType',
  message: FILE_TYPE_QUESTION,
  choices: [FILE_TYPE.JSON, FILE_TYPE.YML],
};

const filePathQuestion = {
  type: 'input',
  name: 'filePath',
  default: DEFAULT_PATH,
  message: FILE_PATH_QUESTION,
};

const fileNameQuestion = {
  type: 'input',
  name: 'fileName',
  default: DEFAULT_FILE_NAME,
  message: FILE_NAME_QUESTION,
};

generateEntityKeyQuestion = (fields = []) => {
  return {
    type: 'list',
    name: 'key',
    message: KEY_QUESTION,
    choices: fields.map(item => item.name),
  };
};

generateEntityNameQuestion = (entities = []) => {
  return {
    type: 'input',
    name: 'entityName',
    message: ENTITY_NAME_QUESTION,
    validate: function (answer) {
      if (answer.length < 1) {
        return "Entity's Name is required";
      }
      if (entities.length > 0) {
        if (entities.filter(item => answer.toLowerCase() == item.name.toLowerCase()).length > 0)
          return `Entity "${answer}" is duplicated`;
      }
      return true;
    },
  };
};

generatePropNameQuestion = (entityFields = []) => {
  return {
    type: 'input',
    name: 'propName',
    message: PROP_NAME_QUESTION,
    validate: function (answer) {
      if (answer.length < 1) {
        return "Property's Name is required";
      }
      if (entityFields.length > 0) {
        if (entityFields.filter(item => answer.toLowerCase() == item.name.toLowerCase()).length > 0)
          return `Property "${answer}" is duplicated`;
      }

      return true;
    },
  };
};

writeJSONFile = (path, data) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

writeYMLFile = (path, data) => {
  try {
    fs.writeFileSync(path, YAML.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

(async function () {
  while (isProcessing) {
    // Show question to ask about Enity's Name
    const { entityName } = await inquirer.prompt([
      generateEntityNameQuestion(aloxideEntities.entities),
    ]);
    let entityObject = { name: entityName, fields: [], key: '' };

    while (isGeneratingEntity) {
      // Show question to ask about Property's Name
      const { propName } = await inquirer.prompt([generatePropNameQuestion(entityObject.fields)]);
      // Show question to ask about Property's Type
      const { propType } = await inquirer.prompt([entityPropTypeQuestion]);
      // Show question to ask about done generate property for current entity or not
      const result = await inquirer.prompt([isDoneEntityQuestion]);

      entityObject.fields.push({ name: propName, type: propType });
      console.log('\n', entityObject, '\n');
      !result.isGeneratingEntity && (isGeneratingEntity = result.isGeneratingEntity);
    }
    // Show question to ask about Key's Property Name
    const { key } = await inquirer.prompt([generateEntityKeyQuestion(entityObject.fields)]);

    entityObject.key = key;
    aloxideEntities.entities.push(entityObject);

    // Reset value
    isGeneratingEntity = true;

    // Show question to ask about done generate entity or not
    const result = await inquirer.prompt([isDoneProcessQuestion]);

    !result.isProcessing && (isProcessing = result.isProcessing);
  }

  // Show question to ask about file path
  const { filePath } = await inquirer.prompt([filePathQuestion]);
  // Show question to ask about file name
  const { fileName } = await inquirer.prompt([fileNameQuestion]);
  // Show question to ask about file type
  const { fileType } = await inquirer.prompt([fileTypeQuestion]);

  let pathToStore = filePath.trim() ? filePath : DEFAULT_PATH;
  let fileNameToStore = fileName.trim() ? fileName : DEFAULT_FILE_NAME;
  const fullPath = pathToStore + '/' + fileNameToStore;

  // Handle file type
  if (FILE_TYPE.JSON == fileType) {
    writeJSONFile(`${fullPath}.${fileType.toLowerCase()}`, aloxideEntities);
  } else {
    writeYMLFile(`${fullPath}.${fileType.toLowerCase()}`, aloxideEntities);
  }

  console.log(`\n File already generated at: ${fullPath}.${fileType.toLowerCase()}\n`);
})()
  .then(console.log)
  .catch(console.error);
