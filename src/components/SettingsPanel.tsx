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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const colorOptions = [
    { name: 'neutral', light: '#18181b', dark: '#fafafa' },
    { name: 'slate', light: '#475569', dark: '#94a3b8' },
    { name: 'stone', light: '#44403c', dark: '#a8a29e' },
    { name: 'gray', light: '#4b5563', dark: '#9ca3af' },
    { name: 'zinc', light: '#52525b', dark: '#a1a1aa' },
    { name: 'red', light: '#ef4444', dark: '#f87171' },
    { name: 'orange', light: '#f97316', dark: '#fb923c' },
    { name: 'green', light: '#22c55e', dark: '#4ade80' },
    { name: 'blue', light: '#3b82f6', dark: '#60a5fa' },
    { name: 'indigo', light: '#6366f1', dark: '#818cf8' },
    { name: 'purple', light: '#8b5cf6', dark: '#a78bfa' },
    { name: 'pink', light: '#ec4899', dark: '#f472b6' },
];

const fontOptions = [
  { name: 'Lexend', value: 'Lexend' },
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Oswald', value: 'Oswald' },
  { name: 'Raleway', value: 'Raleway' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Nunito', value: 'Nunito' },
  { name: 'Merriweather', value: 'Merriweather' },
];

export function SettingsPanel({ children }: { children: React.ReactNode }) {
    const { primaryColor, setPrimaryColor, radius, setRadius, fontSize, setFontSize, font, setFont, resetTheme } = useThemeSettings();

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
            <Label>Primary Color</Label>
            <div className="grid grid-cols-6 gap-2">
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
            <Label>Font Family</Label>
            <Select value={font} onValueChange={setFont}>
              <SelectTrigger>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((fontOption) => (
                  <SelectItem key={fontOption.value} value={fontOption.value}>
                    {fontOption.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Label className="flex justify-between">
              Font Size <span>{fontSize}px</span>
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
