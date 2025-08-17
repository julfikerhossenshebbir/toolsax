
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, Download, Image as ImageIcon, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import imageCompression from 'browser-image-compression';

export default function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [quality, setQuality] = useState(0.8);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload an image file (JPEG, PNG, etc.).' });
        return;
      }
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setCompressedFile(null);
      setCompressedUrl(null);
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
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setCompressedFile(null);
      setCompressedUrl(null);
      e.dataTransfer.clearData();
    }
  };

  const handleCompress = async () => {
    if (!originalFile) {
      toast({ variant: 'destructive', title: 'No File Selected', description: 'Please upload an image first.' });
      return;
    }

    setIsCompressing(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality,
      };
      const compressed = await imageCompression(originalFile, options);
      setCompressedFile(compressed);
      setCompressedUrl(URL.createObjectURL(compressed));
      toast({ title: 'Compression Successful', description: `Image size reduced by ${(((originalFile.size - compressed.size) / originalFile.size) * 100).toFixed(1)}%` });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Compression Failed', description: 'Could not compress the image. Please try another file.' });
    } finally {
      setIsCompressing(false);
    }
  };
  
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Compressor</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Reduce the file size of your images without sacrificing quality. All processing is done in your browser. Follow these steps:</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Upload an Image:</strong> Click the "Upload" button or drag and drop an image file (JPG, PNG, etc.).</li>
              <li><strong>Adjust Quality:</strong> Use the slider to set the desired compression level. A lower value means a smaller file size but may reduce quality.</li>
              <li><strong>Compress:</strong> Click the "Compress Image" button to start the process.</li>
              <li><strong>Compare & Download:</strong> Review the side-by-side comparison of the original and compressed images. If you are satisfied, click "Download Compressed Image".</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!originalFile && (
            <div
                className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
                onClick={() => document.getElementById('image-upload')?.click()}
            >
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-semibold">Drag & drop an image, or click to upload</p>
                <p className="text-sm text-muted-foreground">Supports PNG, JPG, and other image formats</p>
                <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        )}

        {originalFile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Original Image</h3>
                {originalUrl && <Image src={originalUrl} alt="Original" width={400} height={300} className="rounded-lg mx-auto object-contain h-64 w-auto" />}
                <p className="text-sm text-muted-foreground">Size: {formatBytes(originalFile.size)}</p>
            </div>
            <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Compressed Image</h3>
                 {isCompressing && <div className="h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                 {!isCompressing && compressedUrl && <Image src={compressedUrl} alt="Compressed" width={400} height={300} className="rounded-lg mx-auto object-contain h-64 w-auto" />}
                 {!isCompressing && !compressedUrl && <div className="h-64 flex flex-col items-center justify-center bg-muted/50 rounded-lg"><ImageIcon className="w-12 h-12 text-muted-foreground" /><p className="mt-2 text-sm text-muted-foreground">Compressed image will appear here</p></div>}
                {compressedFile && <p className="text-sm text-muted-foreground">Size: {formatBytes(compressedFile.size)}</p>}
            </div>
          </div>
        )}
        
        {originalFile && (
          <div className="flex flex-col items-center gap-4">
             <div className="w-full max-w-sm space-y-2">
                <Label htmlFor="quality" className="flex justify-between">
                    <span>Compression Quality</span>
                    <span className="text-primary font-semibold">{(quality * 100).toFixed(0)}%</span>
                </Label>
                <Slider id="quality" value={[quality]} onValueChange={(v) => setQuality(v[0])} min={0.1} max={1} step={0.05} />
             </div>
             <Button onClick={handleCompress} disabled={isCompressing} size="lg">
              {isCompressing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Compressing...</> : <><ArrowRight className="mr-2 h-5 w-5" />Compress Image</>}
             </Button>

            {compressedUrl && (
              <Button asChild variant="outline" size="lg">
                <a href={compressedUrl} download={compressedFile?.name ?? 'compressed-image.jpg'}>
                  <Download className="mr-2 h-5 w-5" />
                  Download Compressed Image
                </a>
              </Button>
            )}
          </div>
        )}

      </CardContent>
    </Card>
  );
}
