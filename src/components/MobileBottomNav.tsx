
'use client';

import Link from 'next/link';
import { Home, Search, Bug, Sun, Moon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import AppSidebar from './AppSidebar';
import { useTheme } from 'next-themes';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from './ui/button';
import { PanelLeft } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearchClick = () => {
     if (pathname !== '/') {
        router.push('/#filters-section');
     }
    const searchIcon = document.querySelector('header button[aria-label="Search"]') as HTMLButtonElement;
    if (searchIcon) {
        searchIcon.click();
    }
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const navItems = [
    { href: '/', icon: Home, label: 'Home', isLink: true },
    { action: handleSearchClick, icon: Search, label: 'Search', isLink: false },
    { href: '/report-a-bug', icon: Bug, label: 'Report Bug', isLink: true },
  ];
  
  const ThemeIcon = () => {
    if (!isMounted) {
      // Render a placeholder or null on the server and during initial client render
      return null;
    }
    return theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
  }

  return (
    <>
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-background border-t z-50">
      <nav className="flex justify-around items-center h-full">
        {navItems.map((item) => (
            <TooltipProvider key={item.label} delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                      {item.isLink ? (
                           <Link
                               href={item.href || '/'}
                               className={cn(
                                   'flex flex-col items-center justify-center text-muted-foreground w-full h-full rounded-none',
                                   { 'text-primary': pathname === item.href }
                               )}
                           >
                               <item.icon className="h-5 w-5" />
                               <span className="text-xs mt-1">{item.label}</span>
                           </Link>
                      ) : (
                           <Button
                               variant="ghost"
                               onClick={item.action}
                               className="flex flex-col items-center justify-center text-muted-foreground w-full h-full p-0 rounded-none hover:bg-transparent"
                           >
                               <item.icon className="h-5 w-5" />
                               <span className="text-xs mt-1">{item.label}</span>
                           </Button>
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
                    <Button
                        variant="ghost"
                        onClick={toggleTheme}
                        className="flex flex-col items-center justify-center text-muted-foreground w-full h-full p-0 rounded-none hover:bg-transparent"
                    >
                        <ThemeIcon />
                        <span className="text-xs mt-1">Theme</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Theme</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

         <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                     <AppSidebar
                        open={isSidebarOpen}
                        onOpenChange={setIsSidebarOpen}
                        trigger={
                            <Button variant="ghost" className="flex flex-col items-center justify-center text-muted-foreground w-full h-full p-0 rounded-none hover:bg-transparent">
                                <PanelLeft className="h-5 w-5" />
                                <span className="text-xs mt-1">Menu</span>
                            </Button>
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
