import DOMPurify from 'dompurify';

export default (html) => DOMPurify.sanitize(html);
