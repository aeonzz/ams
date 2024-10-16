'use server'

import { cohere } from '@ai-sdk/cohere';
import { generateText } from 'ai'

export async function generateDescription(prompt: string) {
  try {
    const { text } = await generateText({
      model: cohere("command-r-plus"),
      prompt: prompt,
    });
    return { success: true, text };
  } catch (error) {
    console.error('Error generating description:', error);
    return { success: false, error: 'Failed to generate description' };
  }
}