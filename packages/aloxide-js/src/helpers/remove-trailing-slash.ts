export function removeTrailingSlash(input: any) {
  if (typeof input !== 'string') return '';

  return input.replace(/^[\\/]+|[\\/]+$/g, '');
}
