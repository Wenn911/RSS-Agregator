const render = {
  urlInputSetBorder: (valid) => {
    const urlInput = document.querySelector('#url-input');
    if (valid) {
      urlInput.classList.remove('is-invalid');
    } else {
      urlInput.classList.add('is-invalid');
    }
  },

  urlInputClear: () => {
    const urlInput = document.querySelector('#url-input');
    urlInput.value = '';
    urlInput.focus();
  },

  urlInputReadonly: () => {
    const urlInput = document.querySelector('#url-input');
    urlInput.setAttribute('readonly', 'true');
  },

  urlInputEditable: () => {
    const urlInput = document.querySelector('#url-input');
    urlInput.removeAttribute('readonly');
  },

  formButtonDisable: () => {
    const formButton = document.querySelector('.rss-form button');
    formButton.setAttribute('disabled', 'disabled');
  },

  formButtonAble: () => {
    const formButton = document.querySelector('.rss-form button');
    formButton.removeAttribute('disabled');
  },

  setFormMessage: (text, valid) => {
    const formMessage = document.querySelector('.feedback');
    formMessage.textContent = text;
    if (valid) {
      formMessage.classList.remove('text-danger');
      formMessage.classList.add('text-success');
    } else {
      formMessage.classList.remove('text-success');
      formMessage.classList.add('text-danger');
    }
  },

  renderFeeds: (feeds) => {
    const feedsCard = document.querySelector('.feeds > .card');
    const feedsList = document.querySelector('.feeds ul');

    feedsCard.classList.remove('d-none');
    feedsList.innerHTML = '';

    feeds.forEach((feed) => {
      const li = document.createElement('li');
      const h3 = document.createElement('h3');
      const p = document.createElement('p');

      li.classList.add('list-group-item', 'border-0');
      h3.classList.add('h6', 'm-0');
      p.classList.add('m-0', 'small', 'text-black-50');

      h3.textContent = feed.title;
      p.textContent = feed.description;

      li.append(h3);
      li.append(p);
      feedsList.append(li);
    });
  },

  renderPosts(posts, visitedLinks, buttonText) {
    const postsCard = document.querySelector('.posts > .card');
    const postsList = document.querySelector('.posts ul');

    postsCard.classList.remove('d-none');
    postsList.innerHTML = '';

    posts.forEach(({ id, title, link }) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      const button = document.createElement('button');
      li.classList.add('list-group-item', 'border-0');
      const linkClass = visitedLinks.has(id) ? 'fw-normal' : 'fw-bold';

      a.classList.add(linkClass);
      a.target = '_blank';
      a.href = link;
      a.dataset.id = id;
      a.textContent = title;

      button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'float-end');
      button.textContent = buttonText;
      button.dataset.id = id;
      button.dataset.bsToggle = 'modal';
      button.dataset.bsTarget = '#modal';

      li.append(a);
      li.append(button);
      postsList.append(li);
    });
  },

  setLinkVisited(postId) {
    const link = document.querySelector(`.posts a[data-id="${postId}"]`);
    link.classList.add('fw-normal');
    link.classList.remove('fw-bold');
  },

  showUpdatingErrorAlert() {
    const updatingErrorAlert = document.querySelector('.updating-error-alert');
    updatingErrorAlert.classList.remove('d-none');
  },

  hideUpdatingErrorAlert() {
    const updatingErrorAlert = document.querySelector('.updating-error-alert');
    updatingErrorAlert.classList.add('d-none');
  },

  setModalWindow({ title, description, link }) {
    const modalWindowTitle = document.querySelector('#modal .modal-title');
    const modalWindowBody = document.querySelector('#modal .modal-body > p');
    const modalWindowLink = document.querySelector('#modal a.full-article');

    modalWindowTitle.textContent = title;
    modalWindowBody.textContent = description;
    modalWindowLink.href = link;
  },
};

export default render;
