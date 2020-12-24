export const stripFormatting = (input: string) =>
  input
    .replaceAll('\n', '')
    .split(' ')
    .filter(e => e !== '')
    .join(' ');
