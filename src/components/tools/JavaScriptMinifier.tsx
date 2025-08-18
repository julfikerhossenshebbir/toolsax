'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Copy, Trash2, ArrowRight, Loader2, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { minifyJsAction } from './JavaScriptMinifier/actions';

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


export default function JavaScriptMinifier() {
  const [inputJs, setInputJs] = useState('// Example JavaScript\nfunction hello(name) {\n  // This is a comment\n  const message = `Hello, ${name}!`;\n  console.log(message); // Print the message\n}\n\nhello("World");');
  const [outputJs, setOutputJs] = useState('');
  const [isMinifying, setIsMinifying] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [minifiedSize, setMinifiedSize] = useState<number | null>(null);
  const [fileName, setFileName] = useState('minified.js');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleMinify = async () => {
    if (!inputJs.trim()) {
      setOutputJs('');
      setOriginalSize(null);
      setMinifiedSize(null);
      return;
    }

    setIsMinifying(true);
    try {
      const result = await minifyJsAction(inputJs);
      if (result.success && result.minifiedJs) {
        const creditComment = '/* Minified by Toolsax */';
        const finalOutput = `${creditComment}\n${result.minifiedJs}`;

        setOutputJs(finalOutput);
        
        const originalBlobSize = new Blob([inputJs]).size;
        const minifiedBlobSize = new Blob([finalOutput]).size;
        setOriginalSize(originalBlobSize);
        setMinifiedSize(minifiedBlobSize);
        
        const rawMinifiedSize = new Blob([result.minifiedJs]).size;
        const reduction = ((originalBlobSize - rawMinifiedSize) / originalBlobSize) * 100;
        
        toast({
          title: 'JavaScript Minified!',
          description: `Size reduced by ${reduction > 0 ? reduction.toFixed(2) : 0}%.`,
        });
      } else {
        throw new Error(result.error || 'Minification failed');
      }
    } catch (error: any) {
      setOutputJs('');
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
    if (!outputJs) return;
    navigator.clipboard.writeText(outputJs);
    toast({
      title: 'Minified JS copied to clipboard!',
    });
  };

  const handleClear = () => {
    setInputJs('');
    setOutputJs('');
    setOriginalSize(null);
    setMinifiedSize(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = () => {
    if (!outputJs) return;
    const blob = new Blob([outputJs], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.js$/, '') + '.min.js';
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
        setInputJs(content);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>JavaScript Minifier</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Optimize your website by reducing the size of your JavaScript files. This tool removes unnecessary characters without affecting functionality.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Import or Paste JS:</strong> Upload a file, or paste your code into the "Input JavaScript" field.</li>
              <li><strong>Minify:</strong> Click the "Minify JavaScript" button to compress the code.</li>
              <li><strong>Review & Download:</strong> Check the size savings, copy the result, or download it as a new .js file.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">Input JavaScript</h3>
                {originalSize !== null && <span className="text-sm font-medium">Size: {formatBytes(originalSize)}</span>}
            </div>
            <Textarea
              value={inputJs}
              onChange={(e) => setInputJs(e.target.value)}
              placeholder="// Your JS code here"
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
                value={outputJs}
                placeholder="// Minified JavaScript will appear here"
                className="min-h-[300px] text-sm font-mono bg-muted flex-grow"
              />
              {outputJs && (
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
                      <span className="sr-only">Download JS</span>
                    </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <Button onClick={handleMinify} disabled={!inputJs || isMinifying}>
            {isMinifying ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            Minify JavaScript
          </Button>
           <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Import JS File
              <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  accept=".js,.jsx,.ts,.tsx"
                  className="hidden"
              />
          </Button>
          <Button onClick={handleClear} variant="outline" disabled={!inputJs && !outputJs}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear All
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
