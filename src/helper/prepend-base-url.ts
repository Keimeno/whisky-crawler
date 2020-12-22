import {BASE_URL, FALSE_BASE_URL} from '../constants';

const prependBaseURL = (input: string) =>
  new RegExp(BASE_URL).test(input) ? input : BASE_URL + input;

const replaceURLwithBaseURL = (input: string) =>
  new RegExp(FALSE_BASE_URL).test(input)
    ? input.replace(FALSE_BASE_URL, BASE_URL)
    : input;

export const retrieveCorrectBaseURL = (input: string | null | undefined) =>
  prependBaseURL(replaceURLwithBaseURL(input || ''));
