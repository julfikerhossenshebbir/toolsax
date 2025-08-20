
import Link from 'next/link';

export default function AppFooter() {
    return (
      <footer className="border-t hidden md:block">
        <div className="container flex h-14 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Toolsax. All rights reserved.
          </p>
          <nav className="flex items-center gap-4">
            <Link href="/dmca" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                DMCA
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
            </Link>
          </nav>
        </div>
      </footer>
    );
}
