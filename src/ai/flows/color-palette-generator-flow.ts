'use server';
/**
 * @fileOverview A Genkit flow for generating a color palette from a base color and a mood/style description.
 * The flow exports: generateColorPalette, GenerateColorPaletteInput, and GenerateColorPaletteOutput.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ColorSchema = z.object({
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid HEX color format").describe('The HEX code of the color.'),
  name: z.string().describe('A creative or descriptive name for the color.'),
});

const GenerateColorPaletteInputSchema = z.object({
  baseColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid HEX color format").describe('The base color in HEX format to generate the palette from.'),
  style: z.string().describe('The desired style or mood of the palette (e.g., "modern", "vintage", "playful", "corporate").'),
});
export type GenerateColorPaletteInput = z.infer<typeof GenerateColorPaletteInputSchema>;

const GenerateColorPaletteOutputSchema = z.object({
  palette: z.array(ColorSchema).length(5).describe('An array of 5 color objects that form a harmonious palette.'),
});
export type GenerateColorPaletteOutput = z.infer<typeof GenerateColorPaletteOutputSchema>;

export async function generateColorPalette(input: GenerateColorPaletteInput): Promise<GenerateColorPaletteOutput> {
  return generateColorPaletteFlow(input);
}

const generatePalettePrompt = ai.definePrompt({
  name: 'generateColorPalettePrompt',
  input: { schema: GenerateColorPaletteInputSchema },
  output: { schema: GenerateColorPaletteOutputSchema },
  prompt: `You are an expert color palette designer. Your task is to generate a beautiful and harmonious 5-color palette based on a single base color and a desired style.

  The base color is: {{{baseColor}}}
  The desired style is: "{{{style}}}"

  Instructions:
  1.  The first color in the output palette should be the provided base color.
  2.  Generate four additional colors that complement the base color and fit the specified style.
  3.  The palette should be aesthetically pleasing and practical for web design, branding, or digital art.
  4.  Provide a creative and descriptive name for each color in the palette.
  5.  Ensure all color codes are in valid 6-digit HEX format (e.g., #RRGGBB).

  Return the result as a JSON object with a "palette" key, which is an array of 5 color objects.`,
});

const generateColorPaletteFlow = ai.defineFlow(
  {
    name: 'generateColorPaletteFlow',
    inputSchema: GenerateColorPaletteInputSchema,
    outputSchema: GenerateColorPaletteOutputSchema,
  },
  async (input) => {
    const { output } = await generatePalettePrompt(input);
    return output!;
  }
);
