
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Home, MessageSquareWarning, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import DisqusComments from './DisqusComments';
import { Tool } from '@/lib/types';
import { ShareButtons } from './ShareButtons';


interface ToolActionsProps {
  tool: Tool;
}

export default function ToolActions({ tool }: ToolActionsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    // Check favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem('favorite_tools') || '[]');
    setIsFavorite(favorites.includes(tool.id));
  }, [tool.id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorite_tools') || '[]');
    const newIsFavorite = !isFavorite;

    if (newIsFavorite) {
      favorites.push(tool.id);
    } else {
      const index = favorites.indexOf(tool.id);
      if (index > -1) {
        favorites.splice(index, 1);
      }
    }

    localStorage.setItem('favorite_tools', JSON.stringify(favorites));
    setIsFavorite(newIsFavorite);
    
    // Dispatch a custom event to notify other components (like the header)
    window.dispatchEvent(new Event('favoritesChanged'));

    toast({
      title: newIsFavorite ? 'Added to favorites!' : 'Removed from favorites.',
    });
  };

  const toolUrl = isClient ? `${window.location.origin}/${tool.id}` : '';

  return (
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
          <Button variant="outline" size="icon" onClick={toggleFavorite}>
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFavorite ? 'Remove from favorites' : 'Add to Favorite'}</p>
        </TooltipContent>
      </Tooltip>
      
      <Dialog>
        <Tooltip>
            <TooltipTrigger asChild>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
                <p>Share Tool</p>
            </TooltipContent>
        </Tooltip>
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Share "{tool.name}"</DialogTitle>
            </DialogHeader>
            <div className="mt-4 flex justify-center">
                {isClient && <ShareButtons title={tool.name} url={toolUrl} />}
            </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <Tooltip>
            <TooltipTrigger asChild>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <MessageCircle className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
                <p>Comments</p>
            </TooltipContent>
        </Tooltip>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Comments on {tool.name}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
                <DisqusComments tool={tool} />
            </div>
        </DialogContent>
      </Dialog>
      
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
  );
}
