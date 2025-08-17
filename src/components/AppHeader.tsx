
'use client';

import Link from 'next/link';
import { Search, Bell, Settings, Info, Zap, Palette } from 'lucide-react';
import { Button } from './ui/button';
import { SettingsPanel } from './SettingsPanel';
import { ThemeToggle } from './ThemeToggle';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useEffect, useState } from 'react';
import { getNotificationMessage, Notification } from '@/lib/firebase';
import Icon from './Icon';

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
        const unsubscribe = getNotificationMessage((newNotifications) => {
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
                                    <Icon name={notification.icon} className="h-4 w-4 text-muted-foreground mt-1" />
                                    <p className="text-sm text-foreground">{notification.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}


export default function AppHeader() {
    const handleSearchClick = () => {
        const searchBox = document.getElementById('search-box');
        if (searchBox) {
            searchBox.focus();
            searchBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2 mr-auto">
          <Logo />
          <span className="font-bold text-lg">Toolsax</span>
        </Link>
        
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleSearchClick} aria-label="Search">
              <Search className="w-5 h-5" />
            </Button>
            <NotificationBell />
            <ThemeToggle />
            <SettingsPanel>
                <Button variant="ghost" size="icon" aria-label="Settings">
                    <Settings className="w-5 h-5" />
                </Button>
            </SettingsPanel>
        </div>
      </div>
    </header>
  );
}
