'use client';

import Link from 'next/link';
import { Tool, ToolStat } from '@/lib/types';
import Icon from './Icon';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { incrementClicks } from '@/lib/firebase';
import { Users } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  stats?: ToolStat;
}

const ToolCard = ({ tool, stats }: ToolCardProps) => {
  return (
    <Link href={`/${tool.id}`} passHref>
      <Card 
        onClick={() => incrementClicks(tool.id)}
        className="h-full flex flex-col group transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1.5 bg-card hover:border-primary"
      >
        <CardHeader className="flex-row gap-4 items-start p-6">
            <div className="w-12 h-12 flex-shrink-0 bg-secondary rounded-lg flex items-center justify-center">
              <Icon name={tool.icon} className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex-grow">
              <CardTitle className="text-lg font-semibold">{tool.name}</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between p-6 pt-0">
            <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto">
                <Users className="w-4 h-4" />
                <span>{stats?.users ?? 0} users</span>
            </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ToolCard;
