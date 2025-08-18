'use server';

import { minifyHtml } from "@/ai/flows/minify-html-flow";

export async function minifyHtmlAction(html: string): Promise<{ success: boolean; minifiedHtml?: string; error?: string }> {
  try {
    const result = await minifyHtml({ html });
    return { success: true, minifiedHtml: result.minifiedHtml };
  } catch (error: any) {
    console.error("Error minifying HTML:", error);
    return { success: false, error: error.message || 'An unknown error occurred during minification.' };
  }
}
