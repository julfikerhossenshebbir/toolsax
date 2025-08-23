
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Copy, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function HtmlEntityConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleEncode = () => {
    if (!input) return;
    try {
      const element = document.createElement('div');
      element.innerText = input;
      setOutput(element.innerHTML);
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
      const element = document.createElement('textarea');
      element.innerHTML = input;
      setOutput(element.value);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Decoding Error',
        description: 'The input is not a valid HTML entity string.',
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
        <CardTitle>HTML Entity Converter</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Convert text to HTML entities and vice versa. This is useful for displaying code snippets or preventing HTML rendering.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Enter Text or Entities:</strong> Paste your text or HTML entities into the input field.</li>
              <li><strong>Choose Action:</strong> Click "Encode" to convert text to entities or "Decode" to convert entities back to text.</li>
              <li><strong>Get Result:</strong> The converted content will appear in the output field.</li>
              <li><strong>Copy or Clear:</strong> Use the copy button to grab the output, or clear both fields to start over.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="font-semibold mb-2">Input</h3>
                <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., <h1>Hello World</h1> or &lt;h1&gt;Hello World&lt;/h1&gt;"
                className="min-h-[200px] text-base font-mono"
                />
            </div>

            <div>
                <h3 className="font-semibold mb-2">Output</h3>
                <div className="relative">
                <Textarea
                    readOnly
                    value={output}
                    placeholder="Output will appear here"
                    className="min-h-[200px] text-base font-mono bg-muted"
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
            <ArrowRight className="mr-2 h-4 w-4" />
            Encode
          </Button>
          <Button onClick={handleDecode} disabled={!input}>
            <ArrowLeft className="mr-2 h-4 w-4" />
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
