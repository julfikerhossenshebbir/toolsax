
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Volume2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateAudioAction } from './TextToSpeech/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const voices = [
  { value: 'en-US-Standard-A', label: 'Female Voice 1' },
  { value: 'en-US-Standard-B', label: 'Male Voice 1' },
  { value: 'en-US-Standard-C', label: 'Female Voice 2' },
  { value: 'en-US-Standard-D', label: 'Male Voice 2' },
  { value: 'en-US-Standard-E', label: 'Female Voice 3 (Export)' },
  { value: 'en-US-Standard-F', label: 'Male Voice 3' },
  { value: 'en-US-Standard-G', label: 'Female Voice 4' },
  { value: 'en-US-Standard-H', label: 'Female Voice 5 (Export)' },
  { value: 'en-US-Standard-I', label: 'Male Voice 4 (Export)' },
  { value: 'en-US-Standard-J', label: 'Male Voice 5 (Export)' },
  { value: 'Algenib', label: 'Female Voice 6' },
  { value: 'Achernar', label: 'Male Voice 6' },
];


export default function TextToSpeech() {
  const [text, setText] = useState('Hello world! This is the Text to Speech tool from Toolsax.');
  const [voice, setVoice] = useState('en-US-Standard-C');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateAudio = async () => {
    if (!text.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please enter some text to generate audio.',
      });
      return;
    }

    setIsLoading(true);
    setAudioSrc(null);

    try {
      const result = await generateAudioAction({ text, voice });
      if (result.success && result.audio) {
        setAudioSrc(result.audio);
        toast({
          title: 'Audio Generated!',
          description: 'Your text has been converted to speech.',
        });
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
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text to Speech</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Convert your text into natural-sounding speech using advanced AI. Here's how to use it:</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Enter Text:</strong> Type or paste the text you want to convert into the text area.</li>
              <li><strong>Choose a Voice:</strong> Select your preferred voice from the dropdown.</li>
              <li><strong>Generate Audio:</strong> Click the "Generate Audio" button.</li>
              <li><strong>Listen & Download:</strong> Once complete, an audio player will appear. Press play to listen and use the download button to save the audio.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voice-select">Voice</Label>
               <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger id="voice-select" className="w-full sm:w-[250px]">
                    <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                    {voices.map((v) => (
                        <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
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
        </div>

        <div className="flex justify-center">
          <Button onClick={handleGenerateAudio} disabled={isLoading} size="lg">
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Volume2 className="mr-2 h-5 w-5" />
            )}
            Generate Audio
          </Button>
        </div>

        {audioSrc && (
          <div className="border p-4 rounded-lg bg-muted space-y-4">
             <h3 className="font-semibold text-center">Generated Speech</h3>
            <audio controls src={audioSrc} className="w-full">
              Your browser does not support the audio element.
            </audio>
             <Button asChild className="w-full" variant="secondary">
                 <a href={audioSrc} download="toolsax-speech.wav">
                     <Download className="mr-2 h-4 w-4" />
                     Download Audio (.wav)
                 </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
