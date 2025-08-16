'use server';

import { generateSearchSuggestions } from '@/ai/flows/search-suggestions';

export async function getAiSuggestions(searchQuery: string): Promise<string[]> {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const hour = now.getHours();
  let currentTime;

  if (hour >= 5 && hour < 12) {
    currentTime = 'morning';
  } else if (hour >= 12 && hour < 18) {
    currentTime = 'afternoon';
  } else if (hour >= 18 && hour < 22) {
    currentTime = 'evening';
  } else {
    currentTime = 'night';
  }
  
  const trendingSearches = 'image editor, video cutter, code formatter, productivity planner, social media scheduler';

  try {
    const result = await generateSearchSuggestions({
      currentTime,
      currentDay,
      trendingSearches,
      searchQuery: searchQuery || '',
    });
    return result.suggestions;
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    // Return a default set of suggestions on error
    return [
        "Best image optimizer",
        "Free video editor",
        "Productivity tools for teams",
        "AI marketing assistant"
    ];
  }
}
