'use server';

import { minifyJs } from "@/ai/flows/minify-js-flow";

function simpleJsMinifier(js: string): string {
    // This is a very basic minifier and won't handle complex cases.
    // It's a placeholder to avoid AI errors.
    return js
        .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1') // remove comments
        .replace(/\s+/g, ' ') // collapse whitespace
        .replace(/\s*([{};:,=()])\s*/g, '$1') // remove whitespace around operators
        .trim();
}

export async function minifyJsAction(js: string): Promise<{ success: boolean; minifiedJs?: string; error?: string }> {
  try {
    // Using a simple minifier to avoid AI model errors for now.
    const minified = simpleJsMinifier(js);
    return { success: true, minifiedJs: minified };
  } catch (error: any) {
    console.error("Error minifying JavaScript:", error);
    return { success: false, error: 'An unknown error occurred during minification.' };
  }
}
