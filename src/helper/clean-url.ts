export const cleanURL = (input: string | null | undefined) =>
  (input || '').startsWith('/') ? (input || '').replace('/', '') : input + '';
