export function checkSingleKey(key: { [key: string]: any }) {
  if (!(key instanceof Object)) {
    throw new Error('Invalid parameter.');
  }

  const keys = Object.keys(key);

  if (keys.length > 1) {
    throw new Error('Multiple keys are not support.');
  }

  if (keys.length === 0) {
    throw new Error('Key must have 1 key-pair value.');
  }

  return true;
}
