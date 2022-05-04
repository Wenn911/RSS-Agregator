import onChange from 'on-change';
import i18next from 'i18next';
import controller from './updateRSS.js';
import ru from './locales/ru.js';

import {
  formRender, postsRender, UIRender, renderFeeds,
} from './view.js';

const runApp = () => {
  const defaultLanguage = 'ru';
  const state = {
    lng: defaultLanguage,
    rssForm: {
      state: null,
      inputStatus: 'unblocked',
      errors: {},
    },
    feeds: [],
    posts: [],
  };

  const uiState = {};

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: state.lng,
    debug: false,
    resources: {
      ru,
    },
  });

  const selectors = {
    formElement: document.querySelector('.rss-form'),
    inputElement: document.querySelector('.form-control'),
    submitButton: document.querySelector('button[type="submit"]'),
    notificationElement: document.querySelector('.feedback'),
    feedContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
  };

  const watchedUIState = onChange(uiState, () => {
    UIRender(uiState);
  });

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'rssForm.state':
        formRender(state, selectors, i18nInstance);
        break;
      case 'feeds':
        renderFeeds(state, selectors, i18nInstance);
        break;
      case 'posts':
        postsRender(state, selectors, watchedUIState, i18nInstance);
        UIRender(uiState);
        break;
      default:
    }
  });

  controller(state, watchedState, selectors);
};

export default runApp;
