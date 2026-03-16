const { z } = require('zod');

const analyzeCommentsSchema = z.object({
  comments: z.array(z.string()).min(1).max(20),
});

module.exports = { analyzeCommentsSchema };
