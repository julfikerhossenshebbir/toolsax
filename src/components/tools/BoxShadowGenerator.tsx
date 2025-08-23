
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function BoxShadowGenerator() {
  const { toast } = useToast();
  const [hOffset, setHOffset] = useState(10);
  const [vOffset, setVOffset] = useState(10);
  const [blur, setBlur] = useState(5);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState('#000000');
  const [opacity, setOpacity] = useState(0.5);
  const [inset, setInset] = useState(false);

  const boxShadowCss = useMemo(() => {
    const rgbaColor = hexToRgba(color, opacity);
    return `${inset ? 'inset ' : ''}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${rgbaColor}`;
  }, [hOffset, vOffset, blur, spread, color, opacity, inset]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`box-shadow: ${boxShadowCss};`);
    toast({
      title: 'CSS Copied!',
      description: 'The box-shadow CSS has been copied to your clipboard.',
    });
  };

  const ControlSlider = ({ label, value, setValue, min, max }: { label: string; value: number; setValue: (val: number) => void; min: number; max: number }) => (
    <div className="space-y-2">
      <Label className="flex justify-between items-center">
        <span>{label}</span>
        <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">{value}px</span>
      </Label>
      <Slider value={[value]} onValueChange={(v) => setValue(v[0])} min={min} max={max} step={1} />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Box Shadow Generator</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Create and customize layered CSS box shadows with a real-time preview. Adjust the settings to get the perfect shadow for your elements.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Adjust properties:</strong> Use the sliders to control the shadow's offsets, blur, and spread.</li>
              <li><strong>Set color and opacity:</strong> Pick a color and adjust its transparency.</li>
              <li><strong>Toggle Inset:</strong> Switch to an inner shadow if needed.</li>
              <li><strong>Preview & Copy:</strong> See the live preview and copy the generated CSS code.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 p-4 border rounded-lg">
          <h3 className="font-semibold text-lg">Controls</h3>
          <ControlSlider label="Horizontal Offset" value={hOffset} setValue={setHOffset} min={-50} max={50} />
          <ControlSlider label="Vertical Offset" value={vOffset} setValue={setVOffset} min={-50} max={50} />
          <ControlSlider label="Blur Radius" value={blur} setValue={setBlur} min={0} max={100} />
          <ControlSlider label="Spread Radius" value={spread} setValue={setSpread} min={-50} max={50} />
          
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="color">Shadow Color</Label>
                <Input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-12 p-1" />
             </div>
             <div className="space-y-2">
                 <Label>Opacity</Label>
                 <Slider value={[opacity]} onValueChange={(v) => setOpacity(v[0])} min={0} max={1} step={0.01} />
             </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch id="inset-switch" checked={inset} onCheckedChange={setInset} />
            <Label htmlFor="inset-switch">Inset Shadow</Label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Preview & Code</h3>
          <div className="flex items-center justify-center w-full h-64 bg-card-foreground/5 rounded-lg border-2 border-border">
              <div className="w-32 h-32 bg-background rounded-lg flex items-center justify-center text-muted-foreground" style={{ boxShadow: boxShadowCss }}>
                  Preview
              </div>
          </div>
          <div className="relative">
            <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
              <code>{`box-shadow: ${boxShadowCss};`}</code>
            </pre>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
