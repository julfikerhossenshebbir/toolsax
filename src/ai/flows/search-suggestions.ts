'use server';
/**
 * @fileOverview A Genkit flow for generating smart search suggestions.
 * It uses the time of day, day of the week, and trending searches to provide context-aware suggestions.
 * The flow exports: generateSearchSuggestions, SearchSuggestionsInput, and SearchSuggestionsOutput.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SearchSuggestionsInputSchema = z.object({
  currentTime: z.string().describe('The current time of day (e.g., morning, afternoon, evening, night).'),
  currentDay: z.string().describe('The current day of the week (e.g., Monday, Tuesday, etc.).'),
  trendingSearches: z.string().describe('A comma-separated list of the current trending searches.'),
  searchQuery: z.string().optional().describe('The user input for search (if any).'),
});
export type SearchSuggestionsInput = z.infer<typeof SearchSuggestionsInputSchema>;

const SearchSuggestionsOutputSchema = z.object({
  suggestions: z.array(
    z.string().describe('A suggested search query.')
  ).describe('An array of search suggestions based on the current context.')
});
export type SearchSuggestionsOutput = z.infer<typeof SearchSuggestionsOutputSchema>;

export async function generateSearchSuggestions(input: SearchSuggestionsInput): Promise<SearchSuggestionsOutput> {
  return searchSuggestionsFlow(input);
}

const searchSuggestionsPrompt = ai.definePrompt({
  name: 'searchSuggestionsPrompt',
  input: {schema: SearchSuggestionsInputSchema},
  output: {schema: SearchSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to provide intelligent search suggestions to users.

  The suggestions should be tailored to the current context, including the time of day, day of the week, and trending searches.
  Consider user's existing search query to generate similar and smarter suggestions.

  Current Time: {{{currentTime}}}
  Current Day: {{{currentDay}}}
  Trending Searches: {{{trendingSearches}}}
  Existing search query: {{{searchQuery}}}

  Provide a diverse range of suggestions that can help the user discover the tools they need.
  Format the output as a JSON object with a "suggestions" key containing an array of strings.
  Example:
  {
    "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
  }`,
});

const searchSuggestionsFlow = ai.defineFlow(
  {
    name: 'searchSuggestionsFlow',
    inputSchema: SearchSuggestionsInputSchema,
    outputSchema: SearchSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await searchSuggestionsPrompt(input);
    return output!;
  }
);
