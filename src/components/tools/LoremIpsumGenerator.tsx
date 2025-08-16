'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Copy, Trash2, Pilcrow } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LOREM_IPSUM_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(5);
  const [generatedText, setGeneratedText] = useState('');
  const { toast } = useToast();

  const handleGenerate = () => {
    if (paragraphs <= 0) {
        toast({
            variant: 'destructive',
            title: 'Invalid Number',
            description: 'Please enter a number greater than 0.',
        });
        return;
    }
    const result = Array(paragraphs).fill(LOREM_IPSUM_TEXT).join('\n\n');
    setGeneratedText(result);
  };

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    toast({
      title: 'Copied to clipboard!',
    });
  };
  
  const handleClear = () => {
      setGeneratedText('');
      setParagraphs(5);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lorem Ipsum Generator</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Quickly generate placeholder text for your design mockups, wireframes, or development projects. Follow these simple steps:</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Set the Amount:</strong> Enter the number of paragraphs you need in the "Number of Paragraphs" input field.</li>
              <li><strong>Generate Text:</strong> Click the "Generate" button. The placeholder text will appear in the text area below.</li>
              <li><strong>Copy or Clear:</strong> Use the copy icon to copy the generated text to your clipboard. Use the trash icon to clear the output and start over.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-grow space-y-2">
                <Label htmlFor="paragraphs">Number of Paragraphs</Label>
                <Input
                    id="paragraphs"
                    type="number"
                    value={paragraphs}
                    onChange={(e) => setParagraphs(Number(e.target.value))}
                    min="1"
                    className="max-w-xs"
                />
            </div>
            <div className="flex items-end">
                <Button onClick={handleGenerate}>
                    <Pilcrow className="mr-2 h-4 w-4" />
                    Generate
                </Button>
            </div>
        </div>
        
        <div className="relative">
            <Textarea
              readOnly
              value={generatedText}
              placeholder="Your generated Lorem Ipsum text will appear here..."
              className="min-h-[250px] text-base bg-muted"
            />
            {generatedText && (
                <div className="absolute top-2 right-2 flex gap-1">
                    <Button variant="ghost" size="icon" onClick={handleCopy}>
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy text</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleClear}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Clear text</span>
                    </Button>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
