'use server';
/**
 * @fileOverview A Genkit flow for minifying CSS content.
 * It uses an AI model to remove whitespace, comments, and redundant code.
 * The flow exports: minifyCss, MinifyCssInput, and MinifyCssOutput.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MinifyCssInputSchema = z.object({
  css: z.string().describe('The CSS content to minify.'),
});
export type MinifyCssInput = z.infer<typeof MinifyCssInputSchema>;

const MinifyCssOutputSchema = z.object({
  minifiedCss: z.string().describe('The minified CSS content.'),
});
export type MinifyCssOutput = z.infer<typeof MinifyCssOutputSchema>;

export async function minifyCss(input: MinifyCssInput): Promise<MinifyCssOutput> {
  return minifyCssFlow(input);
}

const minifyCssPrompt = ai.definePrompt({
  name: 'minifyCssPrompt',
  input: { schema: MinifyCssInputSchema },
  output: { schema: MinifyCssOutputSchema },
  prompt: `You are an expert CSS minifier. Your task is to take the provided CSS code and make it as small as possible without breaking its functionality.

  Perform the following actions:
  - Remove all comments (/* ... */).
  - Remove all newlines, tabs, and unnecessary whitespace.
  - Remove the last semicolon in a declaration block.
  - Remove leading zeros from values (e.g., 0.5em to .5em).
  - Compact color values where possible (e.g., #FFFFFF to #FFF).
  - Do not remove quotes from font names or content strings.
  - Output only the minified CSS code.

  Original CSS:
  \`\`\`css
  {{{css}}}
  \`\`\`
  
  Return the result as a JSON object with a "minifiedCss" key.`,
});

const minifyCssFlow = ai.defineFlow(
  {
    name: 'minifyCssFlow',
    inputSchema: MinifyCssInputSchema,
    outputSchema: MinifyCssOutputSchema,
  },
  async (input) => {
    const { output } = await minifyCssPrompt(input);
    return output!;
  }
);
