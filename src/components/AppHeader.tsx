import Link from 'next/link';
import { HandMetal } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 mr-4">
          <HandMetal className="w-6 h-6 text-primary" />
          <span className="font-bold">Toolsax</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
            {/* Future nav links can go here */}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="ghost" asChild>
              <a href="https://github.com/FirebaseExtended/ai-studio-nextjs-tools" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </Button>
            <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
