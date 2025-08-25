'use client';

import HomePageClient from '@/components/HomePageClient';
import { useEffect, useState } from 'react';
import type { Tool } from '@/lib/types';
import { getTools } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import SectionDivider from '@/components/SectionDivider';

const ToolGridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 p-4 border rounded-lg h-24">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                    </div>
                </div>
                 <div className="flex justify-end">
                     <Skeleton className="h-5 w-10" />
                 </div>
            </div>
        ))}
    </div>
);


export default function Home() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = getTools((loadedTools) => {
            // Only show enabled tools to the public
            const enabledTools = loadedTools.filter(tool => tool.isEnabled);
            setTools(enabledTools);
            setIsLoading(false);
        });

        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        }
    }, []);

    if (isLoading) {
      return (
        <div className="container mx-auto px-4">
          <Header />
          <SectionDivider />
          <ToolGridSkeleton />
        </div>
      );
    }

    return (
        <HomePageClient tools={tools} />
    );
}
