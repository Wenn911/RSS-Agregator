import axios from 'axios';
import parseRSS from './parseRSS.js';

const routes = {
  allOrigins: (url) => {
    const result = new URL('get', `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);
    return result.toString();
  },
};

export default (link) => axios.get(routes.allOrigins(link))
  .then((response) => parseRSS(link, response.data.contents));
