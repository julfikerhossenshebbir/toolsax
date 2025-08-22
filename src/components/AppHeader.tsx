
'use client';

import Link from 'next/link';
import { Search, Bell, Settings, ArrowLeft, X, LayoutGrid, Palette, Code, Wrench, Lock, FileText, ImageIcon, File as FileIcon, Share2, Smile, Paintbrush, BoxSelect, Square, Scan, Code2, GitCompareArrows, Mic, Volume2, FileAudio, Github, MessageSquare, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { SettingsPanel } from './SettingsPanel';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useEffect, useState, useMemo } from 'react';
import { getNotificationMessage, Notification, isConfigured as isFirebaseConfigured, getTools } from '@/lib/firebase';
import type { Tool } from '@/lib/types';
import Icon from './Icon';
import AppSidebar from './AppSidebar';
import FavoriteTools from './FavoriteTools';
import UserAvatar from './UserAvatar';
import { Input } from './ui/input';
import { usePathname, useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { cn } from '@/lib/utils';
import { useAppState } from '@/contexts/AppStateContext';

const Logo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="currentColor" />
        <path d="M12 2L22 7V17L12 22L2 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const NotificationBell = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        if (!isFirebaseConfigured) {
          setIsLoading(false);
          return;
        }
        const unsubscribe = getNotificationMessage(true, (newNotifications) => {
            setNotifications(newNotifications);
            setIsLoading(false);
            
            try {
                const seenNotifications = localStorage.getItem('seen_notifications');
                if (JSON.stringify(newNotifications) !== seenNotifications) {
                    setHasUnread(true);
                }
            } catch (error) {
                // If localStorage is not available or fails, default to showing notifications as new
                setHasUnread(true);
            }
        });
        // @ts-ignore
        return () => unsubscribe();
    }, []);

    const handleOpenChange = (open: boolean) => {
        if (open && hasUnread) {
            setHasUnread(false);
            try {
                localStorage.setItem('seen_notifications', JSON.stringify(notifications));
            } catch (error) {
                console.error("Could not save seen notifications to localStorage", error)
            }
        }
    };

    return (
        <Popover onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                    <Bell className="w-5 h-5" />
                    {hasUnread && (
                       <span className="absolute top-2 right-2.5 flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                       </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                            Latest updates and announcements.
                        </p>
                    </div>
                    <div className="grid gap-3">
                        {isLoading ? (
                            <p className="text-sm text-muted-foreground">Loading notifications...</p>
                        ) : (
                            notifications.map((notification, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <Icon name={notification.icon} className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                                    <p className="text-sm text-foreground break-all">{notification.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  All: <LayoutGrid className="w-4 h-4 mr-2" />,
  Design: <Palette className="w-4 h-4 mr-2" />,
  Development: <Code className="w-4 h-4 mr-2" />,
  Utilities: <Wrench className="w-4 h-4 mr-2" />,
  Security: <Lock className="w-4 h-4 mr-2" />,
  Content: <FileText className="w-4 h-4 mr-2" />,
  Image: <ImageIcon className="w-4 h-4 mr-2" />,
  PDF: <FileIcon className="w-4 h-4 mr-2" />,
  "Social Media": <Share2 className="w-4 h-4 mr-2" />,
  SEO: <Search className="w-4 h-4 mr-2" />,
  Productivity: <Wrench className="w-4 h-4 mr-2" />,
  Marketing: <Wrench className="w-4 h-4 mr-2" />,
};

const HeaderSearch = () => {
    const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useAppState();
    const router = useRouter();
    const pathname = usePathname();

    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [allTools, setAllTools] = useState<Tool[]>([]);
    
    const [inputValue, setInputValue] = useState(searchQuery);
    const [debouncedQuery] = useDebounce(inputValue, 300);

    useEffect(() => {
        const unsubscribe = getTools((loadedTools) => {
            setAllTools(loadedTools);
        });
        return () => unsubscribe();
    }, []);

    const categories = useMemo(() => {
        const uniqueCategories = new Set(allTools.map(tool => tool.category));
        return ['All', ...Array.from(uniqueCategories).sort()];
    }, [allTools]);

    useEffect(() => {
        setSearchQuery(debouncedQuery);
    }, [debouncedQuery, setSearchQuery]);
    
    useEffect(() => {
        setInputValue(searchQuery);
    }, [searchQuery]);

    const handleSearchClick = () => {
        if (pathname !== '/') {
            router.push('/');
        }
        setIsSearchVisible(true);
    };
    
    return (
        <>
            <div className={cn("flex items-center w-full justify-between transition-opacity duration-300", { "opacity-0 pointer-events-none": isSearchVisible })}>
                <div className="flex items-center gap-2">
                    <AppSidebar />
                    <Link href="/" className="flex items-center gap-2">
                        <Logo />
                        <span className="font-bold text-lg hidden sm:inline-block">Toolsax</span>
                    </Link>
                </div>
                
                <div className={cn("flex items-center gap-2", { "hidden": isSearchVisible && !window.matchMedia('(min-width: 768px)').matches })}>
                    <Button variant="ghost" size="icon" onClick={handleSearchClick} aria-label="Search">
                        <Search className="w-5 h-5" />
                    </Button>
                    <NotificationBell />
                    <FavoriteTools />
                    <SettingsPanel>
                        <Button variant="ghost" size="icon" aria-label="Settings">
                            <Settings className="w-5 h-5" />
                        </Button>
                    </SettingsPanel>
                    <UserAvatar />
                </div>
            </div>

            <div 
                className={cn(
                  "absolute inset-0 z-10 flex items-center w-full h-full p-2 pr-4 transition-all duration-300",
                  isSearchVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            >
                <Button variant="ghost" size="icon" onClick={() => setIsSearchVisible(false)} className="flex-shrink-0">
                    <ArrowLeft className="w-5 h-5"/>
                </Button>
                <div className="relative w-full flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="h-10 pl-3 pr-2 shrink-0">
                            {categoryIcons[selectedCategory] || <Wrench className="w-4 h-4" />}
                            <span className="sr-only">{selectedCategory}</span>
                            <ChevronDown className="h-4 w-4 opacity-50 ml-1" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                          {categories.map((category) => (
                              <DropdownMenuItem key={category} onSelect={() => setSelectedCategory(category)}>
                                  {categoryIcons[category]}
                                  <span>{category}</span>
                              </DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={`Search in ${selectedCategory}...`}
                            className="w-full h-10 pl-12 pr-10"
                            autoFocus
                        />
                        {inputValue && (
                            <Button variant="ghost" size="icon" onClick={() => setInputValue('')} className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};


export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container relative flex h-14 items-center px-4 justify-between">
        <HeaderSearch />
      </div>
    </header>
  );
}
