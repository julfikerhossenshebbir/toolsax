
'use client';

import HomePageClient from '@/components/HomePageClient';
import { Tool } from '@/lib/types';
import { ALL_TOOLS } from '@/lib/tools';
import AppHeader from '@/components/AppHeader';
import { useAppState } from '@/contexts/AppStateContext';

function getTools(): Tool[] {
  return ALL_TOOLS;
}

export default function Home() {
  const tools = getTools();
  const { setSearchQuery } = useAppState();

  return (
    <>
      <AppHeader onSearchChange={setSearchQuery} />
      <HomePageClient tools={tools} />
    </>
  );
}
