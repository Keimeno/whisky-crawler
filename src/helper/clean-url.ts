import {FALSE_BASE_URL} from '../constants';

export const removeProtocolHost = (input: string | null | undefined) =>
  new RegExp(FALSE_BASE_URL).test(input || '')
    ? (input || '').replace(FALSE_BASE_URL, '')
    : input + '';

export const cleanURL = (input: string | null | undefined) => {
  input = removeProtocolHost(input);
  return (input || '').startsWith('/')
    ? (input || '').replace('/', '')
    : input + '';
};
