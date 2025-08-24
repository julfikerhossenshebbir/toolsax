
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Download, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateAudioAction } from './TextToSpeech/actions';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const voices = [
    // English (US)
    { name: 'Alloy (Male)', value: 'Alloy' },
    { name: 'Echo (Male)', value: 'Echo' },
    { name: 'Fable (Male)', value: 'Fable' },
    { name: 'Onyx (Male)', value: 'Onyx' },
    { name: 'Nova (Female)', value: 'Nova' },
    { name: 'Shimmer (Female)', value: 'Shimmer' },
    // English (UK)
    { name: 'Luna (Female, UK)', value: 'en-GB-Standard-A' },
    { name: 'Aria (Female, UK)', value: 'en-GB-News-G' },
    { name: 'Leo (Male, UK)', value: 'en-GB-News-H' },
    // Bengali (India)
    { name: 'Anjali (Female, Bengali)', value: 'bn-IN-Standard-A' },
    { name: 'Kabir (Male, Bengali)', value: 'bn-IN-Standard-B' },
    // Hindi (India)
    { name: 'Aditi (Female, Hindi)', value: 'hi-IN-Standard-A' },
    { name: 'Arun (Male, Hindi)', value: 'hi-IN-Standard-B' },
];


export default function TextToSpeech() {
  const [text, setText] = useState('Hello world! This is the AI-powered Text to Speech tool from Toolsax.');
  const [selectedVoice, setSelectedVoice] = useState(voices[0].value);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please enter some text to generate audio.',
      });
      return;
    }

    setIsGenerating(true);
    setAudioUrl(null);
    try {
      const result = await generateAudioAction(text, selectedVoice);
      if (result.success && result.audioDataUri) {
        setAudioUrl(result.audioDataUri);
        toast({ title: 'Audio Generated Successfully!' });
      } else {
        throw new Error(result.error || 'Failed to generate audio.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text to Speech (AI-Powered)</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Convert your text into lifelike speech using advanced AI. Choose from a variety of voices and languages.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Enter Text:</strong> Type or paste the text you want to hear.</li>
              <li><strong>Choose a Voice:</strong> Select a voice from the dropdown menu.</li>
              <li><strong>Generate Audio:</strong> Click the "Generate Audio" button.</li>
              <li><strong>Listen & Download:</strong> Use the audio player to listen, or click the download button to save the file.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
         <div className="space-y-2">
            <Label htmlFor="voice-select">Voice</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger id="voice-select" className="w-full md:w-1/2">
                    <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                    {voices.map((v) => (
                        <SelectItem key={v.value} value={v.value}>{v.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="text-input">Your Text</Label>
          <Textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="min-h-[150px] text-base"
          />
        </div>
        <div className="text-center">
            <Button onClick={handleGenerate} disabled={isGenerating} size="lg">
                {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Volume2 className="mr-2 h-5 w-5" />}
                {isGenerating ? 'Generating...' : 'Generate Audio'}
            </Button>
        </div>
        
        {audioUrl && (
          <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-muted">
            <audio controls src={audioUrl}>
              Your browser does not support the audio element.
            </audio>
            <Button asChild variant="outline">
              <a href={audioUrl} download="toolsax-speech.wav">
                <Download className="mr-2 h-4 w-4" /> Download WAV
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
