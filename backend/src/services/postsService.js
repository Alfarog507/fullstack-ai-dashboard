const { fetchComments } = require('../clients/externalApi');

async function fetchGroupedPosts() {
  const comments = await fetchComments();

  const counts = comments.reduce((acc, comment) => {
    acc[comment.name] = (acc[comment.name] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([name, postCount]) => ({ name, postCount }))
    .sort((a, b) => b.postCount - a.postCount);
}

module.exports = { fetchGroupedPosts };
