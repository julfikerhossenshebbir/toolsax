
import { notFound } from 'next/navigation';
import type { Tool } from '@/lib/types';
import { initializeAppOnce, getTools } from '@/lib/firebase';
import ToolPageClient from '@/components/ToolPageClient';
import type { Metadata, ResolvingMetadata } from 'next';

async function getAllToolsServerSide(): Promise<Tool[]> {
    initializeAppOnce();
    return getTools();
}

async function getTool(id: string): Promise<{ tool: Tool | undefined, allTools: Tool[], index: number }> {
  const allTools = await getAllToolsServerSide();
  const toolIndex = allTools.findIndex((tool) => tool.id === id);
  const tool = toolIndex !== -1 ? allTools[toolIndex] : undefined;

  if (!tool || !tool.isEnabled) {
    return { tool: undefined, allTools: [], index: -1 };
  }

  return { tool, allTools, index: toolIndex };
}

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
    const { tool } = await getTool(params.id);
    const previousImages = (await parent).openGraph?.images || []
    
    if (!tool) {
        return {
            title: 'Tool Not Found'
        }
    }
    return {
        title: tool.name,
        description: tool.description,
        openGraph: {
          title: `${tool.name} | Toolsax`,
          description: tool.description,
          images: [`https://placehold.co/1200x630.png?text=${encodeURIComponent(tool.name)}`, ...previousImages],
        },
    }
}

export default async function ToolPage({ params }: { params: { id: string }}) {
  const { id } = params;
  const { tool, allTools, index } = await getTool(id);

  if (!tool) {
    notFound();
  }
  
  const relatedTools = allTools.filter(t => t.category === tool.category && t.id !== tool.id && t.isEnabled).slice(0, 6);
  
  const originalIndexMap = new Map<string, number>();
  allTools.forEach((t, i) => {
    originalIndexMap.set(t.id, i);
  });
  
  const serializableIndexMap: [string, number][] = Array.from(originalIndexMap.entries());

  return (
    <ToolPageClient 
        tool={tool} 
        index={index}
        relatedTools={relatedTools}
        originalIndexMap={serializableIndexMap}
    />
  );
}
