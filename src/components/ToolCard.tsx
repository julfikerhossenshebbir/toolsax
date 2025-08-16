'use client';

import Link from 'next/link';
import { Tool, ToolStat } from '@/lib/types';
import Icon from './Icon';
import { Card, CardContent } from './ui/card';
import { incrementClicks } from '@/lib/firebase';
import { Users, Eye } from 'lucide-react';

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
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 flex-shrink-0 bg-secondary rounded-lg flex items-center justify-center">
            <Icon name={tool.icon} className="w-5 h-5 text-foreground" />
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold text-base">{tool.name}</h3>
            <p className="text-sm text-muted-foreground truncate max-w-[250px]">{tool.description}</p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-end text-xs text-muted-foreground gap-1.5">
            <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>{stats?.users ?? 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>{stats?.views ?? 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ToolCard;
