import uniqueId from 'lodash/uniqueId.js';
import getParse from './parseRSS.js';
import validate from './validation.js';
import loadRSS from './loadRSS.js';

const updateFeed = (link, state, watchedState) => {
  const watched = watchedState;
  return loadRSS(link)
    .then((data) => {
      const { feedTitle, feedDescription, posts } = getParse(data);
      const feedsLinks = state.feeds.map(({ feedLink }) => feedLink);
      if (!feedsLinks.includes(link)) {
        watched.feeds.unshift({
          feedId: uniqueId(), feedLink: link, feedTitle, feedDescription,
        });
      }
      const currentFeedId = (state.feeds.find((feed) => feed.feedLink === link)).feedId;
      const oldPosts = state.posts
        .filter(({ feedId }) => feedId === currentFeedId)
        .map(({ postlink }) => postlink);
      const newPosts = posts
        .filter(({ postlink }) => !oldPosts.includes(postlink))
        .map(({ title, description, postlink }) => ({
          feedId: currentFeedId, postId: uniqueId(), title, description, postlink,
        }));
      watched.posts.unshift(...newPosts);
      setTimeout(updateFeed, 5000, link, state, watchedState);
    });
};

export default (state, watchedState, selectors) => {
  const elements = selectors;
  const watched = watchedState;
  elements.inputElement.focus();

  elements.formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rss = formData.get('url');
    watched.rssForm.state = 'processing';
    validate(rss, state)
      .then(() => updateFeed(rss, state, watchedState))
      .then(() => {
        watched.rssForm.errors = null;
        watched.rssForm.state = 'successLoad';
      })
      .catch((error) => {
        watched.rssForm.errors = error.message;
        watched.rssForm.state = 'unsuccessfulLoad';
      });
  });
};
