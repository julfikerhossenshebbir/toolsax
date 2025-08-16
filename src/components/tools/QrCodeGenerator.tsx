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
          <div className="space-y-2">
            <p>Generate and download a QR code for any URL or text. It's a simple way to share information in a scannable format. Follow these steps:</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Enter Your Data:</strong> In the text area on the left, type or paste the URL, contact information, Wi-Fi credentials, or any other text you want to encode.</li>
              <li><strong>Live Preview:</strong> As you type, a live preview of the QR code will be generated on the right.</li>
              <li><strong>Download Your QR Code:</strong> Once you are satisfied with the QR code, click the "Download PNG" button.</li>
              <li><strong>Save the Image:</strong> Your browser will download the QR code as a high-quality PNG file, which you can use in your print materials, on your website, or for any other purpose.</li>
            </ol>
          </div>
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
