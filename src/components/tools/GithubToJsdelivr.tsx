'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Copy, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';

export default function GithubToJsdelivr() {
  const [githubUrl, setGithubUrl] = useState('https://github.com/jquery/jquery/blob/main/src/core.js');
  const { toast } = useToast();

  const jsdelivrUrl = useMemo(() => {
    if (!githubUrl.trim()) return '';

    try {
      const url = new URL(githubUrl);
      if (url.hostname !== 'github.com') {
        return 'Invalid GitHub URL';
      }

      const pathParts = url.pathname.split('/').filter(p => p);
      if (pathParts.length < 3) {
        return 'Invalid URL format';
      }

      const [user, repo, blob, branch, ...filePath] = pathParts;

      if (blob !== 'blob') {
          // Handle cases without /blob/, assuming direct path
          const [user, repo, ...filePathNoBlob] = pathParts;
          if (!user || !repo || filePathNoBlob.length === 0) return 'Invalid URL format';
          return `https://cdn.jsdelivr.net/gh/${user}/${repo}/${filePathNoBlob.join('/')}`;
      }

      if (!user || !repo || !branch || filePath.length === 0) {
        return 'Invalid URL format';
      }

      return `https://cdn.jsdelivr.net/gh/${user}/${repo}@${branch}/${filePath.join('/')}`;
    } catch (error) {
      return 'Invalid URL';
    }
  }, [githubUrl]);

  const handleCopy = () => {
    if (!jsdelivrUrl || jsdelivrUrl.startsWith('Invalid')) return;
    navigator.clipboard.writeText(jsdelivrUrl);
    toast({
      title: 'jsDelivr URL copied!',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub to jsDelivr Converter</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Convert GitHub file URLs to fast jsDelivr CDN links instantly. Perfect for including raw files in your projects.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Paste GitHub URL:</strong> Enter the full URL of a file on GitHub.</li>
              <li><strong>Get CDN Link:</strong> The jsDelivr link will be generated automatically.</li>
              <li><strong>Copy and Use:</strong> Click the copy button to use the link in your projects.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="github-url">GitHub File URL</Label>
            <Input
                id="github-url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/user/repo/blob/main/file.js"
                className="font-mono"
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="jsdelivr-url">jsDelivr CDN URL</Label>
            <div className="flex gap-2">
                <Input
                    id="jsdelivr-url"
                    readOnly
                    value={jsdelivrUrl}
                    placeholder="CDN link will appear here..."
                    className="font-mono bg-muted"
                />
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleCopy} 
                    disabled={!jsdelivrUrl || jsdelivrUrl.startsWith('Invalid')}
                >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy jsDelivr URL</span>
                </Button>
            </div>
        </div>
        {jsdelivrUrl && !jsdelivrUrl.startsWith('Invalid') && (
             <div className="text-center">
                <Button asChild variant="link">
                   <a href={jsdelivrUrl} target="_blank" rel="noopener noreferrer">
                        Test Link <LinkIcon className="ml-2 h-4 w-4" />
                   </a>
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
