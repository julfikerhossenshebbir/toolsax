import { notFound } from 'next/navigation';
import { Tool } from '@/lib/types';
import { ALL_TOOLS } from '@/lib/tools';
import ToolPageClient from '@/components/ToolPageClient';

type Props = {
  params: { id: string };
};

// Fetch tool data on the server
async function getTool(id: string): Promise<{ tool: Tool | undefined, index: number }> {
  const tools = ALL_TOOLS;
  const toolIndex = tools.findIndex((tool) => tool.id === id);
  if (toolIndex === -1) {
    return { tool: undefined, index: -1 };
  }
  return { tool: tools[toolIndex], index: toolIndex };
}

// Generate metadata for the page
export async function generateMetadata({ params }: Props) {
    const { tool } = await getTool(params.id);
    if (!tool) {
        return {
            title: 'Tool Not Found'
        }
    }
    return {
        title: `${tool.name} | Toolsax`,
        description: tool.description,
    }
}

// This is now a Server Component
export default async function ToolPage({ params }: Props) {
  const { id } = params;
  const { tool, index } = await getTool(id);

  if (!tool) {
    notFound();
  }
  
  const relatedTools = ALL_TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 6);
  const originalIndexMap = new Map<string, number>();
  ALL_TOOLS.forEach((tool, index) => {
    originalIndexMap.set(tool.id, index);
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
