'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Tool } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ToolCard from './ToolCard';
import { SearchWithSuggestions } from './SearchWithSuggestions';
import Header from './Header';
import { incrementViews } from '@/lib/firebase';
import FirebaseStats from './FirebaseStats';

interface HomePageClientProps {
  tools: Tool[];
}

const categories = ['All', 'Design', 'Development', 'Productivity', 'Marketing', 'Utilities'];

export default function HomePageClient({ tools }: HomePageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    incrementViews();
  }, []);
  
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
        
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full flex justify-center">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 w-full max-w-2xl">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
