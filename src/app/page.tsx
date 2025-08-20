
'use client';

import HomePageClient from '@/components/HomePageClient';
import { Tool } from '@/lib/types';
import { ALL_TOOLS } from '@/lib/tools';

function getTools(): Tool[] {
  return ALL_TOOLS;
}

export default function Home() {
  const tools = getTools();

  return (
    <HomePageClient tools={tools} />
  );
}
