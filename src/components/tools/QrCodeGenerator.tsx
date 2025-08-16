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
        QRCode.toCanvas(canvasRef.current, text || ' ', { width: 256, margin: 2 }, (error) => {
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
          Generate a QR code from any text or URL. You can download the generated QR code as a PNG image. This is perfect for sharing links, contact information, or Wi-Fi credentials.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-grow w-full">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text or URL..."
              className="min-h-[150px] text-base"
            />
        </div>
        <div className="flex-shrink-0 text-center mx-auto md:mx-0">
            <canvas ref={canvasRef} className="rounded-lg border bg-white" />
            <Button onClick={handleDownload} className="mt-4 w-full">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
