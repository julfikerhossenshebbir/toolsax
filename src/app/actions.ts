'use server';

import { generateSearchSuggestions } from '@/ai/flows/search-suggestions';

export async function getAiSuggestions(searchQuery: string): Promise<string[]> {
  // The AI feature is temporarily disabled to prevent runtime errors.
  // We can re-enable this later.
  console.log('AI suggestions are temporarily disabled. Returning default suggestions.');
  return [
    "Image Editor",
    "Video Cutter",
    "Code Formatter",
    "Productivity Planner",
    "Social Media Scheduler"
  ];
}
