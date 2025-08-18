
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MetaTagGenerator() {
  const [title, setTitle] = useState('My Awesome Website');
  const [description, setDescription] = useState('A brief description of my awesome website.');
  const [keywords, setKeywords] = useState('web tools, online, free');
  const [author, setAuthor] = useState('Toolsax');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');
  const [robots, setRobots] = useState('index, follow');
  const [generatedTags, setGeneratedTags] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const tags = `
<meta charset="UTF-8">
<meta name="viewport" content="${viewport}">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
<meta name="author" content="${author}">
<meta name="robots" content="${robots}">
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://your-website.com/">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="https://your-website.com/image.png">
<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://your-website.com/">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="https://your-website.com/image.png">
    `.trim();
    setGeneratedTags(tags);
  }, [title, description, keywords, author, viewport, robots]);

  const handleCopy = () => {
    if (!generatedTags) return;
    navigator.clipboard.writeText(generatedTags);
    toast({
      title: 'Meta tags copied to clipboard!',
    });
  };

  const handleReset = () => {
    setTitle('My Awesome Website');
    setDescription('A brief description of my awesome website.');
    setKeywords('web tools, online, free');
    setAuthor('Toolsax');
    setViewport('width=device-width, initial-scale=1.0');
    setRobots('index, follow');
    toast({
        title: 'Form Reset',
        description: 'All fields have been reset to their default values.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meta Tag Generator</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Generate essential HTML meta tags for SEO and social sharing. Fill out the form below, and the code will be generated in real-time.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Fill in the details:</strong> Provide your site's title, description, keywords, and author.</li>
              <li><strong>Review the code:</strong> The generated HTML meta tags will appear in the code block.</li>
              <li><strong>Copy and paste:</strong> Click the copy button and paste the code into the &lt;head&gt; section of your HTML document.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your Website Title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description of your site." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="keyword1, keyword2, keyword3" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your Name or Company" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="viewport">Viewport</Label>
                <Input id="viewport" value={viewport} onChange={(e) => setViewport(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="robots">Robots</Label>
                <Input id="robots" value={robots} onChange={(e) => setRobots(e.target.value)} />
            </div>
          </div>
           <Button onClick={handleReset} variant="outline" className="w-full">
            <Trash2 className="mr-2 h-4 w-4" /> Reset Form
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-semibold">Generated Meta Tags</Label>
            <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!generatedTags}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <SyntaxHighlighter language="markup" style={atomDark} customStyle={{ borderRadius: '0.5rem', margin: 0 }}>
              {generatedTags}
            </SyntaxHighlighter>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
