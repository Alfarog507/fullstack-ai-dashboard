const { z } = require('zod');

const aiResponseSchema = z.object({
  summary: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
});

module.exports = { aiResponseSchema };
