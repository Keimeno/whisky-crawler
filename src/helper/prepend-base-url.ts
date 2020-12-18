import {BASE_URL} from '../constants';

export const prependBaseURL = (input: string | null | undefined) =>
  new RegExp(BASE_URL).test(input || '') ? input : BASE_URL + input;
