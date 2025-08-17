'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { useThemeSettings } from './ThemeProvider';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const colorOptions = [
    { name: 'neutral', light: '#18181b', dark: '#fafafa' },
    { name: 'red', light: '#ef4444', dark: '#f87171' },
    { name: 'orange', light: '#f97316', dark: '#fb923c' },
    { name: 'green', light: '#22c55e', dark: '#4ade80' },
];

const fontSizes = [
  { name: 'Small', value: 14 },
  { name: 'Default', value: 16 },
  { name: 'Large', value: 18 },
];

export function SettingsPanel({ children }: { children: React.ReactNode }) {
    const { primaryColor, setPrimaryColor, radius, setRadius, fontSize, setFontSize } = useThemeSettings();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Customize Theme</SheetTitle>
          <SheetDescription>
            Tailor the application's appearance to your liking.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <Label>Primary Color</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <Button
                  key={color.name}
                  variant="outline"
                  size="icon"
                  className={cn("h-8 w-8 rounded-full", primaryColor === color.name && 'border-2 border-primary')}
                  style={{ backgroundColor: color.light }}
                  onClick={() => setPrimaryColor(color.name)}
                >
                  {primaryColor === color.name && <Check className="h-4 w-4 text-white" />}
                  <span className="sr-only">{color.name}</span>
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Label>Border Radius</Label>
            <Slider
              value={[radius]}
              onValueChange={(value) => setRadius(value[0])}
              min={0}
              max={1}
              step={0.1}
            />
            <span className="text-xs text-muted-foreground">{radius.toFixed(1)}rem</span>
          </div>
          <div className="space-y-3">
            <Label>Font Size</Label>
            <div className="flex flex-wrap gap-2">
                {fontSizes.map((size) => (
                    <Button
                        key={size.name}
                        variant={fontSize === size.value ? 'default' : 'outline'}
                        onClick={() => setFontSize(size.value)}
                    >
                        {size.name}
                    </Button>
                ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
