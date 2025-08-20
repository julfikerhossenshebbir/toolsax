
'use client';

import Link from 'next/link';
import { Home, Search, Bug, PanelLeft, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import AppSidebar from './AppSidebar';
import { useTheme } from 'next-themes';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from './ui/button';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSearchClick = () => {
    const searchBox = document.getElementById('search-box');
    if (searchBox) {
        searchBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => searchBox.focus(), 300);
    }
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const navItems = [
    { href: '/', icon: Home, label: 'Home', isLink: true },
    { action: handleSearchClick, icon: Search, label: 'Search', isLink: false },
    { href: '/report-a-bug', icon: Bug, label: 'Report Bug', isLink: true },
    { action: toggleTheme, icon: theme === 'light' ? Moon : Sun, label: 'Theme', isLink: false },
  ];

  return (
    <>
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50">
      <nav className="flex justify-around items-center h-full">
        {navItems.map((item) => (
            <TooltipProvider key={item.label} delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                      {item.isLink ? (
                           <Link href={item.href || '/'} legacyBehavior>
                               <a className={cn(
                                   'flex flex-col items-center justify-center text-muted-foreground w-full h-full',
                                   { 'text-primary': pathname === item.href }
                               )}>
                                   <item.icon className="h-6 w-6" />
                                   <span className="text-xs mt-1">{item.label}</span>
                               </a>
                           </Link>
                      ) : (
                           <Button
                               variant="ghost"
                               onClick={item.action}
                               className="flex flex-col items-center justify-center text-muted-foreground w-full h-full"
                           >
                               <item.icon className="h-6 w-6" />
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
                     <AppSidebar
                        open={isSidebarOpen}
                        onOpenChange={setIsSidebarOpen}
                        trigger={
                            <Button variant="ghost" className="flex flex-col items-center justify-center text-muted-foreground w-full h-full">
                                <PanelLeft className="h-6 w-6" />
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
