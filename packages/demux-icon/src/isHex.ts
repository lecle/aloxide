export default function isHex(t: any) {
  return typeof t == 'string' && /^0x[0-9a-f]+$/.test(t);
}
