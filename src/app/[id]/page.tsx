
export const runtime = 'edge';
import { notFound } from 'next/navigation';
import type { Tool } from '@/lib/types';
import { getTools, initializeApp, getApps, firebaseConfig } from '@/lib/firebase';
import ToolPageClient from '@/components/ToolPageClient';
import type { Metadata, ResolvingMetadata } from 'next';
import { get, ref, getDatabase } from 'firebase/database';


async function getAllToolsServerSide(): Promise<Tool[]> {
    try {
        if (!getApps().length) {
            initializeApp(firebaseConfig);
        }
        const db = getDatabase();
        const toolsRef = ref(db, 'tools');
        const snapshot = await get(toolsRef);
        if (snapshot.exists()) {
            const toolsData = snapshot.val();
            return Object.keys(toolsData).map(key => ({
                id: key,
                ...toolsData[key]
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching tools server-side:", error);
        return [];
    }
}


// Fetch tool data on the server
async function getTool(id: string): Promise<{ tool: Tool | undefined, allTools: Tool[], index: number }> {
  const allTools = await getAllToolsServerSide();
  const toolIndex = allTools.findIndex((tool) => tool.id === id);
  const tool = toolIndex !== -1 ? allTools[toolIndex] : undefined;

  // If the tool is not found or disabled, treat as not found
  if (!tool || !tool.isEnabled) {
    return { tool: undefined, allTools: [], index: -1 };
  }

  return { tool, allTools, index: toolIndex };
}

// Generate metadata for the page
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

// This is now a Server Component
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
