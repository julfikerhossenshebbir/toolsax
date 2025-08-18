'use server';
/**
 * @fileOverview A Genkit flow for minifying HTML content.
 * It uses an AI model to remove whitespace, comments, and redundant code.
 * The flow exports: minifyHtml, MinifyHtmlInput, and MinifyHtmlOutput.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const MinifyHtmlInputSchema = z.object({
  html: z.string().describe('The HTML content to minify.'),
});
export type MinifyHtmlInput = z.infer<typeof MinifyHtmlInputSchema>;

export const MinifyHtmlOutputSchema = z.object({
  minifiedHtml: z.string().describe('The minified HTML content.'),
});
export type MinifyHtmlOutput = z.infer<typeof MinifyHtmlOutputSchema>;

export async function minifyHtml(input: MinifyHtmlInput): Promise<MinifyHtmlOutput> {
  return minifyHtmlFlow(input);
}

const minifyHtmlPrompt = ai.definePrompt({
  name: 'minifyHtmlPrompt',
  input: { schema: MinifyHtmlInputSchema },
  output: { schema: MinifyHtmlOutputSchema },
  prompt: `You are an expert HTML minifier. Your task is to take the provided HTML code and make it as small as possible without breaking its structure or functionality.

  Perform the following actions:
  - Remove all comments.
  - Collapse all whitespace, including newlines, tabs, and extra spaces between tags.
  - Remove optional closing tags (like </p>, </li>, </html>, </body>, </head>).
  - Do not remove quotes from attributes.
  - Output only the minified HTML code.

  Original HTML:
  \`\`\`html
  {{{html}}}
  \`\`\`
  
  Return the result as a JSON object with a "minifiedHtml" key.`,
});

const minifyHtmlFlow = ai.defineFlow(
  {
    name: 'minifyHtmlFlow',
    inputSchema: MinifyHtmlInputSchema,
    outputSchema: MinifyHtmlOutputSchema,
  },
  async (input) => {
    const { output } = await minifyHtmlPrompt(input);
    return output!;
  }
);
