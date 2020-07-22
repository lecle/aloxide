/**
 * type
 * @param type EOS type
 */
export default function (type: string): string {
  let eosType: string;
  switch (type) {
    case 'number':
    case 'uint64_t':
      eosType = 'uint64_t';
      break;
    case 'string':
      eosType = 'std::string';
      break;
    default:
      throw new Error(`unknow type ${type}`);
  }
  return eosType;
}
