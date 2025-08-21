
'use client';

import { useEffect } from 'react';
import type { Tool } from '@/lib/types';
import Icon from '@/components/Icon';
import RelatedTools from '@/components/RelatedTools';
import { Badge } from '@/components/ui/badge';
import { getColorByIndex } from '@/lib/utils';
import ToolActions from '@/components/ToolActions';
import ToolRenderer from '@/components/tools/ToolRenderer';

interface ToolPageClientProps {
    tool: Tool;
    index: number;
    relatedTools: Tool[];
    originalIndexMap: [string, number][];
}

export default function ToolPageClient({ tool, index, relatedTools, originalIndexMap: serializableIndexMap }: ToolPageClientProps) {
  
  useEffect(() => {
    // This can be used for client-side only effects if needed in the future
    document.title = `${tool.name} | Toolsax`;
  }, [tool.name]);
  
  const iconColor = getColorByIndex(index);

  // Reconstruct the Map on the client
  const originalIndexMap = new Map<string, number>(serializableIndexMap);

  return (
    <>
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
