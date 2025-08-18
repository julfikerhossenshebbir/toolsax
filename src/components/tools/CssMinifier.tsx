'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Copy, Trash2, ArrowRight, Loader2, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { minifyCssAction } from './CssMinifier/actions';

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


export default function CssMinifier() {
  const [inputCss, setInputCss] = useState('/* Example CSS */\nbody {\n  font-family: Arial, sans-serif;\n  line-height: 1.6;\n  background-color: #f0f0f0; /* light gray */\n}\n\nh1 {\n  color: #333333;\n}');
  const [outputCss, setOutputCss] = useState('');
  const [isMinifying, setIsMinifying] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [minifiedSize, setMinifiedSize] = useState<number | null>(null);
  const [fileName, setFileName] = useState('minified.css');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleMinify = async () => {
    if (!inputCss.trim()) {
      setOutputCss('');
      setOriginalSize(null);
      setMinifiedSize(null);
      return;
    }

    setIsMinifying(true);
    try {
      const result = await minifyCssAction(inputCss);
      if (result.success && result.minifiedCss) {
        const creditComment = '/* Minified by Toolsax */';
        const finalOutput = `${creditComment}\n${result.minifiedCss}`;

        setOutputCss(finalOutput);
        
        const originalBlobSize = new Blob([inputCss]).size;
        const minifiedBlobSize = new Blob([finalOutput]).size;
        setOriginalSize(originalBlobSize);
        setMinifiedSize(minifiedBlobSize);
        
        const rawMinifiedSize = new Blob([result.minifiedCss]).size;
        const reduction = ((originalBlobSize - rawMinifiedSize) / originalBlobSize) * 100;
        
        toast({
          title: 'CSS Minified!',
          description: `Size reduced by ${reduction > 0 ? reduction.toFixed(2) : 0}%.`,
        });
      } else {
        throw new Error(result.error || 'Minification failed');
      }
    } catch (error: any) {
      setOutputCss('');
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
    if (!outputCss) return;
    navigator.clipboard.writeText(outputCss);
    toast({
      title: 'Minified CSS copied to clipboard!',
    });
  };

  const handleClear = () => {
    setInputCss('');
    setOutputCss('');
    setOriginalSize(null);
    setMinifiedSize(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = () => {
    if (!outputCss) return;
    const blob = new Blob([outputCss], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.css$/, '') + '.min.css';
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
        setInputCss(content);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CSS Minifier</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Optimize your website by reducing the size of your CSS files. This tool removes unnecessary characters without affecting functionality.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Import or Paste CSS:</strong> Upload a file, or paste your code into the "Input CSS" field.</li>
              <li><strong>Minify:</strong> Click the "Minify CSS" button to compress the code.</li>
              <li><strong>Review & Download:</strong> Check the size savings, copy the result, or download it as a new .css file.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">Input CSS</h3>
                {originalSize !== null && <span className="text-sm font-medium">Size: {formatBytes(originalSize)}</span>}
            </div>
            <Textarea
              value={inputCss}
              onChange={(e) => setInputCss(e.target.value)}
              placeholder="/* Your CSS code here */"
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
                value={outputCss}
                placeholder="/* Minified CSS will appear here */"
                className="min-h-[300px] text-sm font-mono bg-muted flex-grow"
              />
              {outputCss && (
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
                      <span className="sr-only">Download CSS</span>
                    </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <Button onClick={handleMinify} disabled={!inputCss || isMinifying}>
            {isMinifying ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            Minify CSS
          </Button>
           <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Import CSS File
              <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  accept=".css"
                  className="hidden"
              />
          </Button>
          <Button onClick={handleClear} variant="outline" disabled={!inputCss && !outputCss}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear All
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
