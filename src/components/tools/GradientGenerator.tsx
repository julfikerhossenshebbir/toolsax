
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Copy, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function GradientGenerator() {
  const { toast } = useToast();
  const [colors, setColors] = useState([
    { color: '#8B5CF6', stop: 0 },
    { color: '#EC4899', stop: 100 },
  ]);
  const [angle, setAngle] = useState(90);
  const [type, setType] = useState<'linear' | 'radial'>('linear');

  const gradientCss = useMemo(() => {
    const colorStops = colors.map(c => `${c.color} ${c.stop}%`).join(', ');
    if (type === 'linear') {
      return `linear-gradient(${angle}deg, ${colorStops})`;
    }
    return `radial-gradient(circle, ${colorStops})`;
  }, [colors, angle, type]);

  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...colors];
    newColors[index].color = newColor;
    setColors(newColors);
  };
  
  const handleStopChange = (index: number, newStop: number) => {
    const newColors = [...colors];
    newColors[index].stop = newStop;
    setColors(newColors);
  };

  const addColor = () => {
    if (colors.length >= 5) {
        toast({ variant: 'destructive', title: 'Limit Reached', description: 'You can add a maximum of 5 colors.' });
        return;
    }
    setColors([...colors, { color: '#FFFFFF', stop: 100 }]);
  };

  const removeColor = (index: number) => {
    if (colors.length <= 2) {
        toast({ variant: 'destructive', title: 'Minimum Colors Required', description: 'You need at least 2 colors for a gradient.' });
        return;
    }
    setColors(colors.filter((_, i) => i !== index));
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`background: ${gradientCss};`);
    toast({
      title: 'CSS Copied!',
      description: 'The gradient CSS has been copied to your clipboard.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gradient Generator</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Create and customize beautiful CSS gradients. All generated code is available for you to copy and use in your projects.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Adjust Colors:</strong> Use the color pickers to select your desired gradient colors. Add or remove colors as needed.</li>
              <li><strong>Set Stops & Angle:</strong> Use the sliders to adjust the color stops and the gradient angle (for linear gradients).</li>
              <li><strong>Choose Type:</strong> Select between a "Linear" or "Radial" gradient.</li>
              <li><strong>Preview & Copy:</strong> See a live preview of your gradient and click "Copy CSS" when you're ready.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
            <h3 className="font-semibold text-lg">Controls</h3>
            <div className="space-y-2">
                <Label>Gradient Type</Label>
                 <RadioGroup value={type} onValueChange={(v) => setType(v as 'linear' | 'radial')} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="linear" id="type-linear" />
                        <Label htmlFor="type-linear">Linear</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="radial" id="type-radial" />
                        <Label htmlFor="type-radial">Radial</Label>
                    </div>
                </RadioGroup>
            </div>

            {type === 'linear' && (
                <div className="space-y-2">
                    <Label htmlFor="angle" className="flex justify-between">Angle <span>{angle}°</span></Label>
                    <Slider id="angle" value={[angle]} onValueChange={(v) => setAngle(v[0])} min={0} max={360} step={1} />
                </div>
            )}
            
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label>Colors</Label>
                    <Button variant="outline" size="sm" onClick={addColor}><Plus className="h-4 w-4 mr-2" /> Add Color</Button>
                </div>
                {colors.map((c, i) => (
                    <div key={i} className="p-3 border rounded-lg space-y-3">
                         <div className="flex items-center gap-4">
                            <Input type="color" value={c.color} onChange={(e) => handleColorChange(i, e.target.value)} className="w-12 h-10 p-1" />
                            <div className="flex-grow">
                                <Label className="text-xs">Color {i+1}</Label>
                                <Input value={c.color.toUpperCase()} onChange={(e) => handleColorChange(i, e.target.value)} />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeColor(i)}><Trash2 className="h-4 w-4"/></Button>
                        </div>
                        <div className="space-y-2">
                             <Label className="text-xs flex justify-between">Stop <span>{c.stop}%</span></Label>
                             <Slider value={[c.stop]} onValueChange={(v) => handleStopChange(i, v[0])} min={0} max={100} step={1} />
                        </div>
                    </div>
                ))}
            </div>

        </div>
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Preview & Code</h3>
            <div className="w-full h-64 rounded-lg border-2 border-border" style={{ background: gradientCss }}></div>
            <div className="relative">
                <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
                    <code>{`background: ${gradientCss};`}</code>
                </pre>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={handleCopy}>
                    <Copy className="h-4 w-4"/>
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
