import {makeAutoObservable} from 'mobx';

class HomeStore {
  private _currentPage = 0;
  private _query = '';

  constructor() {
    makeAutoObservable(this);
  }

  resetQuery() {
    this.query = '';
  }

  get query() {
    return this._query;
  }

  set query(query: string) {
    this._query = query;
  }

  get currentPage() {
    return this._currentPage;
  }

  set currentPage(page: number) {
    this._currentPage = page;
  }
}

export const homeStore = new HomeStore();
