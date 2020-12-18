import Axios from 'axios';

export const axios = Axios.create({
  baseURL: 'http://www.whiskyfun.com/',
  headers: {
    'User-Agent': 'whiskycrawler/1.0.0',
  },
});
