'use server';

import { generateColorPalette, GenerateColorPaletteInput, GenerateColorPaletteOutput } from "@/ai/flows/color-palette-generator-flow";

export async function generateColorPaletteAction(input: GenerateColorPaletteInput): Promise<{ success: boolean; data?: GenerateColorPaletteOutput; error?: string }> {
  try {
    const result = await generateColorPalette(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error generating color palette:", error);
    return { success: false, error: error.message || 'An unknown error occurred during palette generation.' };
  }
}
