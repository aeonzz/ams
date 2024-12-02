import { createTogetherAI } from '@ai-sdk/togetherai';

export const togetherai = createTogetherAI({
  apiKey: process.env.TOGETHER_AI_API_KEY ?? '',
});