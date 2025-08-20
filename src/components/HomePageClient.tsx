
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Tool } from '@/lib/types';
import ToolCard from './ToolCard';
import Header from './Header';
import { incrementViews, saveSearchQuery } from '@/lib/firebase';
import { Input } from './ui/input';
import { Wrench, Lock, Code, Palette, LayoutGrid } from 'lucide-react';
import { Button } from './ui/button';
import Icon from './Icon';
import FeaturesSection from './FeaturesSection';
import SectionDivider from './SectionDivider';
import { useAuth } from '@/contexts/AuthContext';
import FirebaseStats from './FirebaseStats';
import { useAppState } from '@/contexts/AppStateContext';

interface HomePageClientProps {
  tools: Tool[];
}

const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
    All: LayoutGrid,
    Utilities: Wrench,
    Security: Lock,
    Development: Code,
    Design: Palette,
};

export default function HomePageClient({ tools }: HomePageClientProps) {
  const { user } = useAuth();
  const { searchQuery } = useAppState();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
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

  // Create a map to get the original index of each filtered tool
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
      
      <section id="filters-section" className="my-12">
        <div className="w-full mx-auto flex flex-col items-center gap-y-6">
            <div id="category-pills-container" className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((category) => {
                const CategoryIcon = categoryIcons[category] || LayoutGrid;
                return (
                    <Button 
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-full"
                    >
                        <CategoryIcon className="w-4 h-4 mr-2" />
                        {category}
                    </Button>
                )
            })}
            </div>
        </div>
    </section>

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
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
        </div>
      )}

      <SectionDivider />
      <FeaturesSection />

      <SectionDivider />
      <FirebaseStats />

    </div>
  );
}

    