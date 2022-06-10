const parseXMLTree = (content, resourceLink) => {
  const parser = new DOMParser();
  const tree = parser.parseFromString(content, 'application/xml');
  const errorNode = tree.querySelector('parsererror');

  if (errorNode) {
    const error = new Error();
    error.isParserError = true;
    throw error;
  }

  const feed = {
    title: '',
    description: '',
    link: resourceLink,
  };
  const posts = [];

  try {
    const channel = tree.querySelector('channel');
    const channelItems = channel.querySelectorAll('item');

    feed.title = channel.querySelector('title').textContent;
    feed.description = channel.querySelector('description').textContent;

    channelItems.forEach((item) => {
      const title = item.querySelector('title').textContent;
      const link = item.querySelector('link').textContent;
      const description = item.querySelector('description').textContent;

      posts.push({
        title,
        link,
        description,
      });
    });

    return { feed, posts };
  } catch {
    const error = new Error();
    error.isParserError = true;
    throw error;
  }
};

export default parseXMLTree;
