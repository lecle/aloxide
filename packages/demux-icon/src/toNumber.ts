import BigNumber from 'bignumber.js';
import isBigNumber from './isBigNumber';

/**
 * Convert string or BigNumber value to number.
 * @param {string|BigNumber} value - the value.
 * @return {number} the value converted to number.
 */
export function toNumber(value): number {
  if (isBigNumber(value)) {
    return value.toNumber();
  }
  return new BigNumber(value).toNumber();
}
