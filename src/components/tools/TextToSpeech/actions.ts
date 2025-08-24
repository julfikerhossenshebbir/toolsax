'use server';

import { textToSpeech } from "@/ai/flows/text-to-speech-flow";

export async function generateAudioAction(text: string): Promise<{ success: boolean; audio?: string; error?: string }> {
  try {
    const result = await textToSpeech({ text });
    return { success: true, audio: result.audio };
  } catch (error: any) {
    console.error("Error generating audio:", error);
    return { success: false, error: error.message || 'An unknown error occurred during audio generation.' };
  }
}
