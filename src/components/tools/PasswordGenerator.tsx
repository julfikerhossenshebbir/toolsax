'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const { toast } = useToast();

  const generatePassword = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let charset = '';
    if (includeUppercase) charset += upper;
    if (includeLowercase) charset += lower;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset === '') {
      toast({
        title: 'Error',
        description: 'Please select at least one character type.',
        variant: 'destructive',
      });
      setPassword('');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
  };

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast({
      title: 'Password copied to clipboard!',
    });
  };
  
  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password Generator</CardTitle>
        <CardDescription>
            <div className="space-y-2">
                <p>Create strong, unique passwords to protect your online accounts. Here’s how to use the generator:</p>
                <ol className="list-decimal list-inside space-y-1 pl-4">
                    <li><strong>Instant Generation:</strong> A secure password is automatically generated for you as soon as you load the page.</li>
                    <li><strong>Customize Length:</strong> Drag the slider to set the desired password length, from 8 to 64 characters. The password will update in real-time.</li>
                    <li><strong>Set Character Types:</strong> Use the switches to include or exclude Uppercase letters, Lowercase letters, Numbers, and Symbols. The password will regenerate with each change to meet your security requirements.</li>
                    <li><strong>Generate a New Password:</strong> If you're not happy with the current password, click the refresh icon to generate a new one with your selected settings.</li>
                    <li><strong>Copy Your Password:</strong> Once you have a password you're satisfied with, click the copy icon to instantly save it to your clipboard.</li>
                </ol>
            </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            readOnly
            value={password}
            placeholder="Your generated password"
            className="text-lg font-mono"
          />
          <Button variant="outline" size="icon" onClick={handleCopy} disabled={!password}>
            <Copy className="h-5 w-5" />
          </Button>
          <Button size="icon" onClick={generatePassword}>
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="length">Password Length</Label>
              <span className="font-semibold text-foreground">{length}</span>
            </div>
            <Slider
              id="length"
              min={8}
              max={64}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
              <Label htmlFor="uppercase">Uppercase</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
              <Label htmlFor="lowercase">Lowercase</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
              <Label htmlFor="numbers">Numbers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
              <Label htmlFor="symbols">Symbols</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
