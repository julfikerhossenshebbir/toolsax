'use client';

import Link from 'next/link';
import { Tool, ToolStat } from '@/lib/types';
import Icon from './Icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { incrementClicks } from '@/lib/firebase';
import { Eye, Users } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  stats?: ToolStat;
}

const ToolCard = ({ tool, stats }: ToolCardProps) => {
  return (
    <Link href={`/tool/${tool.id}`} passHref>
      <Card 
        onClick={incrementClicks}
        className="h-full flex flex-col group transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 bg-card/50"
      >
        <CardHeader className="flex-row gap-4 items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={tool.icon} className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">{tool.name}</CardTitle>
              <Badge variant="secondary" className="mt-1">{tool.category}</Badge>
            </div>
          </div>
          {stats && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{stats.users || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{stats.views || 0}</span>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription>{tool.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ToolCard;
