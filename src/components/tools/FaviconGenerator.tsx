
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { UploadCloud, Download, RefreshCw, Scissors } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';

const FAVICON_SIZES = [
  { size: 16, name: '16x16 Favicon' },
  { size: 32, name: '32x32 Favicon' },
  { size: 48, name: '48x48 Favicon' },
  { size: 180, name: 'Apple Touch Icon' },
  { size: 192, name: 'Android Chrome Icon' },
];

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
        mediaWidth,
        mediaHeight,
    )
}

export default function FaviconGenerator() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [generatedFavicons, setGeneratedFavicons] = useState<string[]>([]);
  const { toast } = useToast();
  
  const originalImageRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [borderRadius, setBorderRadius] = useState(0);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload an image file (JPEG, PNG, etc.).' });
        return;
      }
      resetState();
      setOriginalUrl(URL.createObjectURL(file));
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
       if (!file.type.startsWith('image/')) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please drop an image file only.' });
        return;
      }
      resetState();
      setOriginalUrl(URL.createObjectURL(file));
      e.dataTransfer.clearData();
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };
  
  const handleGenerate = () => {
    if (!completedCrop || !originalImageRef.current) {
        toast({
            variant: 'destructive',
            title: 'Crop not selected',
            description: 'Please select an area to crop before generating favicons.',
        });
        return;
    }

    const image = originalImageRef.current;
    const favicons = FAVICON_SIZES.map(({ size }) => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';
        
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const cropX = completedCrop.x * scaleX;
        const cropY = completedCrop.y * scaleY;
        const cropWidth = completedCrop.width * scaleX;
        const cropHeight = completedCrop.height * scaleY;
        const radius = (borderRadius / 100) * (size / 2);

        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(size - radius, 0);
        ctx.quadraticCurveTo(size, 0, size, radius);
        ctx.lineTo(size, size - radius);
        ctx.quadraticCurveTo(size, size, size - radius, size);
        ctx.lineTo(radius, size);
        ctx.quadraticCurveTo(0, size, 0, size - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.clip();
        
        ctx.drawImage(
            image,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            size,
            size,
        );
        return canvas.toDataURL('image/png');
    });

    setGeneratedFavicons(favicons);
    toast({ title: 'Favicons Generated!', description: 'You can now download the generated icons below.' });
  }

  const handleDownload = (faviconUrl: string, size: number) => {
    const link = document.createElement('a');
    link.download = `favicon-${size}x${size}.png`;
    link.href = faviconUrl;
    link.click();
  }

  const resetState = () => {
    setOriginalUrl(null);
    setGeneratedFavicons([]);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setBorderRadius(0);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Favicon Generator</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Create a complete set of favicons for your website from a single image. All processing is done in your browser.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Upload Image:</strong> Click to upload or drag & drop a square image.</li>
              <li><strong>Crop & Customize:</strong> Adjust the crop area and use the slider to round the corners.</li>
              <li><strong>Generate Icons:</strong> Click "Generate Favicons" to create the icons.</li>
              <li><strong>Download:</strong> Click the download button next to each icon you need.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!originalUrl ? (
            <div
                className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
                onClick={() => document.getElementById('image-upload')?.click()}
            >
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-semibold">Drag & drop an image, or click to upload</p>
                <p className="text-sm text-muted-foreground">A square image of 512x512 pixels is recommended.</p>
                <input type="file" id="image-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-center">1. Crop & Customize</h3>
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={1}
                        className="max-w-full"
                    >
                         <Image ref={originalImageRef} src={originalUrl} alt="Original to crop" width={512} height={512} onLoad={handleImageLoad} className="w-full h-auto" />
                    </ReactCrop>
                    <div className="space-y-2 pt-4">
                        <Label htmlFor="border-radius" className="flex justify-between">
                            <span>Corner Radius</span>
                            <span className="font-semibold text-primary">{borderRadius}%</span>
                        </Label>
                        <Slider 
                            id="border-radius" 
                            value={[borderRadius]}
                            onValueChange={(v) => setBorderRadius(v[0])}
                            min={0} max={100} step={1}
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-center">2. Generate & Download</h3>
                    <div className="flex flex-col items-center gap-4">
                        <Button onClick={handleGenerate} size="lg">
                            <Scissors className="mr-2 h-5 w-5" /> Generate Favicons
                        </Button>
                        <Button onClick={resetState} variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" /> Change Image
                        </Button>
                    </div>
                    {generatedFavicons.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                            {FAVICON_SIZES.map(({ size, name }, index) => (
                            <div key={size} className="flex flex-col items-center gap-2 p-2 border rounded-lg">
                                <Image src={generatedFavicons[index]} alt={`${name} preview`} width={size} height={size} className="border rounded-md" />
                                <div className="text-center">
                                    <p className="font-semibold text-sm">{name}</p>
                                    <p className="text-xs text-muted-foreground">{size}x{size}</p>
                                </div>
                                <Button variant="secondary" size="sm" className="w-full" onClick={() => handleDownload(generatedFavicons[index], size)}>
                                <Download className="mr-2 h-4 w-4" /> Download
                                </Button>
                            </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

    