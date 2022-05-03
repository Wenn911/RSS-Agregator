import $ from 'jquery';
import 'bootstrap';

import validateLink from './validateLink.js';
import loadRSS from './loadRSS.js';
import updateRSS from './updateRSS.js';

export const handleAddFeed = (e, state, i18nInstance) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const link = formData.get('url').trim();

  const error = validateLink(link, state.feeds);
  state.form.error = error;

  if (!error) {
    state.form.state = 'pending';

    loadRSS(link)
      .then((rss) => {
        state.feeds.unshift(rss.feed);
        state.posts = [...rss.posts, ...state.posts];

        state.form.state = 'success';

        updateRSS(link, state);

        e.target.reset();
      })
      .catch((err) => {
        state.form.state = 'failed';
        if (err.isAxiosError) {
          state.form.error = i18nInstance.t('errors.netError');
        } else {
          state.form.error = i18nInstance.t('errors.invalidRSS');
        }
      });
  } else {
    state.form.state = 'failed';
  }
};

export const handleSelectLanguage = (e, state, i18nInstance) => {
  i18nInstance.changeLanguage(e.target.dataset.lang);
  state.lang = e.target.dataset.lang;

  const buttonGroup = e.target.closest('.btn-group');
  const active = buttonGroup.querySelector('.active');

  active.classList.remove('btn-light');
  active.classList.add('btn-outline-light');

  e.target.parentElement.classList.remove('btn-outline-light');
  e.target.parentElement.classList.add('btn-light');
};

export const handleViewPost = (post) => {
  document.body.classList.add('modal-open');

  document.querySelector('.modal-title').textContent = post.title;

  document.querySelector('.modal-body').innerHTML = post.desc;

  document.querySelector('.full-article').href = post.url;

  const modal = document.querySelector('#modal');

  $(modal).modal({ show: true });
};

export const handleCloseModal = () => {
  document.body.classList.remove('modal-open');

  const modal = document.querySelector('#modal');

  $(modal).modal({ show: false });
};
