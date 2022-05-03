import DOMpurify from 'dompurify';

export default (html) => DOMpurify.sanitize(html);
