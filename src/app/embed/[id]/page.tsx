
export const runtime = 'edge';

import { notFound } from 'next/navigation';
import type { Tool } from '@/lib/types';
import { get, ref, getDatabase } from 'firebase/database';
import { initializeApp, getApps } from 'firebase/app';
import ToolCard from '@/components/ToolCard';
import { firebaseConfig, getTools } from '@/lib/firebase';

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

async function getToolForEmbed(id: string): Promise<{ tool: Tool | undefined, index: number }> {
  const allTools = await getAllToolsServerSide();
  const toolIndex = allTools.findIndex((tool) => tool.id === id);
  const tool = toolIndex !== -1 ? allTools[toolIndex] : undefined;

  if (!tool || !tool.isEnabled) {
    return { tool: undefined, index: -1 };
  }

  return { tool, index: toolIndex };
}

export default async function EmbedPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { tool, index } = await getToolForEmbed(id);

  if (!tool) {
    notFound();
  }

  return (
    <div className="p-2">
        <ToolCard 
            tool={tool} 
            index={index}
        />
    </div>
  );
}
