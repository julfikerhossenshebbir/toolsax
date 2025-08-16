'use client';

import Link from 'next/link';
import { Search, Github, User } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';


const Logo = () => (
    <User className="h-6 w-6 text-primary" />
);


export default function AppHeader() {
    const handleSearchClick = () => {
        // Find the element with the id 'search-box'
        const searchBox = document.getElementById('search-box');
        if (searchBox) {
            // If the element is found, focus on it
            searchBox.focus();
            // Optional: scroll into view if it's not visible
            searchBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 mr-auto">
          <Logo />
          <span className="font-bold text-xl">Handgen</span>
        </Link>
        
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleSearchClick} aria-label="Search">
              <Search className="w-5 h-5" />
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
