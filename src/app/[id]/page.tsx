
'use client';

import { notFound } from 'next/navigation';
import { Tool } from '@/lib/types';
import Icon from '@/components/Icon';
import RelatedTools from '@/components/RelatedTools';
import { Badge } from '@/components/ui/badge';
import { getColorByIndex } from '@/lib/utils';
import ToolActions from '@/components/ToolActions';
import ToolRenderer from '@/components/tools/ToolRenderer';
import { ALL_TOOLS } from '@/lib/tools';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import AppHeader from '@/components/AppHeader';
import { useAppState } from '@/contexts/AppStateContext';


type Props = {
  params: { id: string };
};

// This can't be async anymore as it's a client component
function getTool(id: string): { tool: Tool | undefined, index: number } {
  const tools = ALL_TOOLS;
  const toolIndex = tools.findIndex((tool) => tool.id === id);
  if (toolIndex === -1) {
    return { tool: undefined, index: -1 };
  }
  return { tool: tools[toolIndex], index: toolIndex };
}


export default function ToolPage({ params }: Props) {
  const { id } = params;
  const { setSearchQuery } = useAppState();
  const [tool, setTool] = useState<Tool | undefined>(undefined);
  const [index, setIndex] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { tool: foundTool, index: foundIndex } = getTool(id);
    if (!foundTool) {
      notFound();
    } else {
      setTool(foundTool);
      setIndex(foundIndex);
      document.title = `${foundTool.name} | Toolsax`;
    }
    setLoading(false);
  }, [id]);
  
  if (loading) {
    return (
        <>
            <AppHeader onSearchChange={setSearchQuery} />
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                     <div className="text-center mb-8">
                        <Skeleton className="w-16 h-16 rounded-2xl mx-auto mb-4" />
                        <Skeleton className="h-8 w-48 mx-auto" />
                        <Skeleton className="h-6 w-24 mx-auto mt-3" />
                     </div>
                     <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </>
    )
  }

  if (!tool) {
    // This will be handled by the notFound() in useEffect, but as a fallback
    return null;
  }

  const iconColor = getColorByIndex(index);

  const relatedTools = ALL_TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 6);
  const originalIndexMap = new Map<string, number>();
  ALL_TOOLS.forEach((tool, index) => {
    originalIndexMap.set(tool.id, index);
  });

  return (
    <>
      <AppHeader onSearchChange={setSearchQuery} />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ 
                backgroundColor: iconColor.bg,
                color: iconColor.text
              }}
            >
              <Icon name={tool.icon} className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tighter">{tool.name}</h1>
            <Badge variant="secondary" className="mt-3 text-sm">{tool.category}</Badge>
          </div>

          <ToolRenderer tool={tool} />

          <div className="mt-12 flex justify-center items-center gap-3">
             <ToolActions tool={tool} />
          </div>

        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <RelatedTools 
          relatedTools={relatedTools} 
          currentTool={tool} 
          originalIndexMap={originalIndexMap} 
        />
      </div>
    </>
  );
}
