/**
 * type
 * @param type EOS type
 */
export default function (type: string): string {
  let iconType: string;
  switch (type) {
    case 'number':
    case 'uint64_t':
      iconType = 'int';
      break;
    case 'string':
      iconType = 'str';
      break;
    default:
      throw new Error(`unknow type ${type}`);
  }
  return iconType;
}
