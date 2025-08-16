'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Tool } from '@/lib/types';
import Icon from './Icon';
import { Card, CardContent } from './ui/card';
import { incrementClicks, getToolStats, isConfigured } from '@/lib/firebase';
import { Eye, MousePointerClick } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  const [clicks, setClicks] = useState<number | null>(null);

  useEffect(() => {
    if (isConfigured) {
      const unsubscribe = getToolStats(tool.id, (stats) => {
        setClicks(stats.clicks);
      });
      return () => unsubscribe();
    } else {
        setClicks(0);
    }
  }, [tool.id]);

  return (
    <Link href={`/${tool.id}`} passHref>
      <Card 
        onClick={() => incrementClicks(tool.id)}
        className="h-full flex flex-col group transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1.5 bg-card hover:border-primary"
      >
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 flex-shrink-0 bg-secondary rounded-lg flex items-center justify-center">
            <Icon name={tool.icon} className="w-5 h-5 text-foreground" />
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold text-base">{tool.name}</h3>
            <p className="text-sm text-muted-foreground truncate max-w-[250px]">{tool.description}</p>
          </div>
          <div className="flex-shrink-0 flex items-center text-xs text-muted-foreground gap-1.5">
            {clicks === null ? (
              <Skeleton className="h-5 w-10" />
            ) : (
              <>
                <MousePointerClick className="w-3.5 h-3.5" />
                <span>{clicks.toLocaleString()}</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ToolCard;
