import {WHISKY_INDEX} from '../constants';
import {database} from '../database';
import {WhiskyIndex} from '../model';
import {makeAutoObservable} from 'mobx';

class WhiskyIndexStore {
  index: WhiskyIndex = {};

  constructor() {
    makeAutoObservable(this);
  }

  async load() {
    const index = await database.getItem<WhiskyIndex>(WHISKY_INDEX);

    if (index) {
      this.index = index;
    }
  }
}

export const whiskyIndexStore = new WhiskyIndexStore();
