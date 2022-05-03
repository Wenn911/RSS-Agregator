import _ from 'lodash';
// eslint-disable-next-line import/extensions
import purifyHTML from './purifyHTML.js';

export default (link, content) => {
  const parser = new DOMParser();
  const rss = parser.parseFromString(content, 'text/html');
  const feedId = _.uniqueId();

  const result = {
    feed: null,
    posts: [],
  };

  const title = rss.querySelector('title').textContent;
  const desc = rss.querySelector('description').textContent;

  rss.querySelectorAll('item')
    .forEach((post) => {
      const postTitle = post.querySelector('title').textContent;
      const postDesc = post.querySelector('description').textContent;
      const postLink = post.querySelector('link').textContent;

      const postId = _.uniqueId();

      const data = {
        id: postId, feedId, title: postTitle, desc: purifyHTML(postDesc), url: postLink,
      };

      result.posts.push(data);
    });
  result.feed = {
    id: feedId, title, desc, url: link,
  };
  return result;
};
