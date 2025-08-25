'use server';

import { minifyHtml } from "@/ai/flows/minify-html-flow";

function simpleHtmlMinifier(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '') // remove comments
    .replace(/>\s+</g, '><')         // remove space between tags
    .trim();
}

export async function minifyHtmlAction(html: string): Promise<{ success: boolean; minifiedHtml?: string; error?: string }> {
  try {
    // Using a simple minifier to avoid AI model errors for now.
    const minified = simpleHtmlMinifier(html);
    return { success: true, minifiedHtml: minified };
  } catch (error: any) {
    console.error("Error minifying HTML:", error);
    return { success: false, error: 'An unknown error occurred during minification.' };
  }
}
