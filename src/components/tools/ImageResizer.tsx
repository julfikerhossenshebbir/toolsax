
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, Download, Image as ImageIcon, Loader2, ArrowRight, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function ImageResizer() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);

  const { toast } = useToast();
  const imageRef = useRef<HTMLImageElement>(null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload an image file (JPEG, PNG, etc.).' });
        return;
      }
      resetState();
      setOriginalFile(file);
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
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
      setOriginalFile(file);
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
      e.dataTransfer.clearData();
    }
  };

  const handleImageLoad = (img: HTMLImageElement) => {
    setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    setWidth(img.naturalWidth);
    setHeight(img.naturalHeight);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    setWidth(newWidth);
    if (keepAspectRatio && originalDimensions) {
      const newHeight = Math.round((newWidth / originalDimensions.width) * originalDimensions.height);
      setHeight(newHeight);
    }
  };
  
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    setHeight(newHeight);
    if (keepAspectRatio && originalDimensions) {
      const newWidth = Math.round((newHeight / originalDimensions.height) * originalDimensions.width);
      setWidth(newWidth);
    }
  };

  const handleResize = () => {
    if (!imageRef.current || !originalDimensions) return;
    setIsResizing(true);
    
    // Use a timeout to ensure the UI updates before the blocking canvas operations
    setTimeout(() => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error("Could not get canvas context");
            }
            ctx.drawImage(imageRef.current!, 0, 0, width, height);
            const dataUrl = canvas.toDataURL(originalFile?.type);
            setResizedUrl(dataUrl);
            toast({ title: 'Resize Successful', description: 'Image has been resized.' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Resize Failed', description: 'An error occurred while resizing the image.' });
        } finally {
            setIsResizing(false);
        }
    }, 50);

  };

  const resetState = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setOriginalDimensions(null);
    setResizedUrl(null);
    setWidth(0);
    setHeight(0);
    setIsResizing(false);
  };
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Resizer</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Easily resize your images to specific dimensions online. All processing is done securely in your browser.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Upload an Image:</strong> Click the upload area or drag and drop an image file.</li>
              <li><strong>Set Dimensions:</strong> Enter your desired width and height. Toggle "Keep Aspect Ratio" to lock proportions.</li>
              <li><strong>Resize:</strong> Click the "Resize Image" button to process your image.</li>
              <li><strong>Download:</strong> Preview the result and click "Download Resized Image" to save it.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!originalUrl && (
            <div
                className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
                onClick={() => document.getElementById('image-upload')?.click()}
            >
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-semibold">Drag & drop an image, or click to upload</p>
                <p className="text-sm text-muted-foreground">Your image stays on your device.</p>
                <input type="file" id="image-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
        )}

        {originalUrl && (
            <>
            <div className="hidden">
                 <Image ref={imageRef} src={originalUrl} alt="hidden original" width={100} height={100} onLoadingComplete={handleImageLoad} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="text-center space-y-2">
                    <h3 className="font-semibold text-lg">Original Image</h3>
                    <Image src={originalUrl} alt="Original Preview" width={400} height={300} className="rounded-lg mx-auto object-contain h-64 w-auto" />
                    {originalDimensions && <p className="text-sm text-muted-foreground">{originalDimensions.width} x {originalDimensions.height} px</p>}
                </div>
                 <div className="text-center space-y-2">
                    <h3 className="font-semibold text-lg">Resized Image</h3>
                    {isResizing && <div className="h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                    {!isResizing && resizedUrl && <Image src={resizedUrl} alt="Resized Preview" width={400} height={300} className="rounded-lg mx-auto object-contain h-64 w-auto" />}
                    {!isResizing && !resizedUrl && <div className="h-64 flex flex-col items-center justify-center bg-muted/50 rounded-lg"><ImageIcon className="w-12 h-12 text-muted-foreground" /><p className="mt-2 text-sm text-muted-foreground">Resized image will appear here</p></div>}
                    {resizedUrl && <p className="text-sm text-muted-foreground">{width} x {height} px</p>}
                </div>
            </div>

            <div className="space-y-6 max-w-lg mx-auto p-4 border rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input id="width" type="number" value={width} onChange={handleWidthChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input id="height" type="number" value={height} onChange={handleHeightChange} />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="aspect-ratio" checked={keepAspectRatio} onCheckedChange={setKeepAspectRatio} />
                    <Label htmlFor="aspect-ratio">Keep Aspect Ratio</Label>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                    <Button onClick={handleResize} disabled={isResizing || !originalDimensions} size="lg">
                        {isResizing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Resizing...</> : <><ArrowRight className="mr-2 h-5 w-5" />Resize Image</>}
                    </Button>
                    <Button onClick={resetState} variant="outline" size="lg">
                        <RefreshCw className="mr-2 h-5 w-5" /> Start Over
                    </Button>
                </div>

                {resizedUrl && (
                <Button asChild variant="secondary" size="lg">
                    <a href={resizedUrl} download={`resized-${originalFile?.name ?? 'image.png'}`}>
                    <Download className="mr-2 h-5 w-5" />
                    Download Resized Image
                    </a>
                </Button>
                )}
            </div>

            </>
        )}
      </CardContent>
    </Card>
  );
}
