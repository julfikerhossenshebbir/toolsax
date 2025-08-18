'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Copy, Trash2, ArrowDown, ArrowUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Helper function to handle UTF-8 characters correctly
function utf8_to_b64(str: string) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str: string) {
    return decodeURIComponent(escape(window.atob(str)));
}

export default function Base64Encoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleEncode = () => {
    if (!input) return;
    try {
      setOutput(utf8_to_b64(input));
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Encoding Error',
        description: 'The input string could not be encoded.',
      });
    }
  };

  const handleDecode = () => {
    if (!input) return;
    try {
      setOutput(b64_to_utf8(input));
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Decoding Error',
        description: 'The input is not a valid Base64 string.',
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
        <CardTitle>Base64 Encoder & Decoder</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Encode your data into Base64 format or decode a Base64 string back to its original form. This tool fully supports UTF-8 characters.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Enter Text:</strong> Paste your text or Base64 string into the input field.</li>
              <li><strong>Choose Action:</strong> Click "Encode" to convert to Base64 or "Decode" to revert to text.</li>
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
                placeholder="Type or paste your text here..."
                className="min-h-[150px] text-base font-mono"
                />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
                <Button onClick={handleEncode} disabled={!input}>
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Encode
                </Button>
                <Button onClick={handleDecode} disabled={!input}>
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Decode
                </Button>
                <Button onClick={handleClear} variant="outline" disabled={!input && !output}>
                    <Trash2 className="mr-2 h-4 w-4" /> Clear
                </Button>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Output</h3>
                <div className="relative">
                <Textarea
                    readOnly
                    value={output}
                    placeholder="Output will appear here"
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
      </CardContent>
    </Card>
  );
}
