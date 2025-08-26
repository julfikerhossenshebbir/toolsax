
import { notFound } from 'next/navigation';
import type { Tool } from '@/lib/types';
import { get, ref, getDatabase } from 'firebase/database';
import { initializeApp, getApps } from 'firebase/app';
import ToolCard from '@/components/ToolCard';
import { firebaseConfig, getTools, initializeAppOnce } from '@/lib/firebase';

async function getAllToolsServerSide(): Promise<Tool[]> {
    initializeAppOnce();
    return getTools();
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
