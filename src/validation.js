import * as yup from 'yup';

export default (link, state) => {
  const feedsLinks = state.feeds.map(({ feedLink }) => feedLink);
  const schema = yup.string().url('invalidUrl').notOneOf(feedsLinks, 'allreadyExist').required('emptyField');
  return schema.validate(link, { abortEarly: false });
};
