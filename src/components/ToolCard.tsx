'use client';

import Link from 'next/link';
import { Tool, ToolStat } from '@/lib/types';
import Icon from './Icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { incrementClicks } from '@/lib/firebase';
import { Users } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  stats?: ToolStat;
}

const ToolCard = ({ tool, stats }: ToolCardProps) => {
  return (
    <Link href={`/tool/${tool.id}`} passHref>
      <Card 
        onClick={incrementClicks}
        className="h-full flex flex-col group transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 bg-card"
      >
        <CardHeader className="flex-row gap-4 items-start">
            <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={tool.icon} className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-grow">
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">{tool.name}</CardTitle>
              <CardDescription className="mt-1">{tool.description}</CardDescription>
            </div>
        </CardHeader>
        <CardContent className="flex-grow flex items-end justify-end">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{stats?.users ?? 0}</span>
            </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ToolCard;
