
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Copy, Trash2, ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UrlEncoderDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleEncode = () => {
    try {
      setOutput(encodeURIComponent(input));
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Encoding Error',
        description: 'The input string could not be encoded.',
      });
    }
  };

  const handleDecode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Decoding Error',
        description: 'The input string is not a valid encoded URI component.',
      });
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({
      title: 'Copied to clipboard!',
    });
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>URL Encoder & Decoder</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Easily encode or decode URLs to ensure they are safe to use in web addresses. Special characters are replaced with their percent-encoded equivalents.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Enter Text:</strong> Paste your URL or text into the input field.</li>
              <li><strong>Choose Action:</strong> Click "Encode" to convert special characters to their URL-safe format (e.g., `%20` for a space) or "Decode" to convert them back to their original form.</li>
              <li><strong>Get Result:</strong> The converted text will appear in the output field.</li>
              <li><strong>Copy or Clear:</strong> Use the copy button to copy the output, or clear both fields to start over.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Input</h3>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., https://example.com/search?q=hello world"
              className="min-h-[150px] text-base font-mono"
            />
          </div>
          <div>
             <h3 className="font-semibold mb-2">Output</h3>
            <div className="relative">
              <Textarea
                readOnly
                value={output}
                placeholder="Encoded or decoded output will appear here"
                className="min-h-[150px] text-base font-mono bg-muted"
              />
               {output && (
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

        <div className="flex flex-wrap gap-2 justify-center pt-4 border-t">
          <Button onClick={handleEncode} disabled={!input}>
            Encode
          </Button>
          <Button onClick={handleDecode} disabled={!input}>
            Decode
          </Button>
          <Button onClick={handleClear} variant="outline" disabled={!input && !output}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
