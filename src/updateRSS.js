/* eslint-disable no-param-reassign */
import _ from 'lodash';

import loadRSS from './loadRSS';

const links = [];

const updateRSS = (state) => {
  const promises = links.map(loadRSS);
  Promise.all(promises)
    .then((results) => {
      const posts = results.flatMap((result) => result.posts);
      const allPosts = _.union(posts, state.posts);
      const newPosts = _.difference(allPosts, state.posts, 'url');

      if (newPosts.length > 0) {
        state.posts = [...newPosts, ...state.posts];
      }
    })
    .finally(() => {
      setTimeout(() => updateRSS(state), 5000);
    });
};

export default (link, state) => {
  links.push(link);
  if (state.updateProcess.state === 'idle') {
    state.updateProcess.state = 'running';
    setTimeout(() => updateRSS(state), 5000);
  }
};
