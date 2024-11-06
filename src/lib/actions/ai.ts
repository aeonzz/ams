"use server";

import { cohere } from "@ai-sdk/cohere";
import { generateText } from "ai";

export async function generateResponseText(prompt: string) {
  try {
    const { text } = await generateText({
      model: cohere("command-r-plus"),
      prompt: prompt,
    });
    return { success: true, text };
  } catch (error) {
    console.error("Error generating response:", error);
    return { success: false, error: "Failed to generate response" };
  }
}
