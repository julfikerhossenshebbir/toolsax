'use server';

import { minifyCss } from "@/ai/flows/minify-css-flow";

function simpleCssMinifier(css: string): string {
    return css
        .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1') // remove comments
        .replace(/\s+/g, ' ')            // collapse whitespace
        .replace(/\s*([{};:,])\s*/g, '$1') // remove whitespace around selectors and rules
        .replace(/;}/g, '}');             // remove last semicolon
}


export async function minifyCssAction(css: string): Promise<{ success: boolean; minifiedCss?: string; error?: string }> {
  try {
    // Using a simple minifier to avoid AI model errors for now.
    const minified = simpleCssMinifier(css);
    return { success: true, minifiedCss: minified };
  } catch (error: any) {
    console.error("Error minifying CSS:", error);
    return { success: false, error: 'An unexpected error occurred during minification.' };
  }
}
