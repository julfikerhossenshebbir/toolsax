'use server';

import { textToSpeech } from "@/ai/flows/text-to-speech-flow";
import type { TextToSpeechInput } from "@/ai/flows/text-to-speech-flow";

export async function generateAudioAction(input: TextToSpeechInput): Promise<{ success: boolean; audio?: string; error?: string }> {
  try {
    const result = await textToSpeech(input);
    return { success: true, audio: result.audio };
  } catch (error: any) {
    console.error("Error generating audio:", error);
    return { success: false, error: error.message || 'An unknown error occurred during audio generation.' };
  }
}
