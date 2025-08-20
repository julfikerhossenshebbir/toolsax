
'use client';

import Link from 'next/link';
import { Home, Search, Bug, Coffee, PanelLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import AppSidebar from './AppSidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from './ui/button';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSearchClick = () => {
     if (pathname !== '/') {
        router.push('/#filters-section');
     }
    const searchIcon = document.querySelector('header button[aria-label="Search"]') as HTMLButtonElement;
    if (searchIcon) {
        searchIcon.click();
    }
  };

  const navItems = [
    { href: '/', icon: Home, label: 'Home', isLink: true },
    { action: handleSearchClick, icon: Search, label: 'Search', isLink: false },
    { href: '/report-a-bug', icon: Bug, label: 'Report Bug', isLink: true },
  ];

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
                           </Link>
                      ) : (
                           <Button
                               variant="ghost"
                               onClick={item.action}
                               className="flex flex-col items-center justify-center text-muted-foreground w-full h-full p-0 rounded-none hover:bg-transparent"
                           >
                               <item.icon className="h-5 w-5" />
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
                    <a
                      href="https://www.buymeacoffee.com/anaroul"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center text-muted-foreground w-full h-full p-0 rounded-none hover:bg-transparent"
                    >
                        <Coffee className="h-5 w-5" />
                    </a>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Buy me a coffee</p>
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
