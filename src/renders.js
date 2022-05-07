/* eslint-disable no-param-reassign */
const addElm = (elm) => document.createElement(elm);
const addCls = (elm, ...classes) => elm.classList.add(...classes);

const renderError = (error, { input, feedback }, i18next) => {
  if (error) {
    addCls(input, 'is-invalid');
    feedback.classList.replace('text-success', 'text-danger');
    feedback.textContent = error;
  } else {
    feedback.textContent = i18next.t('success');
    feedback.classList.replace('text-danger', 'text-success');
    input.classList.remove('is-invalid');
    input.value = '';
  }
  input.focus();
};

const initContainer = (node, i18next) => {
  if (node.hasChildNodes()) return node.querySelector('.card');
  const container = document.createElement('div');
  const ul = document.createElement('ul');
  const title = addElm('h2');

  addCls(container, 'card', 'border-0');
  addCls(ul, 'list-group', 'border-0', 'rounded-0');
  addCls(title, 'card-title', 'h4', 'px-3', 'py-3');

  title.textContent = i18next.t(`cards.${node.id}`);

  container.append(title, ul);
  node.appendChild(container);
  return container;
};

const renderFeeds = (feeds, { feedNode }, i18next) => {
  const container = initContainer(feedNode, i18next);
  const children = feeds.map((feed) => {
    const { title, description } = feed;
    const li = addElm('li');

    li.append(addElm('h3'), addElm('p'));
    const [h3, p] = li.childNodes;

    addCls(li, 'list-group-item', 'border-0');
    addCls(h3, 'h6', 'm-0');
    addCls(p, 'text-muted', 'small');

    h3.textContent = title;
    p.textContent = description;
    return li;
  });
  container.querySelector('ul').replaceChildren(...children);
};

const renderPosts = (posts, { postsNode }, i18next) => {
  const container = initContainer(postsNode, i18next);
  const children = posts.map((post) => {
    const { id, title } = post;
    const { wasRead, url } = post;
    const [a, button, li] = [addElm('a'), addElm('button'), addElm('li')];

    if (wasRead) {
      a.classList.replace('fw-bold', 'fw-normal');
      addCls(a, 'link-secondary');
    } else {
      addCls(a, 'fw-bold');
    }

    addCls(button, 'btn', 'btn-outline-primary', 'btn-sm');
    addCls(li, 'list-group-item', 'd-flex', 'border-0');
    addCls(li, 'justify-content-between', 'align-items-start');

    a.href = url;
    a.textContent = title;
    a.setAttribute('target', '_blank');

    button.textContent = i18next.t('cards.button');
    button.setAttribute('type', 'button');
    button.setAttribute('role', 'button');
    button.dataset.id = id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    li.append(a, button);
    return li;
  });
  container.querySelector('ul').replaceChildren(...children);
};

const renderFormLock = (readonly, { input, addBtn }) => {
  if (readonly) {
    input.setAttribute('readonly', '');
    addBtn.setAttribute('disabled', '');
  } else {
    input.removeAttribute('readonly');
    addBtn.removeAttribute('disabled');
  }
};

const renderPostWasRead = (id) => {
  const a = document.querySelector(`button[data-id="${id}"]`).previousElementSibling;
  a.classList.remove('fw-bold');
  addCls(a, 'fw-normal', 'link-secondary');
};

const render = (elems, i18next) => (path, val) => {
  if (path === 'readonly') renderFormLock(val, elems);
  if (path === 'feeds') renderFeeds(val, elems, i18next);
  if (path === 'posts') renderPosts(val, elems, i18next);
  if (path === 'error') renderError(val, elems, i18next);
  if (path === 'openPost') renderPostWasRead(val);
};

export default render;
