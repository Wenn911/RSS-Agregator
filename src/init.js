import i18next from 'i18next';
import { setLocale } from 'yup';

import resources from './locales/resources.js';
import { handleAddFeed, handleSelectLanguage } from './handlers.js';
import initView from './view.js';

export default () => {
  const state = {
    lang: 'en',
    form: {
      state: 'filling',
      error: null,
    },
    updateProcess: {
      state: 'idle',
    },
    feeds: [],
    posts: [],
    uiState: {
      viewedPostsIds: [],
    },
  };

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: state.lang,
    resources,
  }).then(() => {
    setLocale({
      mixed: {
        notOneOf: () => i18nInstance.t('errors.rssExists'),
      },
      string: {
        url: () => i18nInstance.t('errors.invalidURL'),
      },
    });
  });

  const watchedState = initView(state, i18nInstance);

  const form = document.querySelector('.rss-form');

  const languageSelectors = document.querySelectorAll('[data-lang]');

  form.addEventListener('submit', (e) => {
    handleAddFeed(e, watchedState, i18nInstance);
  });

  languageSelectors.forEach((languageSelector) => {
    languageSelector.addEventListener('click', (e) => {
      handleSelectLanguage(e, watchedState, i18nInstance);
    });
  });
};
