
'use client';

import { useMemo, useEffect, useState } from 'react';
import type { Tool } from '@/lib/types';
import ToolCard from './ToolCard';
import Header from './Header';
import { incrementViews, saveSearchQuery } from '@/lib/firebase';
import FeaturesSection from './FeaturesSection';
import SectionDivider from './SectionDivider';
import { useAuth } from '@/contexts/AuthContext';
import FirebaseStats from './FirebaseStats';
import { useAppState } from '@/contexts/AppStateContext';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { LayoutGrid, Palette, Code, Wrench, Lock, FileText, ImageIcon, File as FileIcon, Share2, Search, Smile, Paintbrush, BoxSelect, Square, Scan, Code2, GitCompareArrows, Mic, Volume2, FileAudio, Github, MessageSquare } from 'lucide-react';


interface HomePageClientProps {
  tools: Tool[];
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  All: <LayoutGrid className="w-4 h-4 mr-2" />,
  Design: <Palette className="w-4 h-4 mr-2" />,
  Development: <Code className="w-4 h-4 mr-2" />,
  Utilities: <Wrench className="w-4 h-4 mr-2" />,
  Security: <Lock className="w-4 h-4 mr-2" />,
  Content: <FileText className="w-4 h-4 mr-2" />,
  Image: <ImageIcon className="w-4 h-4 mr-2" />,
  PDF: <FileIcon className="w-4 h-4 mr-2" />,
  "Social Media": <Share2 className="w-4 h-4 mr-2" />,
  SEO: <Search className="w-4 h-4 mr-2" />,
};


export default function HomePageClient({ tools }: HomePageClientProps) {
  const { user } = useAuth();
  const { searchQuery } = useAppState();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  useEffect(() => {
    incrementViews();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(tools.map(tool => tool.category));
    return ['All', ...Array.from(uniqueCategories).sort()];
  }, [tools]);

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
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

      <div id="filters-section" className="mb-8 w-full">
        <div className="flex justify-center">
            <div className="overflow-x-auto pb-4 -mb-4">
                <div className="inline-flex justify-center gap-2 whitespace-nowrap px-4 sm:px-0">
                {categories.map(category => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(category)}
                        className="transition-all duration-200 shrink-0"
                    >
                        {categoryIcons[category]}
                        {category}
                    </Button>
                ))}
                </div>
            </div>
        </div>
      </div>

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
