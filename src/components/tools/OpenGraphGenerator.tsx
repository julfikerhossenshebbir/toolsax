
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function OpenGraphGenerator() {
  const [siteName, setSiteName] = useState('Toolsax');
  const [title, setTitle] = useState('My Awesome Page');
  const [description, setDescription] = useState('A fantastic description of my page.');
  const [pageUrl, setPageUrl] = useState('https://toolsax.com/my-awesome-page');
  const [imageUrl, setImageUrl] = useState('https://toolsax.com/og-image.png');
  const [type, setType] = useState('website');
  const [generatedTags, setGeneratedTags] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const tags = `
<meta property="og:site_name" content="${siteName}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${pageUrl}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:type" content="${type}">
<!-- For Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${imageUrl}">
    `.trim();
    setGeneratedTags(tags);
  }, [siteName, title, description, pageUrl, imageUrl, type]);

  const handleCopy = () => {
    if (!generatedTags) return;
    navigator.clipboard.writeText(generatedTags);
    toast({
      title: 'Open Graph tags copied!',
    });
  };

  const handleReset = () => {
    setSiteName('Toolsax');
    setTitle('My Awesome Page');
    setDescription('A fantastic description of my page.');
    setPageUrl('https://toolsax.com/my-awesome-page');
    setImageUrl('https://toolsax.com/og-image.png');
    setType('website');
    toast({
        title: 'Form Reset',
        description: 'All fields have been reset to default values.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Open Graph Generator</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Generate Open Graph meta tags to control how your content appears when shared on social media. Fill in the form and the code will update in real-time.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Complete the fields:</strong> Provide details about your page for social sharing.</li>
              <li><strong>Review the tags:</strong> The generated HTML tags will appear in the code block.</li>
              <li><strong>Copy and paste:</strong> Click the copy button and add the code to the &lt;head&gt; section of your website.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Your Website's Name" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title of the page" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description of your page." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pageUrl">Page URL</Label>
            <Input id="pageUrl" type="url" value={pageUrl} onChange={(e) => setPageUrl(e.target.value)} placeholder="https://your-website.com/page" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://your-website.com/image.png" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="profile">Profile</SelectItem>
                    <SelectItem value="video.movie">Movie</SelectItem>
                </SelectContent>
            </Select>
          </div>
           <Button onClick={handleReset} variant="outline" className="w-full">
            <Trash2 className="mr-2 h-4 w-4" /> Reset Form
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-semibold">Generated Tags</Label>
            <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!generatedTags}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative bg-muted rounded-md p-0">
            <SyntaxHighlighter language="markup" style={oneLight} customStyle={{ borderRadius: '0.5rem', margin: 0, padding: '1rem', backgroundColor: 'var(--card-background, white)' }}>
              {generatedTags}
            </SyntaxHighlighter>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
