'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SlugGenerator() {
  const [text, setText] = useState('Hello World! This is an example title.');
  const { toast } = useToast();

  const generatedSlug = useMemo(() => {
    if (!text) return '';

    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
  }, [text]);

  const handleCopy = () => {
    if (!generatedSlug) return;
    navigator.clipboard.writeText(generatedSlug);
    toast({
      title: 'Slug copied to clipboard!',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Slug Generator</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Create clean, SEO-friendly URL slugs from your text or titles. Slugs are the part of a URL that identifies a specific page in a human-readable form.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Enter Your Text:</strong> Type or paste the title or phrase you want to convert into the input area.</li>
              <li><strong>Live Generation:</strong> The URL-friendly slug will be generated in real-time as you type.</li>
              <li><strong>Copy the Slug:</strong> Click the copy button to easily use the slug in your website's URLs.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
            <label htmlFor="input-text" className="font-semibold mb-2 block">Input Text</label>
            <Textarea
                id="input-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your title or text here..."
                className="min-h-[150px] text-base"
            />
        </div>
        <div>
            <label htmlFor="output-slug" className="font-semibold mb-2 block">Generated Slug</label>
            <div className="flex gap-2">
                <Input
                    id="output-slug"
                    readOnly
                    value={generatedSlug}
                    placeholder="your-generated-slug-will-appear-here"
                    className="font-mono text-base bg-muted"
                />
                <Button variant="outline" size="icon" onClick={handleCopy} disabled={!generatedSlug}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy Slug</span>
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
