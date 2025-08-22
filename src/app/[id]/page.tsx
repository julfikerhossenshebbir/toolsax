
import { notFound } from 'next/navigation';
import type { Tool } from '@/lib/types';
import { getTools } from '@/lib/firebase'; // Assuming this can be used server-side
import ToolPageClient from '@/components/ToolPageClient';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}


// This is a temporary solution for fetching tools on the server.
// In a real app, you might want a dedicated server-side fetcher for Firebase.
async function getAllToolsServerSide(): Promise<Tool[]> {
    return new Promise((resolve) => {
        // Since getTools uses onValue, we need to adapt it for a one-time fetch.
        // This is a simplified approach. A proper implementation would use get() from Firebase RTDB.
        let resolved = false;
        
        // This is a hack. In a real app, use the Firebase Admin SDK or a proper one-time get() call.
        const mockCallback = (loadedTools: Tool[]) => {
            if (!resolved) {
                resolve(loadedTools);
                resolved = true;
                // @ts-ignore
                if (unsubscribe) unsubscribe();
            }
        };
        // This will hang if Firebase connection doesn't resolve quickly.
        const unsubscribe = getTools(mockCallback);
        
        // Timeout to prevent hanging during build
        setTimeout(() => {
            if (!resolved) {
                console.warn("Tool fetch timed out. Build might be incomplete.");
                resolve([]);
                resolved = true;
                // @ts-ignore
                if (unsubscribe) unsubscribe();
            }
            
        }, 5000);
    });
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
  { params }: Props,
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
