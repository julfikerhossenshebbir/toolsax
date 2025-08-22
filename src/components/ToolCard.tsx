
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Tool } from '@/lib/types';
import Icon from './Icon';
import { Card, CardContent } from './ui/card';
import { incrementClicks, getToolStats, isConfigured } from '@/lib/firebase';
import { MousePointerClick, Lock, Crown } from 'lucide-react';
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
        unsubscribeStats();
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
  
  const getLockIcon = () => {
    if(tool.isPremium) return <Crown className="w-3 h-3 text-yellow-500" />;
    if(tool.authRequired) return <Lock className="w-3 h-3 text-muted-foreground" />;
    return null;
  }

  return (
    <>
      <div
        onClick={handleCardClick}
        className="h-full cursor-pointer"
      >
        <Card
          className="h-full flex flex-col group transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1.5 bg-card hover:border-primary"
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div 
              className="w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center"
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
                {getLockIcon()}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
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
      </div>
    </>
  );
};

export default ToolCard;
