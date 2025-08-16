import HomePageClient from '@/components/HomePageClient';
import { Tool } from '@/lib/types';
import fs from 'fs';
import path from 'path';

async function getTools(): Promise<Tool[]> {
  const filePath = path.join(process.cwd(), 'src', 'data', 'tools.json');
  const jsonData = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

export default async function Home() {
  const tools = await getTools();
  return (
    <HomePageClient tools={tools} />
  );
}
