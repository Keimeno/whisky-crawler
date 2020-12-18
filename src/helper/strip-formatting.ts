export const stripFormatting = (input: string | null | undefined) =>
  (input || '').replace(/\s+/g, ' ').trim();
