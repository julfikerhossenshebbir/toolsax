'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowLeft, MessageSquareWarning, Heart, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';


interface ToolActionsProps {
  toolId: string;
}

export default function ToolActions({ toolId }: ToolActionsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem('favorite_tools') || '[]');
    setIsFavorite(favorites.includes(toolId));
  }, [toolId]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorite_tools') || '[]');
    const newIsFavorite = !isFavorite;

    if (newIsFavorite) {
      favorites.push(toolId);
    } else {
      const index = favorites.indexOf(toolId);
      if (index > -1) {
        favorites.splice(index, 1);
      }
    }

    localStorage.setItem('favorite_tools', JSON.stringify(favorites));
    setIsFavorite(newIsFavorite);
    toast({
      title: newIsFavorite ? 'Added to favorites!' : 'Removed from favorites.',
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Back to All Tools</p>
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

      <Tooltip>
        <TooltipTrigger asChild>
           <Button variant="outline" size="icon" disabled>
            <MessageCircle className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Comments (coming soon)</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/report-a-bug?tool=${toolId}`}>
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
