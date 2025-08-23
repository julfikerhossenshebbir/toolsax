
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function RegexTester() {
  const [regexString, setRegexString] = useState<string>('\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b');
  const [flags, setFlags] = useState<string>('gi');
  const [testString, setTestString] = useState<string>('Contact us at support@example.com or for sales at sales@example.org.');

  const { highlightedText, error, matches } = useMemo(() => {
    if (!regexString) {
      return { highlightedText: testString, error: null, matches: [] };
    }
    try {
      const regex = new RegExp(regexString, flags);
      const foundMatches: (RegExpExecArray | null)[] = [];
      let match;
      
      // Reset lastIndex for global regex
      if (regex.global) {
        regex.lastIndex = 0;
      }

      const highlighted = testString.replace(regex, (m) => {
        // Since replace is called for each match, we can collect them here.
        // We need to re-run exec to get full match details for the list.
        const newRegexForMatchDetails = new RegExp(regexString, flags.includes('g') ? flags.replace('g', '') : flags);
        const matchDetails = newRegexForMatchDetails.exec(m);
        if (matchDetails) {
            foundMatches.push(matchDetails);
        }
        return `<mark>${m}</mark>`;
      });

      return {
        highlightedText: <div dangerouslySetInnerHTML={{ __html: highlighted.replace(/\n/g, '<br/>') }} />,
        error: null,
        matches: foundMatches.filter(m => m !== null) as RegExpExecArray[],
      };
    } catch (e: any) {
      return {
        highlightedText: testString,
        error: e.message,
        matches: [],
      };
    }
  }, [regexString, flags, testString]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regex Tester</CardTitle>
        <CardDescription>
          <div className="space-y-2">
            <p>Test and debug your regular expressions in real-time. This tool helps you visualize matches and ensures your patterns work as expected.</p>
            <ol className="list-decimal list-inside space-y-1 pl-4">
              <li><strong>Enter Expression:</strong> Type your regular expression in the "Regular Expression" field.</li>
              <li><strong>Add Flags:</strong> Add flags like 'g' (global), 'i' (case-insensitive) in the "Flags" field.</li>
              <li><strong>Provide Test String:</strong> Enter the text you want to test against in the large text area.</li>
              <li><strong>Review Results:</strong> Matched text will be highlighted below, and a list of all matches will be displayed.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-4 space-y-2">
            <Label htmlFor="regex-input">Regular Expression</Label>
            <Input
              id="regex-input"
              value={regexString}
              onChange={(e) => setRegexString(e.target.value)}
              className="font-mono"
              placeholder="e.g., [a-zA-Z]+"
            />
          </div>
          <div className="md:col-span-1 space-y-2">
            <Label htmlFor="flags-input">Flags</Label>
            <Input
              id="flags-input"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="font-mono"
              placeholder="g, i, m"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="test-string">Test String</Label>
          <Textarea
            id="test-string"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className="min-h-[200px] font-mono mt-2"
          />
        </div>
        
        {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Invalid Regular Expression</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <div>
          <h3 className="font-semibold text-lg mb-2">Result</h3>
           <div className="p-4 bg-muted rounded-lg min-h-[100px] prose prose-sm dark:prose-invert max-w-none">
              <style>{`mark { background-color: hsla(var(--primary) / 0.4); color: hsl(var(--primary-foreground)); padding: 2px 4px; border-radius: 4px; }`}</style>
              {highlightedText}
          </div>
        </div>

        {matches.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Matches Found ({matches.length})</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
              {matches.map((match, i) => (
                <div key={i} className="p-2 rounded bg-muted/50">
                  <p className="font-semibold">Match {i + 1}: <code className="bg-primary/20 text-primary-foreground px-1 rounded">{match[0]}</code></p>
                  {match.length > 1 && (
                     <p className="text-xs text-muted-foreground mt-1">
                        Groups: {match.slice(1).map((g, j) => <span key={j}><code className="bg-muted-foreground/20 text-muted-foreground px-1 rounded">{g}</code> </span>)}
                     </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
