'use server';

import { generateColorPalette, GenerateColorPaletteInput, GenerateColorPaletteOutput } from "@/ai/flows/color-palette-generator-flow";

export async function generateColorPaletteAction(input: GenerateColorPaletteInput): Promise<{ success: boolean; data?: GenerateColorPaletteOutput; error?: string }> {
  // AI feature is temporarily disabled to fix runtime errors.
  // Returning mock data instead.
  console.log("Color Palette AI feature is disabled. Returning mock data.");
  const mockPalette: GenerateColorPaletteOutput = {
    palette: [
      { hex: input.baseColor, name: 'Base Color' },
      { hex: '#f87171', name: 'Coral Red' },
      { hex: '#a78bfa', name: 'Light Purple' },
      { hex: '#34d399', name: 'Emerald Green' },
      { hex: '#fde047', name: 'Sunny Yellow' },
    ]
  };
  
  // Ensure the base color is always first
  const existingIndex = mockPalette.palette.findIndex(p => p.hex.toLowerCase() === input.baseColor.toLowerCase());
  if (existingIndex > 0) {
      const base = mockPalette.palette.splice(existingIndex, 1);
      mockPalette.palette.unshift(base[0]);
  } else if (existingIndex === -1) {
      mockPalette.palette[0] = { hex: input.baseColor, name: 'Base Color' };
  }


  return Promise.resolve({ success: true, data: mockPalette });
}
