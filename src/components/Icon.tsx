import type { LucideProps } from 'lucide-react';
import * as icons from 'lucide-react';

interface IconProps extends LucideProps {
  name: string;
}

const Icon = ({ name, ...props }: IconProps) => {
  // A little hack to satisfy TypeScript.
  // The 'icons' object has a 'createLucideIcon' key that is not a component.
  type IconCollection = { [key: string]: React.ComponentType<LucideProps> };
  const LucideIcon = (icons as unknown as IconCollection)[name];

  if (!LucideIcon) {
    // Return a default icon if the requested one is not found.
    return <icons.HelpCircle {...props} />;
  }

  return <LucideIcon {...props} />;
};

export default Icon;
