'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CaseConverter() {
  const [text, setText] = useState('');
  const { toast } = useToast();

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
    });
  };
  
  const handleClear = () => setText('');

  const toSentenceCase = () => {
    if (!text) return;
    const lower = text.toLowerCase();
    const result = lower.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    setText(result);
  };
  
  const toLowerCase = () => setText(text.toLowerCase());
  const toUpperCase = () => setText(text.toUpperCase());
  const toCapitalizedCase = () => {
    if (!text) return;
    const result = text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    setText(result);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Converter</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Easily transform your text into different case formats with just a few clicks. Follow these simple steps to use the tool:</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Enter Your Text:</strong> Type or paste the text you want to convert into the text area below.</li>
              <li><strong>Choose a Case:</strong> Click one of the buttons for your desired format:
                <ul className="list-disc list-inside pl-6">
                  <li><strong>Sentence case:</strong> Converts the text so the first letter of each sentence is capitalized.</li>
                  <li><strong>lower case:</strong> Transforms all characters into lowercase.</li>
                  <li><strong>UPPER CASE:</strong> Transforms all characters into uppercase.</li>
                  <li><strong>Capitalized Case:</strong> Capitalizes the first letter of every word.</li>
                </ul>
              </li>
              <li><strong>View the Result:</strong> The text in the box will instantly update with the new formatting.</li>
              <li><strong>Manage Your Text:</strong> Use the copy icon to copy the result to your clipboard, or the trash icon to clear the text area. You can also monitor the character and word count at the bottom.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="min-h-[200px] text-base"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={toSentenceCase} variant="outline">Sentence case</Button>
          <Button onClick={toLowerCase} variant="outline">lower case</Button>
          <Button onClick={toUpperCase} variant="outline">UPPER CASE</Button>
          <Button onClick={toCapitalizedCase} variant="outline">Capitalized Case</Button>
        </div>
        <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="text-sm text-muted-foreground">
                Character Count: {text.length} | Word Count: {text.trim().split(/\s+/).filter(Boolean).length}
            </div>
            <div>
                <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!text}>
                    <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleClear} disabled={!text}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
