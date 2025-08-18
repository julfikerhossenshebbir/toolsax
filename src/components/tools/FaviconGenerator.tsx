
'use client';

import { useState, useRef, createRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, Download, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const FAVICON_SIZES = [
  { size: 16, name: '16x16 Favicon' },
  { size: 32, name: '32x32 Favicon' },
  { size: 48, name: '48x48 Favicon' },
  { size: 180, name: 'Apple Touch Icon' },
  { size: 192, name: 'Android Chrome Icon' },
];

export default function FaviconGenerator() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const { toast } = useToast();
  
  const originalImageRef = useRef<HTMLImageElement>(null);
  const canvasRefs = useRef<React.RefObject<HTMLCanvasElement>[]>([]);
  canvasRefs.current = FAVICON_SIZES.map((_, i) => canvasRefs.current[i] ?? createRef<HTMLCanvasElement>());


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload an image file (JPEG, PNG, etc.).' });
        return;
      }
      resetState();
      setOriginalFile(file);
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
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      e.dataTransfer.clearData();
    }
  };

  const handleImageLoad = () => {
    if (!originalImageRef.current) return;
    
    canvasRefs.current.forEach((ref, index) => {
      const canvas = ref.current;
      const { size } = FAVICON_SIZES[index];
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, size, size);
          ctx.drawImage(originalImageRef.current!, 0, 0, size, size);
        }
      }
    });
    setGenerated(true);
  };
  
  const handleDownload = (index: number) => {
    const canvas = canvasRefs.current[index].current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `favicon-${FAVICON_SIZES[index].size}x${FAVICON_SIZES[index].size}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }

  const resetState = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setGenerated(false);
  };
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Favicon Generator</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Create a complete set of favicons for your website from a single image. All processing is done in your browser.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Upload an Image:</strong> Click the upload area or drag and drop a square image (e.g., 512x512px) for the best results.</li>
              <li><strong>Automatic Generation:</strong> The tool will automatically generate previews for all standard favicon sizes.</li>
              <li><strong>Download Icons:</strong> Click the "Download" button next to each icon size you need.</li>
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
                <p className="text-sm text-muted-foreground">A square image of 512x512 pixels is recommended.</p>
                <input type="file" id="image-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
        )}

        {originalUrl && (
            <>
            <div className="hidden">
                 <Image ref={originalImageRef} src={originalUrl} alt="hidden original" width={512} height={512} onLoadingComplete={handleImageLoad} />
            </div>
            <div className="text-center space-y-4">
              <h3 className="font-semibold text-lg">Original Image Preview</h3>
              <Image src={originalUrl} alt="Original Preview" width={128} height={128} className="rounded-lg mx-auto border" />
              <Button onClick={resetState} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" /> Change Image
              </Button>
            </div>
            
            {generated && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {FAVICON_SIZES.map(({ size, name }, index) => (
                  <div key={size} className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <canvas 
                      ref={canvasRefs.current[index]}
                      width={size}
                      height={size}
                      className="border rounded-md"
                    />
                    <div className="text-center">
                      <p className="font-semibold text-sm">{name}</p>
                      <p className="text-xs text-muted-foreground">{size}x{size}</p>
                    </div>
                    <Button variant="secondary" size="sm" className="w-full" onClick={() => handleDownload(index)}>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
            </>
        )}
      </CardContent>
    </Card>
  );
}
