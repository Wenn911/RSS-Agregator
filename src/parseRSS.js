const parseItem = (item) => ({
  id: item.querySelector('guid').textContent,
  title: item.querySelector('title').textContent,
  description: item.querySelector('description').textContent,
  url: item.querySelector('link').textContent,
  wasRead: false,
});

export default (response) => {
  try {
    const parser = new DOMParser();
    const dom = parser.parseFromString(response, 'text/xml');

    const receivedFeed = {
      title: dom.querySelector('title').textContent,
      description: dom.querySelector('description').textContent,
    };
    const items = [...dom.querySelectorAll('item')];
    const receivedPosts = items.map(parseItem);

    return { receivedFeed, receivedPosts };
  } catch {
    throw Error('errors.parse');
  }
};
