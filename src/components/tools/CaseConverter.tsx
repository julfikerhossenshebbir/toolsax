"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      </CardHeader>
      <CardContent>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="min-h-[200px] text-base"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={toSentenceCase}>Sentence case</Button>
          <Button onClick={toLowerCase}>lower case</Button>
          <Button onClick={toUpperCase}>UPPER CASE</Button>
          <Button onClick={toCapitalizedCase}>Capitalized Case</Button>
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
