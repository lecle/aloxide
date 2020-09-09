import isHex from './isHex';

function hexToNumber(t: string) {
  return parseInt(t.substr(2), 16);
}

export function hexPropToNumber(obj: { [key: string]: any }) {
  if (!obj) return obj;

  Object.entries(obj).forEach(entry => {
    const [k, v] = entry;
    switch (typeof v) {
      case 'string':
        if (isHex(v)) {
          obj[k] = hexToNumber(v);
        }
        break;
      case 'object':
        obj[k] = hexPropToNumber(v);
        break;
    }
  });

  return obj;
}

export default hexToNumber;
