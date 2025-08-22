
'use client'

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link";
import { Home, Bug, PanelLeft, FileText, Cookie, Shield, Lock, Coffee, Mail } from "lucide-react";
import { useState, forwardRef } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const Logo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="currentColor" />
        <path d="M12 2L22 7V17L12 22L2 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const mainNavLinks = [
    { href: "/", icon: <Home className="h-4 w-4" />, label: "Home" },
    { href: "/report-a-bug", icon: <Bug className="h-4 w-4" />, label: "Report a Bug" },
];

const secondaryNavLinks = [
    { href: "/contact", icon: <Mail className="h-4 w-4" />, label: "Contact Us" },
    { href: "/cookies", icon: <Cookie className="h-4 w-4" />, label: "Cookie Policy" },
    { href: "/dmca", icon: <Shield className="h-4 w-4" />, label: "DMCA" },
    { href: "/privacy", icon: <Lock className="h-4 w-4" />, label: "Privacy Policy" },
];

interface AppSidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const AppSidebar = forwardRef<HTMLDivElement, AppSidebarProps>(({ open, onOpenChange, trigger }, ref) => {
    
    const sidebarContent = (
      <SheetContent ref={ref} side="left" className="w-[300px] p-0 flex flex-col">
          <SheetHeader className="border-b p-4">
              <SheetTitle className="sr-only">Main Menu</SheetTitle>
               <div className="flex items-center gap-2">
                  <Logo />
                  <span className="font-bold text-lg">Toolsax</span>
              </div>
          </SheetHeader>
          <div className="p-4 flex-grow overflow-y-auto">
              <nav className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-muted-foreground px-2">MAIN</p>
                  {mainNavLinks.map(link => (
                      <Link key={link.href} href={link.href} onClick={() => onOpenChange?.(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-2">
                              {link.icon}
                              <span>{link.label}</span>
                          </Button>
                      </Link>
                  ))}
              </nav>
              <Separator className="my-4" />
              <nav className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-muted-foreground px-2">INFO</p>
                  {secondaryNavLinks.map(link => (
                      <Link key={link.href} href={link.href} onClick={() => onOpenChange?.(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-2">
                              {link.icon}
                              <span>{link.label}</span>
                          </Button>
                      </Link>
                  ))}
              </nav>
              <Separator className="my-4" />
          </div>
          <div className="p-4 border-t">
              <a href="https://www.buymeacoffee.com/anaroul" target="_blank" rel="noopener noreferrer">
                   <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
                     <Coffee className="h-4 w-4 mr-2" />
                     Buy me a coffee
                   </Button>
              </a>
          </div>
      </SheetContent>
    );

    // Default trigger for desktop
    const defaultTrigger = (
      <Button variant="ghost" size="icon" className="h-10 w-10">
        <PanelLeft className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
    );

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
              {trigger || defaultTrigger}
            </SheetTrigger>
            {sidebarContent}
        </Sheet>
    )
});

AppSidebar.displayName = 'AppSidebar';

export default AppSidebar;
