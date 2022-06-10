import onChange from 'on-change';
import render from './render.js';

const watch = (state, translate) => onChange(state, (path, value) => {
  if (path === 'view.form.valid') {
    render.urlInputSetBorder(value);
  }

  if (path === 'view.form.message') {
    const text = translate(value);
    const { view: { form: { valid } } } = state;
    render.setFormMessage(text, valid);
  }

  if (path === 'view.form.processing' && value) {
    render.urlInputReadonly();
    render.formButtonDisable();
  }

  if (path === 'view.form.processing' && !value) {
    render.urlInputEditable();
    render.formButtonAble();

    if (state.view.form.valid) {
      render.urlInputClear();
    }
  }

  if (path === 'feeds') {
    render.renderFeeds(state.feeds);
  }

  if (path === 'posts') {
    const buttonText = translate('buttons.review');
    render.renderPosts(state.posts, state.view.visitedLinks, buttonText);
  }

  if (path === 'view.visitedLinks') {
    const postId = [...value][value.size - 1];
    render.setLinkVisited(postId);
  }

  if (path === 'view.showUpdatingErrorAlert' && value) {
    render.showUpdatingErrorAlert();
  }

  if (path === 'view.showUpdatingErrorAlert' && !value) {
    render.hideUpdatingErrorAlert();
  }

  if (path === 'view.modalWindowPostId') {
    const [{ title, description, link }] = state.posts.filter((post) => post.id === value);
    render.setModalWindow({ title, description, link });
  }
});

export default watch;
