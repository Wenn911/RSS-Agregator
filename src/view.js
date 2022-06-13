import onChange from 'on-change';
import render from './render.js';

const handleFormProcessing = (value) => {
  if (value) {
    render.urlInputReadonly();
    render.formButtonDisable();
  }

  if (!value) {
    render.urlInputEditable();
    render.formButtonAble();
  }
};

const handleUpdatingErrorAlert = (value) => {
  if (value) {
    render.showUpdatingErrorAlert();
  }

  if (!value) {
    render.hideUpdatingErrorAlert();
  }
};

const watch = (state, translate) => onChange(state, (path, value) => {
  switch (path) {
    case 'view.form.valid': {
      render.urlInputSetBorder(value);
      break;
    }

    case 'view.form.message': {
      const text = translate(value);
      const { view: { form: { valid } } } = state;
      render.setFormMessage(text, valid);
      break;
    }

    case 'view.form.processing': {
      handleFormProcessing(value);
      break;
    }

    case 'feeds': {
      render.renderFeeds(state.feeds);
      break;
    }

    case 'posts': {
      const buttonText = translate('buttons.review');
      render.renderPosts(state.posts, state.view.visitedLinks, buttonText);
      break;
    }

    case 'view.visitedLinks': {
      const postId = [...value][value.size - 1];
      render.setLinkVisited(postId);
      break;
    }

    case 'view.showUpdatingErrorAlert': {
      handleUpdatingErrorAlert(value);
      break;
    }

    case 'view.modalWindowPostId': {
      const [{ title, description, link }] = state.posts.filter((post) => post.id === value);
      render.setModalWindow({ title, description, link });
      break;
    }
    default: {
      break;
    }
  }
});

export default watch;
