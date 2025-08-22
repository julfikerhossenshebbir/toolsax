
'use client';

import { useMemo, useEffect } from 'react';
import type { Tool } from '@/lib/types';
import ToolCard from './ToolCard';
import Header from './Header';
import { incrementViews } from '@/lib/firebase';
import FeaturesSection from './FeaturesSection';
import SectionDivider from './SectionDivider';
import FirebaseStats from './FirebaseStats';
import { useAppState } from '@/contexts/AppStateContext';

interface HomePageClientProps {
  tools: Tool[];
}

export default function HomePageClient({ tools }: HomePageClientProps) {
  const { searchQuery, selectedCategory } = useAppState();
  
  useEffect(() => {
    incrementViews();
  }, []);

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
        if (!tool.name || !tool.description) {
            return false; // Skip tools with missing name or description
        }
        const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
        const matchesSearch =
            tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
  }, [tools, searchQuery, selectedCategory]);

  const originalIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    tools.forEach((tool, index) => {
      map.set(tool.id, index);
    });
    return map;
  }, [tools]);
  
  return (
    <div className="container mx-auto px-4">
      <Header />

      <SectionDivider />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <ToolCard 
              key={tool.id} 
              tool={tool} 
              index={originalIndexMap.get(tool.id) ?? 0}
          />
        ))}
      </div>
      
      {filteredTools.length === 0 && (
        <div className="text-center py-16 col-span-full">
            <h2 className="text-2xl font-semibold">No tools found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filter.</p>
        </div>
      )}

      <SectionDivider />
      <FeaturesSection />

      <SectionDivider />
      <FirebaseStats />

    </div>
  );
}
