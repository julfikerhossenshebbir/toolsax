'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowLeft, MessageSquareWarning, Heart, ThumbsUp } from 'lucide-react';
import { incrementLikes } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

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
    <>
      <Link href="/">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Tools
        </Button>
      </Link>

      <Button variant="outline" onClick={toggleFavorite}>
        <Heart className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        {isFavorite ? 'Favorited' : 'Add to Favorite'}
      </Button>

      <Button variant="outline" onClick={handleLike} disabled={hasLiked}>
        <ThumbsUp className="mr-2 h-4 w-4" />
        Like ({likes})
      </Button>

      <Link href={`/report-a-bug?tool=${toolId}`}>
        <Button variant="destructive">
          <MessageSquareWarning className="mr-2 h-4 w-4" />
          Report a Bug
        </Button>
      </Link>
    </>
  );
}
