export default (xmlString) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(xmlString, 'text/xml');

  if (!data.querySelector('parsererror')) {
    const feedTitle = data.querySelector('title').textContent;
    const feedDescription = data.querySelector('description').textContent;
    const items = data.querySelectorAll('item');
    const posts = Array.from(items).map((post) => {
      const title = post.querySelector('title').textContent;
      const description = post.querySelector('description').textContent;
      const postlink = post.querySelector('link').textContent;
      return {
        title,
        description,
        postlink,
      };
    });
    return { feedTitle, feedDescription, posts };
  }
  throw new Error('parsingError');
};
