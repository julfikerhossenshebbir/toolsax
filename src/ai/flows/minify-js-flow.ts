'use server';
/**
 * @fileOverview A Genkit flow for minifying JavaScript content.
 * It uses an AI model to remove whitespace, comments, and shorten variable names.
 * The flow exports: minifyJs, MinifyJsInput, and MinifyJsOutput.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MinifyJsInputSchema = z.object({
  js: z.string().describe('The JavaScript content to minify.'),
});
export type MinifyJsInput = z.infer<typeof MinifyJsInputSchema>;

const MinifyJsOutputSchema = z.object({
  minifiedJs: z.string().describe('The minified JavaScript content.'),
});
export type MinifyJsOutput = z.infer<typeof MinifyJsOutputSchema>;

export async function minifyJs(input: MinifyJsInput): Promise<MinifyJsOutput> {
  return minifyJsFlow(input);
}

const minifyJsPrompt = ai.definePrompt({
  name: 'minifyJsPrompt',
  input: { schema: MinifyJsInputSchema },
  output: { schema: MinifyJsOutputSchema },
  prompt: `You are an expert JavaScript minifier. Your task is to take the provided JavaScript code and make it as small as possible without breaking its functionality.

  Perform the following actions:
  - Remove all comments (// and /* ... */).
  - Remove all newlines, tabs, and unnecessary whitespace.
  - Remove trailing commas and optional semicolons.
  - Shorten variable names where it is safe to do so (e.g., within function scopes). Do not shorten global variables or object properties that might be accessed from outside.
  - Be very careful not to change the logic of the code.
  - Output only the minified JavaScript code.

  Original JavaScript:
  \`\`\`javascript
  {{{js}}}
  \`\`\`
  
  Return the result as a JSON object with a "minifiedJs" key.`,
});

const minifyJsFlow = ai.defineFlow(
  {
    name: 'minifyJsFlow',
    inputSchema: MinifyJsInputSchema,
    outputSchema: MinifyJsOutputSchema,
  },
  async (input) => {
    const { output } = await minifyJsPrompt(input);
    return output!;
  }
);
