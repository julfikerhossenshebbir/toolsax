'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function WordCounter() {
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

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(Boolean).length;
  const characterCount = text.length;
  const sentenceCount = text.trim() === '' ? 0 : (text.match(/[.!?]+(\s+|$)/g)?.length || (wordCount > 0 ? 1 : 0));


  return (
    <Card>
      <CardHeader>
        <CardTitle>Word Counter</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Instantly count words, characters, and sentences in your text. This tool is perfect for writers, students, and professionals who need to meet specific length requirements. Here's how to use it:</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Enter Your Text:</strong> Type or paste your content into the text area below.</li>
              <li><strong>See Live Counts:</strong> The word, character, and sentence counts will update in real-time as you type.</li>
              <li><strong>Manage Your Text:</strong> Use the copy icon to save the text to your clipboard, or the trash icon to clear the area and start over.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="min-h-[250px] text-base"
        />
        <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <span className="font-medium">Words: <span className="font-bold text-primary">{wordCount}</span></span>
                <span className="font-medium">Characters: <span className="font-bold text-primary">{characterCount}</span></span>
                <span className="font-medium">Sentences: <span className="font-bold text-primary">{sentenceCount}</span></span>
            </div>
            <div>
                <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!text}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy text</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleClear} disabled={!text}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Clear text</span>
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
