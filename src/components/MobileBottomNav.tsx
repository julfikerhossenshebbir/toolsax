
'use client';

import Link from 'next/link';
import { Home, Search, Heart, User, PanelLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useState } from 'react';
import AppSidebar from './AppSidebar';
import { useAuth } from '@/contexts/AuthContext';
import LoginDialog from './LoginDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setIsLoginOpen(true);
    }
  };
  
  const handleSearchClick = () => {
    const searchBox = document.getElementById('search-box');
    if (searchBox) {
        searchBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => searchBox.focus(), 300);
    }
  };


  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { action: handleSearchClick, icon: Search, label: 'Search' },
    { href: '/#favorites', icon: Heart, label: 'Favorites' },
    { href: '/profile', icon: User, label: 'Profile', action: handleProfileClick },
  ];

  return (
    <>
    <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50">
      <nav className="flex justify-around items-center h-full">
        {navItems.map((item) => (
            <TooltipProvider key={item.label} delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                    {item.href ? (
                        <Link href={item.href} onClick={item.action} legacyBehavior>
                            <a className={cn(
                                'flex flex-col items-center justify-center text-muted-foreground w-full h-full',
                                { 'text-primary': pathname === item.href }
                            )}>
                                <item.icon className="h-6 w-6" />
                                <span className="text-xs mt-1">{item.label}</span>
                            </a>
                        </Link>
                    ) : (
                        <button onClick={item.action} className="flex flex-col items-center justify-center text-muted-foreground w-full h-full">
                            <item.icon className="h-6 w-6" />
                            <span className="text-xs mt-1">{item.label}</span>
                        </button>
                    )}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{item.label}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ))}
         <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                     <AppSidebar
                        open={isSidebarOpen}
                        onOpenChange={setIsSidebarOpen}
                        trigger={
                            <button className="flex flex-col items-center justify-center text-muted-foreground w-full h-full">
                                <PanelLeft className="h-6 w-6" />
                                <span className="text-xs mt-1">Menu</span>
                            </button>
                        }
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Menu</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </nav>
    </div>
    </>
  );
}
