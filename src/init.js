import 'bootstrap';
import './style.css';
import axios from 'axios';
import * as yup from 'yup';
import _ from 'lodash';
import i18next from 'i18next';
import resources from './locales/resources.js';
import watch from './view.js';
import parseXMLTree from './parser.js';

export default () => {
  const state = {
    feeds: [],
    posts: [],
    view: {
      form: {
        valid: null,
        processing: false,
        message: '',
      },
      modalWindowPostId: null,
      showUpdatingErrorAlert: false,
      visitedLinks: new Set(),
    },
  };

  yup.setLocale({
    string: {
      url: 'urlFieldMessages.invalidUrl',
    },
    mixed: {
      required: 'urlFieldMessages.shouldNotBeEmpty',
      notOneOf: 'urlFieldMessages.resourceIsExists',
    },
  });
  axios.interceptors.response.use((res) => res, (err) => {
    const modifiedError = { isAxiosError: true, ...err };
    return Promise.reject(modifiedError);
  });

  i18next
    .init({ lng: 'ru', debug: false, resources })
    .then((translate) => {
      const watchedState = watch(state, translate);
      const form = document.querySelector('.rss-form');
      const modalWindow = document.querySelector('#modal');

      const getProxyUrl = (url) => {
        const protocol = 'https';
        const hostname = 'allorigins.hexlet.app';
        const path = '/get';
        const proxyURLData = new URL(path, `${protocol}://${hostname}`);
        proxyURLData.searchParams.set('disableCache', 'true');
        proxyURLData.searchParams.set('url', url);

        return proxyURLData.href;
      };

      const setEventsForLinks = () => {
        watchedState.posts.forEach(({ id }) => {
          const postLink = document.querySelector(`.posts a[data-id="${id}"]`);
          postLink.addEventListener('click', () => {
            watchedState.view.visitedLinks.add(id);
          });
        });
      };

      const updatePosts = () => {
        const promises = watchedState.feeds.map(({ link }) => axios.get(getProxyUrl(link)));
        const promise = Promise.all(promises);
        promise
          .then((responses) => {
            responses.forEach((response) => {
              const { data: { status: { url } } } = response;
              const [{ id }] = watchedState.feeds.filter((feed) => feed.link === url);
              const existPosts = watchedState.posts.filter(({ feedId }) => feedId === id);
              const responseContent = response.data.contents;
              const parsedContent = parseXMLTree(responseContent, url);
              const newPosts = _.differenceBy(parsedContent.posts, existPosts, 'link');
              const newPostsWithIds = newPosts.map((post) => ({
                id: _.uniqueId(),
                feedId: id,
                ...post,
              }));

              watchedState.posts = [...newPostsWithIds, ...watchedState.posts];
            });

            setEventsForLinks();
            watchedState.view.showUpdatingErrorAlert = false;
          })
          .catch(() => {
            watchedState.view.showUpdatingErrorAlert = true;
          })
          .finally(() => {
            setTimeout(updatePosts, 5000);
          });
      };

      const loadRss = (rssFeedURL) => {
        watchedState.view.form.processing = true;
        watchedState.view.form.valid = true;
        watchedState.view.form.message = 'urlFieldMessages.loading';
        const proxyURL = getProxyUrl(rssFeedURL);
        return axios.get(proxyURL);
      };

      form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const url = formData.get('url');
        const existLinks = watchedState.feeds.map((feed) => feed.link);
        const urlTempalte = yup.string().url().required().notOneOf(existLinks);

        urlTempalte.validate(url)
          .then((rssFeedURL) => loadRss(rssFeedURL))
          .then((response) => {
            const resourceContent = response.data.contents;
            const parsedData = parseXMLTree(resourceContent, url);
            const { feed, posts } = parsedData;
            const feedId = _.uniqueId();
            const feedWithId = { id: feedId, ...feed };
            const postsWithId = posts.map((post) => ({ id: _.uniqueId(), feedId, ...post }));

            watchedState.view.form.valid = true;
            watchedState.view.form.processing = false;
            watchedState.view.form.message = 'urlFieldMessages.success';
            watchedState.feeds.unshift(feedWithId);
            watchedState.posts = [...postsWithId, ...watchedState.posts];
            setEventsForLinks();
          })
          .catch((err) => {
            watchedState.view.form.valid = false;
            watchedState.view.form.processing = false;

            if (yup.ValidationError.isError(err)) {
              const [errorTextPath] = err.errors;
              watchedState.view.form.message = errorTextPath;
            }

            if (err.isAxiosError) {
              watchedState.view.form.message = 'urlFieldMessages.networkError';
            }

            if (err.isParserError) {
              watchedState.view.form.message = 'urlFieldMessages.invalidResource';
            }
          });
      });

      modalWindow.addEventListener('show.bs.modal', (event) => {
        const postId = event.relatedTarget.dataset.id;
        watchedState.view.modalWindowPostId = postId;
        watchedState.view.visitedLinks.add(postId);
      });

      setTimeout(updatePosts, 5000);
    });
};
