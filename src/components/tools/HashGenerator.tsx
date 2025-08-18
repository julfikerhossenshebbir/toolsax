'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CryptoJS from 'crypto-js';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const { toast } = useToast();

  const hashes = useMemo(() => {
    if (!input) {
      return { md5: '', sha1: '', sha256: '', sha512: '' };
    }
    return {
      md5: CryptoJS.MD5(input).toString(),
      sha1: CryptoJS.SHA1(input).toString(),
      sha256: CryptoJS.SHA256(input).toString(),
      sha512: CryptoJS.SHA512(input).toString(),
    };
  }, [input]);

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
    });
  };

  const handleClear = () => {
    setInput('');
  };

  const HashOutput = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase()}>{label}</Label>
      <div className="flex gap-2">
        <Input
          id={label.toLowerCase()}
          readOnly
          value={value}
          className="font-mono text-sm bg-muted"
          placeholder={`${label} hash will appear here...`}
        />
        <Button variant="outline" size="icon" onClick={() => handleCopy(value)} disabled={!value}>
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy {label}</span>
        </Button>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hash Generator</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Generate various cryptographic hashes from your text instantly. Hashes are calculated in real-time as you type.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Enter Text:</strong> Type or paste any text into the input field below.</li>
              <li><strong>Live Hashes:</strong> The MD5, SHA-1, SHA-256, and SHA-512 hashes will be generated automatically.</li>
              <li><strong>Copy a Hash:</strong> Click the copy icon next to any hash to copy it to your clipboard.</li>
              <li><strong>Clear:</strong> Use the "Clear" button to reset the input field.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="input-text" className="font-semibold text-base">Input Text</Label>
          <Textarea
            id="input-text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste your text here to generate hashes..."
            className="min-h-[150px] text-base mt-2"
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={handleClear} variant="outline" disabled={!input}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear Input
            </Button>
          </div>
        </div>

        <div className="space-y-4">
            <HashOutput label="MD5" value={hashes.md5} />
            <HashOutput label="SHA-1" value={hashes.sha1} />
            <HashOutput label="SHA-256" value={hashes.sha256} />
            <HashOutput label="SHA-512" value={hashes.sha512} />
        </div>
      </CardContent>
    </Card>
  );
}
