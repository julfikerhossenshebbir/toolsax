
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Tool } from '@/lib/types';
import Icon from './Icon';
import { Card, CardContent } from './ui/card';
import { incrementClicks, getToolStats, isConfigured } from '@/lib/firebase';
import { Lock, Crown, MousePointerClick } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { getColorByIndex } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface ToolCardProps {
  tool: Tool;
  index: number;
}

const ToolCard = ({ tool, index }: ToolCardProps) => {
  const [clicks, setClicks] = useState<number | null>(null);
  const router = useRouter();
  const { user, userData } = useAuth();
  
  const iconColor = getColorByIndex(index);

  useEffect(() => {
    if (isConfigured) {
      const unsubscribeStats = getToolStats(tool.id, (stats) => {
        setClicks(stats.clicks);
      });
      
      return () => {
        if (typeof unsubscribeStats === 'function') {
          unsubscribeStats();
        }
      };
    } else {
      setClicks(0);
    }
  }, [tool.id]);
  
  const isVip = userData?.role === 'vip' || userData?.role === 'admin';

  const handleCardClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (tool.authRequired && !user) {
        router.push('/login');
        return;
    }
    
    if (tool.isPremium && !isVip) {
      router.push('/join-vip');
      return;
    }
      
    incrementClicks(tool.id);
    
    router.push(`/${tool.id}`);
  };

  return (
      <div
        onClick={handleCardClick}
        className="h-full cursor-pointer group"
      >
        <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1 bg-card group-hover:border-primary">
          <CardContent className="p-4 flex-grow flex flex-col">
            <div className="flex items-center gap-4 flex-grow">
                <div 
                  className="w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors duration-300"
                  style={{ 
                    backgroundColor: iconColor.bg,
                    color: iconColor.text
                  }}
                >
                  <Icon name={tool.icon} className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate flex items-center gap-2">
                    {tool.name}
                    {tool.isPremium && <Crown className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />}
                    {tool.authRequired && !tool.isPremium && <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground">
                  {clicks === null ? (
                    <Skeleton className="h-4 w-8" />
                  ) : (
                    <>
                      <MousePointerClick className="w-3 h-3" />
                      <span>{clicks.toLocaleString()}</span>
                    </>
                  )}
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default ToolCard;
