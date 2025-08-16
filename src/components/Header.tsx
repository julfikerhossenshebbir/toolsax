import { HandMetal } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-10 sm:py-20 text-center">
      <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
        Your Ultimate Digital <span className="font-code text-primary">Tools Manager</span>
      </h1>
      <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg leading-7 text-muted-foreground">
        An expanding collection of essential utilities to streamline your workflow. Fast, reliable, and easy to use.
      </p>
    </header>
  );
};

export default Header;
