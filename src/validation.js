import { string } from 'yup';

export default ({ urls }) => {
  const schema = string('errors.empty')
    .url('errors.url')
    .notOneOf(urls, 'errors.uniq');
  return schema;
};
