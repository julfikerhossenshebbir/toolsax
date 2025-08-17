
import HomePageClient from '@/components/HomePageClient';
import { Tool } from '@/lib/types';
import { ALL_TOOLS } from '@/lib/tools';

async function getTools(): Promise<Tool[]> {
  return ALL_TOOLS;
}

export default async function Home() {
  const tools = await getTools();
  return (
    <HomePageClient tools={tools} />
  );
}
