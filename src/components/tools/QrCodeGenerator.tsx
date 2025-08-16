'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download } from 'lucide-react';
import QRCode from 'qrcode';

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://toolsax.com');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, text || ' ', { width: 220, margin: 2, color: { light: '#ffffff', dark: '#0a0a0a' } }, (error) => {
            if (error) console.error(error);
        });
    }
  }, [text]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
        <CardDescription>
          Create a QR code from any text or URL. The QR code will be generated in real-time as you type. You can then download it as a high-quality PNG image. This tool is perfect for sharing website links, contact information, Wi-Fi credentials, or any other text-based data in a scannable format.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-grow w-full">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text or URL..."
              className="min-h-[220px] text-base"
            />
        </div>
        <div className="flex-shrink-0 text-center mx-auto md:mx-0 p-4 bg-white rounded-lg">
            <canvas ref={canvasRef} className="rounded-lg" />
            <Button onClick={handleDownload} className="mt-4 w-full">
              <Download className="mr-2 h-4 w-4" /> Download PNG
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
