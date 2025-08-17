
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };

// --- Conversion Functions ---

function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

function rgbToHex({ r, g, b }: RGB): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }: HSL): RGB {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export default function ColorConverter() {
  const { toast } = useToast();
  const [hex, setHex] = useState('#673DE6');
  const [rgb, setRgb] = useState<RGB>({ r: 103, g: 61, b: 230 });
  const [hsl, setHsl] = useState<HSL>({ h: 256, s: 79, l: 57 });
  const [lastChanged, setLastChanged] = useState<'hex' | 'rgb' | 'hsl' | null>(null);

  useEffect(() => {
    if (lastChanged === 'hex') {
      const newRgb = hexToRgb(hex);
      if (newRgb) {
        setRgb(newRgb);
        setHsl(rgbToHsl(newRgb));
      }
    }
  }, [hex, lastChanged]);
  
  useEffect(() => {
    if (lastChanged === 'rgb') {
      setHex(rgbToHex(rgb));
      setHsl(rgbToHsl(rgb));
    }
  }, [rgb, lastChanged]);

  useEffect(() => {
    if (lastChanged === 'hsl') {
      const newRgb = hslToRgb(hsl);
      setRgb(newRgb);
      setHex(rgbToHex(newRgb));
    }
  }, [hsl, lastChanged]);
  
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHex(e.target.value);
    setLastChanged('hex');
  };

  const handleRgbChange = (e: React.ChangeEvent<HTMLInputElement>, component: 'r' | 'g' | 'b') => {
    const value = Math.max(0, Math.min(255, Number(e.target.value)));
    setRgb(prev => ({ ...prev, [component]: value }));
    setLastChanged('rgb');
  };
  
  const handleHslChange = (e: React.ChangeEvent<HTMLInputElement>, component: 'h' | 's' | 'l') => {
    const max = component === 'h' ? 360 : 100;
    const value = Math.max(0, Math.min(max, Number(e.target.value)));
    setHsl(prev => ({ ...prev, [component]: value }));
    setLastChanged('hsl');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: text,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Converter</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Convert colors between HEX, RGB, and HSL formats instantly. All conversions are done in real-time as you type.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Enter a Color:</strong> Type a value into any of the HEX, RGB, or HSL input fields.</li>
              <li><strong>See Live Updates:</strong> All other formats and the color preview will update automatically.</li>
              <li><strong>Copy the Value:</strong> Click the copy icon next to any format to copy the value to your clipboard.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* HEX */}
          <div className="space-y-2">
            <Label htmlFor="hex" className="text-lg font-medium">HEX</Label>
            <div className="flex gap-2">
              <Input id="hex" value={hex} onChange={handleHexChange} className="font-mono text-base" />
              <Button variant="outline" size="icon" onClick={() => handleCopy(hex)}><Copy className="h-4 w-4" /></Button>
            </div>
          </div>
          {/* RGB */}
          <div className="space-y-2">
            <Label className="text-lg font-medium">RGB</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rgb-r" className="text-sm text-muted-foreground">Red</Label>
                <Input id="rgb-r" type="number" value={rgb.r} onChange={e => handleRgbChange(e, 'r')} />
              </div>
              <div>
                <Label htmlFor="rgb-g" className="text-sm text-muted-foreground">Green</Label>
                <Input id="rgb-g" type="number" value={rgb.g} onChange={e => handleRgbChange(e, 'g')} />
              </div>
              <div>
                <Label htmlFor="rgb-b" className="text-sm text-muted-foreground">Blue</Label>
                <Input id="rgb-b" type="number" value={rgb.b} onChange={e => handleRgbChange(e, 'b')} />
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy RGB
            </Button>
          </div>
          {/* HSL */}
          <div className="space-y-2">
            <Label className="text-lg font-medium">HSL</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="hsl-h" className="text-sm text-muted-foreground">Hue</Label>
                <Input id="hsl-h" type="number" value={hsl.h} onChange={e => handleHslChange(e, 'h')} />
              </div>
              <div>
                <Label htmlFor="hsl-s" className="text-sm text-muted-foreground">Saturation</Label>
                <Input id="hsl-s" type="number" value={hsl.s} onChange={e => handleHslChange(e, 's')} />
              </div>
              <div>
                <Label htmlFor="hsl-l" className="text-sm text-muted-foreground">Lightness</Label>
                <Input id="hsl-l" type="number" value={hsl.l} onChange={e => handleHslChange(e, 'l')} />
              </div>
            </div>
             <Button variant="outline" size="sm" onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy HSL
            </Button>
          </div>
        </div>
        <div className="space-y-4 text-center">
            <Label className="text-lg font-medium">Preview</Label>
            <div className="w-full h-48 rounded-lg border-2 border-border" style={{ backgroundColor: hex }}></div>
        </div>
      </CardContent>
    </Card>
  );
}
