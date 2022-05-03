import onChange from 'on-change';
import { handleViewPost, handleCloseModal } from './handlers';

const buildPosts = (state, posts, i18Instance) => {
  const postsContainer = document.querySelector('.posts');
  postsContainer.innerHTML = `<h2>${i18Instance.t('posts')}</h2>`;

  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  posts.forEach((post) => {
    const isViewed = state.uiState.viewedPostsIds.includes(post.id);

    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
    li.dataset.id = post.id;

    li.innerHTML = `
    <a href="${post.url}" class="${isViewed ? 'font-weight-normal' : 'font-weight-bold'}" target="_blank" rel="noopener noreferrer">
     ${post.title}
    </a>
    <button type="button" class="btn btn-primary btn-sm">${i18Instance.t('buttons.view')}</button>
    `;
    const a = li.querySelector('a');
    const button = li.querySelector('button');
    a.addEventListener('click', () => {
      if (!isViewed) {
        state.uiState.viewedPostsIds.push(post.id);
      }
    });
    button.addEventListener('click', () => {
      if (!isViewed) {
        state.uiState.viewedPostsIds.push(post.id);
      }
      handleViewPost(post);
    });
    ul.append(li);
  });
  postsContainer.append(ul);
};

const buildFeeds = (feeds, i18Instance) => {
  const feedContainer = document.querySelector('.feeds');
  feedContainer.innerHTML = `<h2>${i18Instance.t('feeds')}</h2>`;

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'mb-5');

  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.dataset.id = feed.id;

    li.innerHTML = `
    <h3>${feed.title}</h3>
    <p>${feed.desc}</h3>
    `;
    ul.append(li);
  });
  feedContainer.append(ul);
};

const render = (state, i18Instance) => {
  if (state.feeds.length > 0) {
    buildFeeds(state.feeds, i18Instance);
    buildPosts(state, state.posts, i18Instance);
  }

  const fullArticleButton = document.querySelector('.full-article');
  const closeButtons = document.querySelectorAll('[data-dismiss="modal"]');

  fullArticleButton.textContent = i18Instance.t('buttons.readArticle');
  closeButtons[1].textContent = i18Instance.t('buttons.close');

  closeButtons.forEach((closeButton) => {
    closeButton.addEventListener('click', handleCloseModal);
  });
};

const clearFeedback = () => {
  const input = document.querySelector('.form-control');
  const feedback = document.querySelector('.feedback');

  feedback.textContent = '';
  feedback.classList.remove('text-danger', 'text-success');
  input.classList.remove('is-invalid');
};

const toggleForm = (status) => {
  const submitButton = document.querySelector('[type="submit"]');
  const input = document.querySelector('.form-control');

  submitButton.disabled = status;
  input.readOnly = status;
};

export default (state, i18Instance) => {
  const input = document.querySelector('.form-control');
  const feedback = document.querySelector('.feedback');

  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.state') {
      switch (value) {
        case 'pending':
          toggleForm(true);
          clearFeedback();
          break;
        case 'success':
          toggleForm(false);
          clearFeedback();
          feedback.textContent = i18Instance.t('success');
          feedback.classList.add('text-success');
          break;
        case 'failed':
          toggleForm(false);
          clearFeedback();
          feedback.textContent = state.form.error;
          input.classList.add('is-invalid');
          feedback.classList.add('text-danger');
          break;
        default:
          throw new Error(`Unexpected state: ${value}`);
      }
    } else if (path === 'form.error') {
      feedback.textContent = '';
      if (value) {
        input.classList.add('is-invalid');
        feedback.classList.add('text-danger');
        feedback.textContent = state.form.error;
      } else {
        input.classList.remove('is-invalid');
        feedback.classList.remove('text-danger');
      }
    } else if (path === 'lang') {
      clearFeedback();
      render(watchedState, i18Instance);
    } else {
      render(watchedState, i18Instance);
    }
  });

  return watchedState;
};
