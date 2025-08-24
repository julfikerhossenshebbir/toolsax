
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Volume2, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateAudioAction } from './TextToSpeech/actions';

export default function TextToSpeech() {
  const [text, setText] = useState('Hello world! This is the Text to Speech tool from Toolsax.');
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
      const result = await generateAudioAction(text);
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
              <li><strong>Generate Audio:</strong> Click the "Generate Audio" button.</li>
              <li><strong>Listen:</strong> Once processing is complete, an audio player will appear. Press play to listen to your generated speech.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="min-h-[150px] text-base"
          />
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
          <div className="border p-4 rounded-lg bg-muted">
             <h3 className="font-semibold mb-3 text-center">Generated Speech</h3>
            <audio controls src={audioSrc} className="w-full">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
