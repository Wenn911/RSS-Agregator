import onChange from 'on-change';

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
      //handlepostview
    });
    ul.append(li);
  });
  postsContainer.append(ul);
};
