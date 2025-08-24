
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic, MicOff, Copy, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function SpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(prev => prev + finalTranscript);
    };

    recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setError('Microphone access was denied. Please allow microphone access in your browser settings.');
        } else {
            setError(`An error occurred with speech recognition: ${event.error}`);
        }
        setIsListening(false);
    };
    
    recognition.onend = () => {
        setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleStartListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript(''); // Clear previous transcript
      setError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setError('Speech recognition could not be started. It might already be active.');
      }
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    toast({
      title: 'Copied to clipboard!',
    });
  };

  const handleClear = () => {
    setTranscript('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Speech to Text</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Convert your speech into text in real-time. This tool uses your browser's built-in speech recognition capabilities.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Allow Microphone Access:</strong> Your browser will ask for permission to use your microphone. Please allow it.</li>
              <li><strong>Start Listening:</strong> Click the "Start Listening" button to begin recording your voice.</li>
              <li><strong>Speak Clearly:</strong> The transcribed text will appear in the text area as you speak.</li>
              <li><strong>Stop Listening:</strong> Click the "Stop Listening" button when you are finished.</li>
              <li><strong>Copy or Clear:</strong> Use the buttons to copy the transcribed text or clear the text area.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <div className="flex justify-center gap-4">
            <Button onClick={handleStartListening} disabled={isListening || !!error} size="lg">
                <Mic className="mr-2 h-5 w-5" /> Start Listening
            </Button>
            <Button onClick={handleStopListening} disabled={!isListening} size="lg" variant="destructive">
                <MicOff className="mr-2 h-5 w-5" /> Stop Listening
            </Button>
        </div>

        <div className="relative">
            <Textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={isListening ? 'Listening...' : 'Your transcribed text will appear here...'}
                className="min-h-[250px] text-base"
            />
            {transcript && (
                 <div className="absolute top-2 right-2 flex gap-1">
                    <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy">
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleClear} title="Clear">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
