'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Palette, Copy, Loader2, Wand2 } from 'lucide-react';
import { generateColorPaletteAction } from './ColorPaletteGenerator/actions';

interface Color {
  hex: string;
  name: string;
}

const PaletteSkeleton = () => (
    <div className="grid grid-cols-5 h-64 rounded-lg overflow-hidden animate-pulse">
        <div className="bg-muted"></div>
        <div className="bg-muted/90"></div>
        <div className="bg-muted"></div>
        <div className="bg-muted/90"></div>
        <div className="bg-muted"></div>
    </div>
);

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#6366f1');
  const [style, setStyle] = useState('Vibrant & Modern');
  const [palette, setPalette] = useState<Color[]>([
      { hex: '#6366f1', name: 'Indigo Dye' },
      { hex: '#a78bfa', name: 'Light Purple' },
      { hex: '#fde047', name: 'Sunny Yellow' },
      { hex: '#f87171', name: 'Coral Red' },
      { hex: '#dcfce7', name: 'Mint Green' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    const result = await generateColorPaletteAction({ baseColor, style });
    if (result.success && result.data) {
        setPalette(result.data.palette);
        toast({ title: 'Palette Generated!', description: 'A new color palette has been created for you.' });
    } else {
        toast({ variant: 'destructive', title: 'Generation Failed', description: result.error || 'Could not generate palette.' });
    }
    setIsLoading(false);
  };

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    toast({
      title: 'Copied!',
      description: `${hex} copied to your clipboard.`,
    });
  };

  const instructions = (
    <div className="space-y-2">
      <p>Generate beautiful, AI-powered color palettes from a single color. Create harmonious color schemes for your designs instantly.</p>
      <ol className="list-decimal list-inside space-y-1 pl-4">
        <li><strong>Pick a Base Color:</strong> Use the color picker to select your starting color.</li>
        <li><strong>Describe the Style:</strong> Enter a mood or style for your palette (e.g., "Calm and natural", "Bold and energetic").</li>
        <li><strong>Generate:</strong> Click the "Generate Palette" button to let the AI create a harmonious color scheme.</li>
        <li><strong>Copy Colors:</strong> Click on any color in the generated palette to copy its HEX code to your clipboard.</li>
      </ol>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Color Palette Generator</CardTitle>
        <CardDescription>{instructions}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="base-color">Base Color</Label>
            <Input id="base-color" type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="w-full h-12 p-1" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="style">Style / Mood</Label>
            <Input id="style" value={style} onChange={(e) => setStyle(e.target.value)} placeholder="e.g., Modern, Vintage, Playful" />
          </div>
        </div>
        <div className="text-center">
            <Button onClick={handleGenerate} disabled={isLoading} size="lg">
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                Generate Palette
            </Button>
        </div>

        <div>
            <h3 className="font-semibold text-lg mb-2">Generated Palette</h3>
            {isLoading ? <PaletteSkeleton /> : (
                <div className="grid grid-cols-1 sm:grid-cols-5 h-96 sm:h-64 rounded-lg overflow-hidden border">
                    {palette.map((color, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col justify-end p-4 text-white transition-all duration-300"
                            style={{ backgroundColor: color.hex, color: getContrastingTextColor(color.hex) }}
                            onClick={() => handleCopy(color.hex)}
                        >
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity cursor-pointer">
                                <Copy className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-white opacity-0 group-hover:opacity-100" />
                            </div>
                            <div className="relative z-10">
                                <p className="font-bold text-sm truncate">{color.name}</p>
                                <p className="font-mono text-xs">{color.hex.toUpperCase()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

function getContrastingTextColor(hex: string): string {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        return '#FFFFFF';
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Using the sRGB luminance formula
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
