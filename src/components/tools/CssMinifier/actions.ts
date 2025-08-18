'use server';

import { minifyCss } from "@/ai/flows/minify-css-flow";

export async function minifyCssAction(css: string): Promise<{ success: boolean; minifiedCss?: string; error?: string }> {
  try {
    const result = await minifyCss({ css });
    return { success: true, minifiedCss: result.minifiedCss };
  } catch (error: any) {
    console.error("Error minifying CSS:", error);
    return { success: false, error: error.message || 'An unknown error occurred during minification.' };
  }
}
