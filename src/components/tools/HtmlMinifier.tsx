'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Copy, Trash2, ArrowRight, Loader2, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { minifyHtmlAction } from './HtmlMinifier/actions';

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


export default function HtmlMinifier() {
  const [inputHtml, setInputHtml] = useState('<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n\n  <!-- This is a comment -->\n  <h1>Hello,     World!</h1>\n\n</body>\n</html>');
  const [outputHtml, setOutputHtml] = useState('');
  const [isMinifying, setIsMinifying] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [minifiedSize, setMinifiedSize] = useState<number | null>(null);
  const [fileName, setFileName] = useState('minified.html');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleMinify = async () => {
    if (!inputHtml.trim()) {
      setOutputHtml('');
      setOriginalSize(null);
      setMinifiedSize(null);
      return;
    }

    setIsMinifying(true);
    try {
      const result = await minifyHtmlAction(inputHtml);
      if (result.success && result.minifiedHtml) {
        setOutputHtml(result.minifiedHtml);
        const originalBlobSize = new Blob([inputHtml]).size;
        const minifiedBlobSize = new Blob([result.minifiedHtml]).size;
        setOriginalSize(originalBlobSize);
        setMinifiedSize(minifiedBlobSize);
        
        const reduction = ((originalBlobSize - minifiedBlobSize) / originalBlobSize) * 100;
        
        toast({
          title: 'HTML Minified!',
          description: `Size reduced by ${reduction.toFixed(2)}%.`,
        });
      } else {
        throw new Error(result.error || 'Minification failed');
      }
    } catch (error: any) {
      setOutputHtml('');
      setOriginalSize(null);
      setMinifiedSize(null);
      toast({
        variant: 'destructive',
        title: 'Minification Error',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsMinifying(false);
    }
  };

  const handleCopy = () => {
    if (!outputHtml) return;
    navigator.clipboard.writeText(outputHtml);
    toast({
      title: 'Minified HTML copied to clipboard!',
    });
  };

  const handleClear = () => {
    setInputHtml('');
    setOutputHtml('');
    setOriginalSize(null);
    setMinifiedSize(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = () => {
    if (!outputHtml) return;
    const blob = new Blob([outputHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.html$/, '') + '.min.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setInputHtml(content);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>HTML Minifier</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Optimize your website by reducing the size of your HTML files. This tool removes unnecessary characters without affecting functionality.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Import or Paste HTML:</strong> Upload a file, or paste your code into the "Input HTML" field.</li>
              <li><strong>Minify:</strong> Click the "Minify HTML" button to compress the code.</li>
              <li><strong>Review & Download:</strong> Check the size savings, copy the result, or download it as a new .html file.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">Input HTML</h3>
                {originalSize !== null && <span className="text-sm font-medium">Size: {formatBytes(originalSize)}</span>}
            </div>
            <Textarea
              value={inputHtml}
              onChange={(e) => setInputHtml(e.target.value)}
              placeholder="<!-- Your HTML code here -->"
              className="min-h-[300px] text-sm font-mono flex-grow"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Minified Output</h3>
              {minifiedSize !== null && (
                 <span className="text-sm font-medium">
                    Size: {formatBytes(minifiedSize)} 
                    {originalSize !== null && <span className="text-green-600 dark:text-green-400"> ({(((originalSize - minifiedSize) / originalSize) * 100).toFixed(2)}% smaller)</span>}
                 </span>
              )}
            </div>
            <div className="relative flex-grow">
              <Textarea
                readOnly
                value={outputHtml}
                placeholder="<!-- Minified HTML will appear here -->"
                className="min-h-[300px] text-sm font-mono bg-muted flex-grow"
              />
              {outputHtml && (
                <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopy}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy output</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download HTML</span>
                    </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center border-t pt-4">
          <Button onClick={handleMinify} disabled={!inputHtml || isMinifying}>
            {isMinifying ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            Minify HTML
          </Button>
           <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Import HTML File
              <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  accept=".html"
                  className="hidden"
              />
          </Button>
          <Button onClick={handleClear} variant="outline" disabled={!inputHtml && !outputHtml}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear All
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
