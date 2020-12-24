import {WHISKIES, WHISKY_INDEX} from '../constants';
import {database} from '../database';
import {StoredWhisky, Whisky} from '../model/whisky';
import Fuse from 'fuse.js';
import {makeAutoObservable, observable} from 'mobx';
import {WhiskyIndex} from '../model';

interface PageOptions {
  page: number;
  amount: number;
  query?: string;
}

class WhiskyStore {
  allWhiskies: Whisky[] = [];
  queriedWhiskies: Whisky[] = [];
  whiskies: Whisky[] = [];
  index: WhiskyIndex = {};
  indexLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  async loadIndexes() {
    const index = (await database.getItem<WhiskyIndex>(WHISKY_INDEX)) || {};
    for (const [key, value] of Object.entries(index)) {
      this.index[key] = value;
    }
    this.indexLoaded = true;
  }

  async loadAllWhiskies() {
    const allWhiskies = (await database.getItem<StoredWhisky>(WHISKIES)) || {};
    this.allWhiskies = Object.values(allWhiskies);
  }

  async loadWhiskiesByQuery(query: string) {
    const fuse = new Fuse(this.allWhiskies, {
      keys: ['name'],
    });

    const result = fuse.search(query);
    this.queriedWhiskies = result.map(whiskyResult => whiskyResult.item);
  }

  async loadWhiskies({amount, page, query}: PageOptions) {
    if (!this.allWhiskies.length) {
      await this.loadAllWhiskies();
    } else if (query) {
      await this.loadWhiskiesByQuery(query);
    }

    const offset = amount * page;

    const list = query ? 'queriedWhiskies' : 'allWhiskies';
    this.whiskies.length = 0;
    this.whiskies.push(...this[list].slice(offset, offset + amount));
  }
}

export const whiskyStore = new WhiskyStore();
