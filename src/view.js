/* eslint-disable no-param-reassign */
import axios from 'axios';
import validator from './validation.js';
import parser from './parseRSS.js';

const makeRequest = (url) => {
  const uri = encodeURIComponent(url);
  const proxy = `https://allorigins.hexlet.app/get?disableCache=true&url=${uri}`;

  return axios.get(proxy)
    .then(({ data }) => data.contents)
    .catch(() => { throw Error('errors.request'); });
};

const updateState = (state, url, parsedData) => {
  const { receivedFeed, receivedPosts } = parsedData;
  state.feeds = [...state.feeds, receivedFeed];
  state.posts = [...state.posts, ...receivedPosts];
  state.urls = [...state.urls, url];
  state.error = false;
  return url;
};

const getIds = (posts) => posts.map(({ id }) => id);
const extractUpdatedPosts = (state, { receivedPosts }) => {
  const oldPosts = state.posts;
  const [receivedIds, oldIds] = [receivedPosts, oldPosts].map(getIds);
  const newIds = receivedIds.filter(
    (receivedId) => !oldIds.includes(receivedId),
  );
  if (newIds.length) {
    const newPosts = receivedPosts.filter(({ id }) => newIds.includes(id));
    state.posts = [...state.posts, ...newPosts];
  }
};

// Делегируем оброботку события одному ul, а не каждому li элементам
const addUlListener = (state) => () => {
  const ul = document.getElementById('posts').querySelector('ul');
  ul.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;
    const btn = e.target;
    const selectedId = btn.getAttribute('data-id');
    state.openPost = selectedId;
    const selectedPost = state.posts.filter(({ id }) => id === selectedId);
    selectedPost[0].wasRead = true;
    const { title, description, url } = selectedPost[0]; // [0] Из-за proxy

    const modal = document.getElementById('modal');
    const [modalTitle, modalContent] = [
      modal.querySelector('.modal-title'),
      modal.querySelector('#modal-content'),
    ];
    const a = modal.querySelector('a');
    a.href = url;
    modalTitle.textContent = title;
    modalContent.textContent = description;
  });
};

const formBlocked = (state) => { state.readonly = true; };
const formUnlocked = (state, res) => {
  state.readonly = false;
  return res;
};

const observUpdate = (state, url) => Promise.resolve(url)
  .then(() => makeRequest(url))
  .then(parser)
  .then((parsedData) => extractUpdatedPosts(state, parsedData))
  .then(setTimeout(() => observUpdate(state, url), 5000));

const view = (state, elms, i18next) => {
  elms.form.addEventListener('submit', async (e) => {
    const url = elms.input.value;
    e.preventDefault();
    validator(state)
      .validate(url)
      .then(() => formBlocked(state))
      .then(() => makeRequest(url))
      .then((res) => formUnlocked(state, res))
      .then(parser)
      .then((parsedData) => updateState(state, url, parsedData))
      .then(addUlListener(state))
      .then(setTimeout(() => observUpdate(state, url), 5000))
      .catch((err) => {
        state.error = i18next.t(err.message);
      });
  });
};

export default view;
