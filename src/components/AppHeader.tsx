'use client';

import Link from 'next/link';
import { Search, Github, Coffee } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';

const Logo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="currentColor" />
        <path d="M12 2L22 7V17L12 22L2 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


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
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 mr-auto">
          <Logo />
          <span className="font-bold text-lg">Toolsax</span>
        </Link>
        
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleSearchClick} aria-label="Search">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label="Buy Me A Coffee">
              <a href="https://buymeacoffee.com/helloanaroul" target="_blank" rel="noopener noreferrer">
                <Coffee className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label="GitHub">
              <a href="https://github.com/FirebaseExtended/ai-studio-nextjs-tools" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5" />
              </a>
            </Button>
            <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
