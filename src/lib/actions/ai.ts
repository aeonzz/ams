"use server";

import { togetherai } from "@/components/providers/ai-provider";
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

export async function generateTitle(input: { type: string; inputs: string[] }) {
  try {
    const { text } = await generateText({
      model: togetherai("google/gemma-2-9b-it"),
      system: `You are an expert at creating concise, informative titles for work requests. 
               Your task is to generate clear, action-oriented titles that quickly convey 
               the nature of the request. Always consider the job type, category, and specific 
               name of the task when crafting the title. Aim for brevity and clarity. And make it unique for every request. Dont add quotes. Just generate a title base on the given questions, dont ask further questions. And strictly keep it under 50 characters`,
      prompt: `Create a clear and concise title for a request based on these details:
               Notes: 
               ${input.type} request
               ${input.inputs}

               
               Guidelines:
               1. Keep it under 50 characters
               2. Include the job type, category, and name in the title
               3. Capture the main purpose of the request
               4. Use action-oriented language
               5. Be specific to the request's context
               6. Make it easy to understand at a glance
               7. Use title case
               
               Example: 
               If given:
               Notes: Fix leaking faucet in the main office bathroom
               Job Type: Maintenance
               Category: Building
               Name: Plumbing
               
               A good title might be:
               "Urgent Plumbing Maintenance: Office Bathroom Faucet Repair"
               
               Now, create a title for the request using the provided details above.`,
    });

    return { title: text.trim() };
  } catch (error) {
    console.error("Error generating title:", error);
    return { error: "Failed to generate title. Please try again." };
  }
}
