
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Volume2, Play, Pause, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export default function TextToSpeech() {
  const [text, setText] = useState('Hello world! This is the Text to Speech tool from Toolsax.');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>(undefined);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleVoicesChanged = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      // Set a default English voice if available
      const defaultVoice = availableVoices.find(voice => voice.lang.includes('en-US'));
      if (defaultVoice) {
        setSelectedVoice(defaultVoice.voiceURI);
      }
    };
    
    // Initial load
    handleVoicesChanged();
    
    // Listen for changes
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);
  
  const handleSpeak = () => {
    if (!text.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please enter some text to speak.',
      });
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
      return;
    }
    
    if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsSpeaking(true);
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.voiceURI === selectedVoice);
    if (voice) {
        utterance.voice = voice;
    }
    utterance.pitch = pitch;
    utterance.rate = rate;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onpause = () => setIsSpeaking(false);
    utterance.onresume = () => setIsSpeaking(true);

    window.speechSynthesis.speak(utterance);
  };
  
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text to Speech</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Convert your text into speech using your browser's built-in voice synthesis. Customize the voice, pitch, and speed.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Enter Text:</strong> Type or paste the text you want to hear.</li>
              <li><strong>Customize Voice:</strong> Choose an available voice and adjust the pitch and rate sliders.</li>
              <li><strong>Speak:</strong> Click the "Speak" button to hear the text. You can also pause and resume.</li>
              <li><strong>Stop:</strong> Click the "Stop" button to end the speech completely.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="voice-select">Voice</Label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice} disabled={voices.length === 0}>
                    <SelectTrigger id="voice-select">
                        <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                        {voices.map((v) => (
                            <SelectItem key={v.voiceURI} value={v.voiceURI}>{`${v.name} (${v.lang})`}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label>Pitch: {pitch.toFixed(1)}</Label>
                <Slider value={[pitch]} onValueChange={(v) => setPitch(v[0])} min={0} max={2} step={0.1} />
            </div>
            <div className="space-y-2 md:col-span-2">
                <Label>Speed: {rate.toFixed(1)}x</Label>
                <Slider value={[rate]} onValueChange={(v) => setRate(v[0])} min={0.1} max={2} step={0.1} />
            </div>
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

        <div className="flex justify-center gap-4">
          <Button onClick={handleSpeak} size="lg">
            {isSpeaking ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isSpeaking ? 'Pause' : 'Speak'}
          </Button>
          <Button onClick={handleStop} size="lg" variant="destructive" disabled={!isSpeaking && !window.speechSynthesis.pending}>
            <Square className="mr-2 h-5 w-5" /> Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
