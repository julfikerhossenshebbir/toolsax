'use server';

import { textToSpeech } from '@/ai/flows/text-to-speech-flow';

export async function generateAudioAction(text: string, voice: string): Promise<{ success: boolean; audioDataUri?: string; error?: string }> {
  try {
    const result = await textToSpeech({ text, voice });
    return { success: true, audioDataUri: result.audioDataUri };
  } catch (error: any) {
    console.error("Error generating audio:", error);
    // Provide a more user-friendly error message
    if (error.message && error.message.includes('429')) {
      return { success: false, error: 'API rate limit exceeded. Please try again later.' };
    }
    return { success: false, error: error.message || 'An unknown error occurred while generating audio.' };
  }
}
