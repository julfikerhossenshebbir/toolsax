'use server';

import { minifyJs } from "@/ai/flows/minify-js-flow";

export async function minifyJsAction(js: string): Promise<{ success: boolean; minifiedJs?: string; error?: string }> {
  try {
    const result = await minifyJs({ js });
    return { success: true, minifiedJs: result.minifiedJs };
  } catch (error: any) {
    console.error("Error minifying JavaScript:", error);
    return { success: false, error: error.message || 'An unknown error occurred during minification.' };
  }
}
