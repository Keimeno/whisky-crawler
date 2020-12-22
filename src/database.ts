import {createInstance} from 'localforage';
import {DATABASE_NAME, DATABASE_VERSION} from './constants';

export const database = createInstance({
  storeName: DATABASE_NAME,
  version: DATABASE_VERSION,
});
