export interface QwantImageApiResponse {
  status: string;
  data: Data;
}

interface Data {
  query: Query;
  cache: Cache;
  result: Result;
}

interface Result {
  total: number;
  blacklisted: number;
  items: Item[];
  filters: Filters;
  domain: string;
  last: boolean;
  lastPage: boolean;
}

interface Filters {
  size: Size;
  license: Size;
  freshness: Size;
  color: Size;
  imagetype: Size;
  source: Size;
}

interface Size {
  label: string;
  name: string;
  type: string;
  selected: string;
  values: Value[];
}

interface Value {
  value: string;
  label: string;
  translate: boolean;
}

interface Item {
  title: string;
  type: string;
  media: string;
  desc: string;
  thumbnail: string;
  thumb_width: number;
  thumb_height: number;
  width: string;
  height: string;
  size: string;
  url: string;
  _id: string;
  b_id: string;
  media_fullsize: string;
  thumb_type: string;
  count: number;
  media_preview: string;
}

interface Cache {
  key: string;
  created: number;
  expiration: number;
  status: string;
  age: number;
}

interface Query {
  locale: string;
  query: string;
  offset: number;
}
