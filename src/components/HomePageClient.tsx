
'use client';

import { useMemo, useEffect } from 'react';
import type { Tool } from '@/lib/types';
import ToolCard from './ToolCard';
import Header from './Header';
import { incrementViews, saveSearchQuery } from '@/lib/firebase';
import { Wrench, Lock, Code, Palette, LayoutGrid } from 'lucide-react';
import FeaturesSection from './FeaturesSection';
import SectionDivider from './SectionDivider';
import { useAuth } from '@/contexts/AuthContext';
import FirebaseStats from './FirebaseStats';
import { useAppState } from '@/contexts/AppStateContext';

interface HomePageClientProps {
  tools: Tool[];
}

const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
    Utilities: Wrench,
    Security: Lock,
    Development: Code,
    Design: Palette,
};

export default function HomePageClient({ tools }: HomePageClientProps) {
  const { user } = useAuth();
  const { searchQuery } = useAppState();
  
  useEffect(() => {
    incrementViews();
  }, []);

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const query = event.currentTarget.value.trim();
      if (user && query.length > 2) {
        saveSearchQuery(user.uid, query);
      }
    }
  };


  const groupedTools = useMemo(() => {
    const groups: { [key: string]: Tool[] } = {};
    
    tools.forEach(tool => {
        if (!groups[tool.category]) {
            groups[tool.category] = [];
        }
        
        const matchesSearch =
            tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase());

        if (matchesSearch) {
            groups[tool.category].push(tool);
        }
    });

    return Object.entries(groups)
        .filter(([_, tools]) => tools.length > 0) // Hide category if no tools match search
        .sort(([catA], [catB]) => catA.localeCompare(catB)); // Sort categories alphabetically

  }, [tools, searchQuery]);

  // Create a map to get the original index of each filtered tool
  const originalIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    tools.forEach((tool, index) => {
      map.set(tool.id, index);
    });
    return map;
  }, [tools]);
  
  const totalFilteredTools = groupedTools.reduce((acc, [, tools]) => acc + tools.length, 0);

  return (
    <div className="container mx-auto px-4">
      <Header />

      {groupedTools.map(([category, tools]) => {
          const CategoryIcon = categoryIcons[category];
          return (
            <section key={category} className="my-12">
                <div className="flex items-center gap-3 mb-6">
                    {CategoryIcon && <CategoryIcon className="w-6 h-6 text-primary" />}
                    <h2 className="text-2xl font-bold tracking-tight">{category}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                    <ToolCard 
                        key={tool.id} 
                        tool={tool} 
                        index={originalIndexMap.get(tool.id) ?? 0}
                    />
                    ))}
                </div>
            </section>
          )
      })}
      
      {totalFilteredTools === 0 && (
        <div className="text-center py-16 col-span-full">
            <h2 className="text-2xl font-semibold">No tools found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your search query.</p>
        </div>
      )}

      <SectionDivider />
      <FeaturesSection />

      <SectionDivider />
      <FirebaseStats />

    </div>
  );
}
