
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
import { Check, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { ThemeToggle } from './ThemeToggle';

const colorOptions = [
    { name: 'neutral', value: '#18181b' },
    { name: 'slate', value: '#475569' },
    { name: 'stone', value: '#44403c' },
    { name: 'gray', value: '#4b5563' },
    { name: 'zinc', value: '#52525b' },
    { name: 'red', value: '#ef4444' },
    { name: 'orange', value: '#f97316' },
    { name: 'green', value: '#22c55e' },
    { name: 'blue', value: '#3b82f6' },
    { name: 'indigo', value: '#6366f1' },
    { name: 'purple', value: '#8b5cf6' },
    { name: 'pink', value: '#ec4899' },
];

export function SettingsPanel({ children }: { children: React.ReactNode }) {
    const { primaryColor, setPrimaryColor, radius, setRadius, fontSize, setFontSize, resetTheme } = useThemeSettings();
    const { theme } = useTheme();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[340px]">
        <SheetHeader>
          <SheetTitle>Customize Theme</SheetTitle>
          <SheetDescription>
            Tailor the application's appearance to your liking.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4">
            <div className="space-y-3">
                <Label>Theme</Label>
                <div className="flex items-center justify-between rounded-lg border p-2">
                    <span className="text-sm font-medium">Toggle Light/Dark Mode</span>
                    <ThemeToggle />
                </div>
            </div>
          <div className="space-y-3">
            <Label>Primary Color</Label>
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map((color) => {
                const isActive = primaryColor === color.name;
                return (
                  <Button
                    key={color.name}
                    variant={'outline'}
                    size="icon"
                    className={cn(
                        "h-8 w-8 rounded-full border-2",
                        isActive ? 'border-primary' : 'border-transparent'
                    )}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setPrimaryColor(color.name)}
                  >
                    {isActive && <Check className="h-4 w-4" style={{ color: theme === 'dark' ? 'black' : 'white' }} />}
                    <span className="sr-only">{color.name}</span>
                  </Button>
                )
              })}
            </div>
          </div>
          <div className="space-y-3">
            <Label className="flex justify-between items-center">
                <span>Border Radius</span>
                <span className="text-xs text-muted-foreground">{radius.toFixed(1)}rem</span>
            </Label>
            <Slider
              value={[radius]}
              onValueChange={(value) => setRadius(value[0])}
              min={0}
              max={1}
              step={0.1}
            />
          </div>
          <div className="space-y-3">
            <Label className="flex justify-between items-center">
              <span>Font Size</span>
              <span className="text-xs text-muted-foreground">{fontSize}px</span>
            </Label>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              min={12}
              max={20}
              step={1}
            />
          </div>
        </div>
        <div className="mt-6 border-t pt-6">
            <Button variant="outline" onClick={resetTheme} className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Defaults
            </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
