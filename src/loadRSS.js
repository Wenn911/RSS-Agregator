import axios from 'axios';

export default (rss) => {
  const parsedURL = new URL('https://allorigins.hexlet.app/get');
  parsedURL.searchParams.set('disableCache', 'true');
  parsedURL.searchParams.set('url', rss);
  return axios.get(parsedURL.href)
    .then((response) => response.data.contents)
    .catch(() => {
      throw new Error('netWorkError');
    });
};
