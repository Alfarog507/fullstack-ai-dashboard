const { fetchComments } = require('../clients/externalApi');

async function fetchGroupedPosts() {
  const comments = await fetchComments();

  const counts = comments.reduce((acc, comment) => {
    if (!acc[comment.name]) acc[comment.name] = { postCount: 0, bodies: [] };
    acc[comment.name].postCount += 1;
    acc[comment.name].bodies.push(comment.body);
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([name, { postCount, bodies }]) => ({ name, postCount, bodies }))
    .sort((a, b) => b.postCount - a.postCount);
}

module.exports = { fetchGroupedPosts };
