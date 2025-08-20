
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tool } from '@/lib/types';
import Icon from './Icon';
import { Card, CardContent } from './ui/card';
import { incrementClicks, getToolStats, isConfigured, getAdSettings, getActiveAdvertisement, incrementAdViews, incrementAdClicks } from '@/lib/firebase';
import { MousePointerClick, Lock } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { AdModal } from './AdModal';
import { getColorByIndex } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import LoginDialog from './LoginDialog';
import type { AdSettings, Advertisement } from '@/app/admin/types';

const AD_STORAGE_KEY_COUNT = 'toolsax_ad_views';
const AD_STORAGE_KEY_TIMESTAMP = 'toolsax_last_ad_timestamp';

interface ToolCardProps {
  tool: Tool;
  index: number;
}

const ToolCard = ({ tool, index }: ToolCardProps) => {
  const [clicks, setClicks] = useState<number | null>(null);
  const [showAd, setShowAd] = useState(false);
  const [adSettings, setAdSettings] = useState<AdSettings | null>(null);
  const [activeAd, setActiveAd] = useState<Advertisement | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const iconColor = getColorByIndex(index);

  useEffect(() => {
    if (isConfigured) {
      const unsubscribeStats = getToolStats(tool.id, (stats) => {
        setClicks(stats.clicks);
      });
      const unsubscribeAdSettings = getAdSettings(true, setAdSettings);
      
      return () => {
        unsubscribeStats();
        unsubscribeAdSettings();
      };
    } else {
      setClicks(0);
    }
  }, [tool.id]);

  const handleCardClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (tool.authRequired && !user) {
        setIsLoginOpen(true);
        return;
    }
      
    incrementClicks(tool.id);
    
    // Ad logic starts here
    if (!adSettings || !adSettings.adsEnabled || !adSettings.enabledTools.includes(tool.id)) {
        router.push(`/${tool.id}`);
        return;
    }

    const adViews = parseInt(localStorage.getItem(AD_STORAGE_KEY_COUNT) || '0', 10);
    const lastAdTimestamp = parseInt(localStorage.getItem(AD_STORAGE_KEY_TIMESTAMP) || '0', 10);
    
    const now = new Date().getTime();
    const cooldownInMillis = (adSettings.cooldownMinutes || 30) * 60 * 1000;

    const isCooldownOver = now - lastAdTimestamp > cooldownInMillis;
    
    if (isCooldownOver) {
        localStorage.setItem(AD_STORAGE_KEY_COUNT, '0');
    }
    
    const currentAdViews = isCooldownOver ? 0 : adViews;

    if (currentAdViews < (adSettings.viewLimit || 3)) {
      const adToShow = await getActiveAdvertisement();
      if (adToShow) {
        setActiveAd(adToShow);
        setShowAd(true);
        incrementAdViews(adToShow.id);
        return;
      }
    }
    
    // No ad to show, proceed to tool
    router.push(`/${tool.id}`);
  };

  const handleContinueToTool = (ad: Advertisement) => {
    const currentViews = parseInt(localStorage.getItem(AD_STORAGE_KEY_COUNT) || '0', 10);
    localStorage.setItem(AD_STORAGE_KEY_COUNT, (currentViews + 1).toString());
    localStorage.setItem(AD_STORAGE_KEY_TIMESTAMP, new Date().getTime().toString());
    
    if (ad.linkUrl) {
      incrementAdClicks(ad.id);
    }

    setShowAd(false);
    router.push(`/${tool.id}`);
  };

  return (
    <>
      <AdModal
        isOpen={showAd}
        onClose={() => setShowAd(false)}
        onContinue={handleContinueToTool}
        advertisement={activeAd}
      />
      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />

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
                {tool.authRequired && <Lock className="w-3 h-3 text-muted-foreground" />}
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
