
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Home, MessageSquareWarning, Heart, MessageCircle, Share2, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalHeader, ResponsiveModalTitle, ResponsiveModalTrigger, ResponsiveModalDescription, ResponsiveModalFooter } from '@/components/ResponsiveModal';
import { Tool } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { toggleFavoriteInDb, getUserFavorites } from '@/lib/firebase';
import CommentSystem from '@/components/comments/CommentSystem';
import { useRouter } from 'next/navigation';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Copy } from 'lucide-react';


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
    const shareData = {
      title: tool.name,
      text: tool.description,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to copying link if sharing is cancelled or fails
        if ((error as DOMException).name !== 'AbortError') {
          navigator.clipboard.writeText(window.location.href);
          toast({
            title: 'Link Copied!',
            description: 'Sharing was unsuccessful, so the link has been copied to your clipboard.',
          });
        }
      }
    } else {
        navigator.clipboard.writeText(window.location.href);
        toast({
            title: 'Link Copied!',
            description: 'Share functionality is not supported on this browser. The link has been copied to your clipboard.',
        });
    }
  };
  
  const embedCode = `<iframe src="https://toolsax.pages.dev/embed/${tool.id}" width="100%" height="90" style="border:none;overflow:hidden;" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>`;

  const copyEmbedCode = () => {
      navigator.clipboard.writeText(embedCode);
      toast({
          title: 'Embed code copied!',
          description: 'You can now paste the code into your website.',
      });
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
                          <Code className="h-4 w-4" />
                      </Button>
                  </ResponsiveModalTrigger>
              </TooltipTrigger>
              <TooltipContent>
                  <p>Embed Tool</p>
              </TooltipContent>
          </Tooltip>
          <ResponsiveModalContent>
              <ResponsiveModalHeader>
                  <ResponsiveModalTitle>Embed this Tool</ResponsiveModalTitle>
                  <ResponsiveModalDescription>
                      Copy and paste this code into your website to embed this tool card.
                  </ResponsiveModalDescription>
              </ResponsiveModalHeader>
              <div className="py-4">
                 <Label htmlFor="embed-code" className="sr-only">Embed Code</Label>
                 <div className="relative">
                    <Input id="embed-code" readOnly value={embedCode} className="pr-10 font-mono text-sm" />
                    <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8" onClick={copyEmbedCode}>
                        <Copy className="h-4 w-4" />
                    </Button>
                 </div>
              </div>
          </ResponsiveModalContent>
      </ResponsiveModal>

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
          <ResponsiveModalTitle className="sr-only">Comments on {tool.name}</ResponsiveModalTitle>
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
