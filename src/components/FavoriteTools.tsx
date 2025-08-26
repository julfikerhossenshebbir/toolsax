
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Heart } from 'lucide-react';
import type { Tool } from '@/lib/types';
import Icon from './Icon';
import { getColorByIndex } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { getUserFavorites, listenToTools } from '@/lib/firebase';
import { Skeleton } from './ui/skeleton';

export default function FavoriteTools() {
    const { user } = useAuth();
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [allTools, setAllTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribeTools = listenToTools((loadedTools) => {
            setAllTools(loadedTools);
            setIsLoading(false);
        });

        const handleStorageChange = () => {
             if (!user) {
                const favorites = JSON.parse(localStorage.getItem('favorite_tools') || '[]');
                setFavoriteIds(favorites);
             }
        };
        
        let unsubscribeFavorites: (() => void) | undefined;
        if (user) {
            unsubscribeFavorites = getUserFavorites(user.uid, (favorites) => {
                setFavoriteIds(favorites || []);
            });
        } else {
            handleStorageChange();
        }


        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('favoritesChanged', handleStorageChange);

        return () => {
            unsubscribeTools();
            if (unsubscribeFavorites) unsubscribeFavorites();
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('favoritesChanged', handleStorageChange);
        };
    }, [user]);

    const favoriteTools = allTools
      .filter(tool => favoriteIds.includes(tool.id) && tool.isEnabled)
      .sort((a,b) => a.order - b.order);
    
    const originalIndexMap = new Map<string, number>();
    allTools.forEach((tool, index) => {
        originalIndexMap.set(tool.id, index);
    });

    if (isLoading) {
        return (
            <Button variant="ghost" size="icon" aria-label="Favorite Tools" disabled>
                <Heart className="w-5 h-5" />
            </Button>
        );
    }
    
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Favorite Tools" className="relative">
                    <Heart className="w-5 h-5" />
                    {favoriteIds.length > 0 && (
                         <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Favorite Tools</h4>
                        <p className="text-sm text-muted-foreground">
                            Your saved tools for quick access.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        {favoriteTools.length > 0 ? (
                            favoriteTools.map(tool => {
                                const index = originalIndexMap.get(tool.id) ?? 0;
                                const iconColor = getColorByIndex(index);
                                return (
                                    <Link key={tool.id} href={`/${tool.id}`}>
                                        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer">
                                            <div 
                                                className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center"
                                                style={{ 
                                                    backgroundColor: iconColor.bg,
                                                    color: iconColor.text
                                                }}
                                            >
                                                <Icon name={tool.icon} className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium">{tool.name}</span>
                                        </div>
                                    </Link>
                                )
                            })
                        ) : (
                            <div className="text-center text-sm text-muted-foreground py-4">
                                <p>You haven't added any favorite tools yet.</p>
                                <p className="mt-1">Click the <Heart className="inline h-3 w-3" /> icon on a tool's page to save it.</p>
                            </div>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
