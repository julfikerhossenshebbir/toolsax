'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Tool } from '@/lib/types';
import ToolCard from './ToolCard';
import { SearchWithSuggestions } from './SearchWithSuggestions';
import Header from './Header';
import { incrementViews } from '@/lib/firebase';
import FirebaseStats from './FirebaseStats';

interface HomePageClientProps {
  tools: Tool[];
}

export default function HomePageClient({ tools }: HomePageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    incrementViews();
  }, []);
  
  const categories = useMemo(() => {
    const allCategories = tools.map(tool => tool.category);
    return ['All', ...[...new Set(allCategories)].sort()];
  }, [tools]);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [tools, selectedCategory, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      
      <div className="my-8 space-y-6">
        <SearchWithSuggestions value={searchQuery} onValueChange={setSearchQuery} />
        
        <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => (
              <button 
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${selectedCategory === category 
                    ? 'bg-foreground text-background' 
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
              >
                {category}
              </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-16 col-span-full">
            <h2 className="text-2xl font-semibold">No tools found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
        </div>
      )}

      <div className="mt-16">
        <FirebaseStats />
      </div>
    </div>
  );
}
