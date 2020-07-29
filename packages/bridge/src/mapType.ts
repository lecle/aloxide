function getTypeOfuint64_t(blockchain: string, type: string): string {
  switch (blockchain) {
    case 'icon':
      type = 'int';
      break;
    case 'eos':
    default:
      type = 'uint64_t';
  }
  return type;
}

function getTypeOfstring(blockchain: string, type: string): string {
  switch (blockchain) {
    case 'icon':
        type = 'str';
        break;
      break;
    case 'eos':
    default:
      type = 'std::string';
  }

  return type;
}

/**
 * type
 * @param type EOS type
 */
export default function (type: string, blockchain: string): string {
  let mappedType: string;
  switch (type) {
    case 'number':
    case 'uint64_t':
      mappedType = getTypeOfuint64_t(blockchain, type);
      break;
    case 'string':
      mappedType = getTypeOfstring(blockchain, type);
      break;
    default:
      throw new Error(`unknow type ${type}`);
  }

  return mappedType;
}
