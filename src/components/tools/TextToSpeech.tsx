
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Play, Pause, Volume2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export default function TextToSpeech() {
  const [text, setText] = useState('Hello world! This is a demonstration of the browser\'s built-in text-to-speech capabilities.');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>(undefined);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        // Set a default English voice if available
        const defaultVoice = availableVoices.find(voice => voice.lang.includes('en-US'));
        setSelectedVoice(defaultVoice?.name);
      }
    };

    // Voices are loaded asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // Initial load

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);
  
  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!text.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please enter some text to speak.',
      });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
        toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: `Could not synthesize speech. ${event.error}`,
        });
        setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };
  
  const handleClear = () => {
      setText('');
      if(isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text to Speech</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Convert your text into speech using your browser's built-in capabilities. Choose from a variety of voices and languages.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Enter Text:</strong> Type or paste the text you want to hear.</li>
              <li><strong>Configure Voice:</strong> Select a voice and adjust the rate and pitch using the sliders.</li>
              <li><strong>Speak:</strong> Click the "Speak" button to start or stop the audio.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="voice-select">Voice</Label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger id="voice-select">
                        <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                        {voices.map((voice) => (
                            <SelectItem key={voice.name} value={voice.name}>
                                {voice.name} ({voice.lang})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Rate: {rate.toFixed(1)}</Label>
                <Slider value={[rate]} onValueChange={(v) => setRate(v[0])} min={0.5} max={2} step={0.1} />
            </div>
            <div className="space-y-2">
                <Label>Pitch: {pitch.toFixed(1)}</Label>
                <Slider value={[pitch]} onValueChange={(v) => setPitch(v[0])} min={0} max={2} step={0.1} />
            </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-input" className="flex justify-between items-center">
              <span>Your Text</span>
               <Button onClick={handleClear} variant="ghost" size="sm" disabled={!text}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
               </Button>
          </Label>
          <Textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="min-h-[200px] text-base"
          />
        </div>
        <div className="text-center">
            <Button onClick={handleSpeak} disabled={!text.trim()} size="lg">
                {isSpeaking ? (
                    <>
                        <Pause className="mr-2 h-5 w-5" /> Stop
                    </>
                ) : (
                     <>
                        <Play className="mr-2 h-5 w-5" /> Speak
                    </>
                )}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
