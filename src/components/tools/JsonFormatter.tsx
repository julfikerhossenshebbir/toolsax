'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Copy, Trash2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function JsonFormatter() {
  const [inputJson, setInputJson] = useState('');
  const [output, setOutput] = useState('');
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();

  const handleFormat = () => {
    if (!inputJson.trim()) {
      setOutput('');
      setIsError(false);
      return;
    }
    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setIsError(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON format.';
      setOutput(`Error: ${errorMessage}`);
      setIsError(true);
    }
  };

  const handleCopy = () => {
    if (!output || isError) return;
    navigator.clipboard.writeText(output);
    toast({
      title: 'Formatted JSON copied to clipboard!',
    });
  };

  const handleClear = () => {
    setInputJson('');
    setOutput('');
    setIsError(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>JSON Formatter</CardTitle>
        <CardDescription>
          Paste your JSON data into the editor, click "Format", and watch as it's instantly beautified for better readability. This tool helps you validate, format, and debug your JSON with ease, highlighting syntax errors to help you quickly identify and fix issues.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Input JSON</h3>
            <Textarea
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              placeholder='{"key":"value","number":42}'
              className="min-h-[300px] text-base font-mono flex-grow"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Formatted Output</h3>
            <div className="relative flex-grow">
              <pre className="w-full h-full min-h-[300px] text-base font-mono bg-muted rounded-md p-4 overflow-auto">
                <code className={isError ? 'text-destructive' : ''}>
                  {output || 'Your formatted JSON will appear here...'}
                </code>
              </pre>
              {!isError && output && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="absolute top-2 right-2 h-8 w-8"
                >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy output</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <Button onClick={handleFormat}>
            <ArrowRight className="mr-2 h-4 w-4" /> Format JSON
          </Button>
          <Button onClick={handleClear} variant="outline" disabled={!inputJson && !output}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>

        {isError && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>
              {output}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
