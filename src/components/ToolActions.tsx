'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowLeft, MessageSquareWarning, Heart, ThumbsUp } from 'lucide-react';
import { incrementLikes } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';


interface ToolActionsProps {
  toolId: string;
  initialLikes: number;
}

export default function ToolActions({ toolId, initialLikes }: ToolActionsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const { toast } = useToast();

  useEffect(() => {
    // Check favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem('favorite_tools') || '[]');
    setIsFavorite(favorites.includes(toolId));

    // Check liked status from localStorage
    const likedTools = JSON.parse(localStorage.getItem('liked_tools') || '[]');
    setHasLiked(likedTools.includes(toolId));
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

  const handleLike = () => {
    if (hasLiked) return;

    incrementLikes(toolId);
    setLikes((prev) => prev + 1);
    setHasLiked(true);

    const likedTools = JSON.parse(localStorage.getItem('liked_tools') || '[]');
    likedTools.push(toolId);
    localStorage.setItem('liked_tools', JSON.stringify(likedTools));

    toast({
      title: 'Thanks for your feedback!',
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
           <Button variant="outline" size="icon" onClick={handleLike} disabled={hasLiked}>
            <ThumbsUp className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Like ({likes})</p>
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
