const COMMENTS_URL = 'https://jsonplaceholder.typicode.com/comments';

async function fetchComments() {
  const response = await fetch(COMMENTS_URL);
  if (!response.ok) {
    throw new Error(`External API responded with status ${response.status}`);
  }
  return response.json();
}

module.exports = { fetchComments };
