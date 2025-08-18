'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Copy, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { minifyHtmlAction } from './HtmlMinifier/actions';

export default function HtmlMinifier() {
  const [inputHtml, setInputHtml] = useState('<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n\n  <!-- This is a comment -->\n  <h1>Hello,     World!</h1>\n\n</body>\n</html>');
  const [outputHtml, setOutputHtml] = useState('');
  const [isMinifying, setIsMinifying] = useState(false);
  const { toast } = useToast();

  const handleMinify = async () => {
    if (!inputHtml.trim()) {
      setOutputHtml('');
      return;
    }

    setIsMinifying(true);
    try {
      const result = await minifyHtmlAction(inputHtml);
      if (result.success && result.minifiedHtml) {
        setOutputHtml(result.minifiedHtml);
        const originalSize = new Blob([inputHtml]).size;
        const minifiedSize = new Blob([result.minifiedHtml]).size;
        const reduction = ((originalSize - minifiedSize) / originalSize) * 100;
        
        toast({
          title: 'HTML Minified!',
          description: `Size reduced by ${reduction.toFixed(2)}%.`,
        });
      } else {
        throw new Error(result.error || 'Minification failed');
      }
    } catch (error: any) {
      setOutputHtml('');
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>HTML Minifier</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Optimize your website by reducing the size of your HTML files. This tool removes unnecessary characters without affecting functionality.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Paste HTML:</strong> Enter your code into the "Input HTML" field.</li>
              <li><strong>Minify:</strong> Click the "Minify HTML" button to compress the code.</li>
              <li><strong>Copy Result:</strong> Use the copy icon to copy the optimized HTML from the "Output" field.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Input HTML</h3>
            <Textarea
              value={inputHtml}
              onChange={(e) => setInputHtml(e.target.value)}
              placeholder="<!-- Your HTML code here -->"
              className="min-h-[300px] text-sm font-mono flex-grow"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Minified Output</h3>
            <div className="relative flex-grow">
              <Textarea
                readOnly
                value={outputHtml}
                placeholder="<!-- Minified HTML will appear here -->"
                className="min-h-[300px] text-sm font-mono bg-muted flex-grow"
              />
              {outputHtml && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="absolute top-2 right-2 h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy output</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 justify-center border-t pt-4">
          <Button onClick={handleMinify} disabled={!inputHtml || isMinifying}>
            {isMinifying ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            Minify HTML
          </Button>
          <Button onClick={handleClear} variant="outline" disabled={!inputHtml && !outputHtml}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
