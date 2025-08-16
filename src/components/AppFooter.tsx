import Link from 'next/link';
import { Button } from './ui/button';
import { Github, Facebook, Twitter, Send } from 'lucide-react';

export default function AppFooter() {
    return (
      <footer className="border-t">
        <div className="container py-2 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Toolsax. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
                <Link href="https://facebook.com" target="_blank">
                    <Facebook className="h-5 w-5" />
                    <span className="sr-only">Facebook</span>
                </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="https://github.com/FirebaseExtended/ai-studio-nextjs-tools" target="_blank">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="https://x.com" target="_blank">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">X</span>
                </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="https://telegram.org" target="_blank">
                    <Send className="h-5 w-5" />
                    <span className="sr-only">Telegram</span>
                </Link>
            </Button>
          </div>
        </div>
      </footer>
    );
}
