
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Home, MessageSquareWarning, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalHeader, ResponsiveModalTitle, ResponsiveModalTrigger } from '@/components/ResponsiveModal';
import { Tool } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { toggleFavoriteInDb, getUserFavorites } from '@/lib/firebase';
import CommentSystem from '@/components/comments/CommentSystem';
import { useRouter } from 'next/navigation';


interface ToolActionsProps {
  tool: Tool;
}

export default function ToolActions({ tool }: ToolActionsProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    if (user) {
        const unsubscribe = getUserFavorites(user.uid, (favorites) => {
            setIsFavorite(favorites?.includes(tool.id) || false);
        });
        return () => unsubscribe();
    } else {
        const favorites = JSON.parse(localStorage.getItem('favorite_tools') || '[]');
        setIsFavorite(favorites.includes(tool.id));
    }
  }, [tool.id, user]);

  const handleToggleFavorite = () => {
    if (!user) {
        router.push('/login');
        return;
    }
    
    toggleFavoriteInDb(user.uid, tool.id).then(newIsFavorite => {
        setIsFavorite(newIsFavorite);
        toast({
          title: newIsFavorite ? 'Added to favorites!' : 'Removed from favorites.',
        });
    });
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tool.name,
          text: tool.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        toast({
          variant: 'destructive',
          title: 'Could not share',
          description: 'An error occurred while trying to share.',
        });
      }
    } else {
        navigator.clipboard.writeText(window.location.href);
        toast({
            title: 'Link Copied!',
            description: 'Share functionality is not supported on this browser. The link has been copied to your clipboard.',
        });
    }
  };


  if (!isClient) {
    return null;
  }

  return (
    <>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/">
            <Button variant="outline" size="icon">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Back to Home</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={handleToggleFavorite}>
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFavorite ? 'Remove from favorites' : 'Add to Favorite'}</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleNativeShare}>
                <Share2 className="h-4 w-4" />
            </Button>
        </TooltipTrigger>
        <TooltipContent>
            <p>Share Tool</p>
        </TooltipContent>
      </Tooltip>

      <ResponsiveModal>
        <Tooltip>
            <TooltipTrigger asChild>
                <ResponsiveModalTrigger asChild>
                    <Button variant="outline" size="icon">
                        <MessageCircle className="h-4 w-4" />
                    </Button>
                </ResponsiveModalTrigger>
            </TooltipTrigger>
            <TooltipContent>
                <p>Comments</p>
            </TooltipContent>
        </Tooltip>
        <ResponsiveModalContent className="max-w-2xl p-0">
          <div className="p-6">
              <CommentSystem toolId={tool.id} toolName={tool.name} />
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/report-a-bug?tool=${tool.id}`}>
            <Button variant="destructive" size="icon">
              <MessageSquareWarning className="h-4 w-4" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Report a Bug</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    </>
  );
}
