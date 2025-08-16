'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tool } from '@/lib/types';
import Icon from './Icon';
import { Card, CardContent } from './ui/card';
import { incrementClicks, getToolStats, isConfigured } from '@/lib/firebase';
import { MousePointerClick } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { AdModal } from './AdModal';

interface ToolCardProps {
  tool: Tool;
}

const AD_VIEW_LIMIT = 3;
const AD_STORAGE_KEY = 'toolsax_ad_views';

const ToolCard = ({ tool }: ToolCardProps) => {
  const [clicks, setClicks] = useState<number | null>(null);
  const [showAd, setShowAd] = useState(false);
  const router = useRouter();

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

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    incrementClicks(tool.id);

    const adViews = parseInt(localStorage.getItem(AD_STORAGE_KEY) || '0', 10);

    if (adViews < AD_VIEW_LIMIT) {
      setShowAd(true);
    } else {
      router.push(`/${tool.id}`);
    }
  };

  const handleContinueToTool = () => {
    const currentViews = parseInt(localStorage.getItem(AD_STORAGE_KEY) || '0', 10);
    localStorage.setItem(AD_STORAGE_KEY, (currentViews + 1).toString());
    setShowAd(false);
    router.push(`/${tool.id}`);
  };

  return (
    <>
      <AdModal
        isOpen={showAd}
        onClose={() => setShowAd(false)}
        onContinue={handleContinueToTool}
      />
      <div
        onClick={handleCardClick}
        className="h-full cursor-pointer"
      >
        <Card
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
      </div>
    </>
  );
};

export default ToolCard;
