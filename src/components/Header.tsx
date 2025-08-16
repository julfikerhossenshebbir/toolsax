import { HandMetal } from 'lucide-react';

interface HeaderProps {
  clickCount: number;
}

const Header = ({ clickCount }: HeaderProps) => {
  return (
    <header className="py-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-4">
          <HandMetal className="w-12 h-12 text-primary" />
          <h1 className="text-5xl font-bold tracking-tighter text-foreground font-headline">
            Toolsax
          </h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground">
          Discover your next favorite tool. Curated. Reviewed. Ready.
        </p>
        <div className="mt-2 text-sm text-primary font-semibold">
          Clicks Today: {clickCount}
        </div>
      </div>
    </header>
  );
};

export default Header;
