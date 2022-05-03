import i18next from 'i18next';
import { setLocale } from 'yup';
import resources from './locales/resources';

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

  const i18Instance = i18next.createInstance();
  i18Instance.init({
    lang: state.lang,
    debug: false,
    resources,
  }).then(() => {
    setLocale({
      mixed: {
        notOneOf: () => i18Instance.t('errors.rssExists'),
      },
      string: {
        url: () => i18Instance.t('errors.invalidUrl'),
      },
    });
  });
};
