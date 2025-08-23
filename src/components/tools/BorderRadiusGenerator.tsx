
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BorderRadiusGenerator() {
  const { toast } = useToast();
  const [allCorners, setAllCorners] = useState(25);
  const [topLeft, setTopLeft] = useState(25);
  const [topRight, setTopRight] = useState(25);
  const [bottomRight, setBottomRight] = useState(25);
  const [bottomLeft, setBottomLeft] = useState(25);

  const borderRadiusCss = useMemo(() => {
    return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
  }, [topLeft, topRight, bottomRight, bottomLeft]);

  const handleAllCornersChange = (value: number) => {
    setAllCorners(value);
    setTopLeft(value);
    setTopRight(value);
    setBottomLeft(value);
    setBottomRight(value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`border-radius: ${borderRadiusCss};`);
    toast({
      title: 'CSS Copied!',
      description: 'The border-radius CSS has been copied to your clipboard.',
    });
  };

  const ControlSlider = ({ label, value, setValue }: { label: string; value: number; setValue: (val: number) => void; }) => (
    <div className="space-y-2">
      <Label className="flex justify-between items-center">
        <span>{label}</span>
        <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">{value}px</span>
      </Label>
      <Slider value={[value]} onValueChange={(v) => setValue(v[0])} min={0} max={200} step={1} />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Border Radius Generator</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Visually create custom border-radius values for your CSS styles. Adjust each corner individually or all at once.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Adjust Sliders:</strong> Use the "All Corners" slider for a uniform radius, or the individual sliders for specific corners.</li>
              <li><strong>Live Preview:</strong> See your changes applied to the preview box in real-time.</li>
              <li><strong>Copy CSS:</strong> Once you are happy with the result, click the "Copy" button to get the CSS code.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 p-4 border rounded-lg">
          <h3 className="font-semibold text-lg">Controls</h3>
           <div className="space-y-2">
              <Label className="flex justify-between items-center">
                <span>All Corners</span>
                <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">{allCorners}px</span>
              </Label>
              <Slider value={[allCorners]} onValueChange={(v) => handleAllCornersChange(v[0])} min={0} max={200} step={1} />
          </div>
          <ControlSlider label="Top Left" value={topLeft} setValue={setTopLeft} />
          <ControlSlider label="Top Right" value={topRight} setValue={setTopRight} />
          <ControlSlider label="Bottom Left" value={bottomLeft} setValue={setBottomLeft} />
          <ControlSlider label="Bottom Right" value={bottomRight} setValue={setBottomRight} />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Preview & Code</h3>
          <div className="flex items-center justify-center w-full h-64 bg-card-foreground/5 rounded-lg border-2 border-border">
              <div className="w-48 h-48 bg-primary/80 flex items-center justify-center text-primary-foreground font-bold" style={{ borderRadius: borderRadiusCss }}>
                  Preview
              </div>
          </div>
          <div className="relative">
            <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
              <code>{`border-radius: ${borderRadiusCss};`}</code>
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
