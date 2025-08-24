
'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import { useTheme } from 'next-themes';

export default function TextDiffChecker() {
  const { theme } = useTheme();
  const [oldText, setOldText] = useState('This is the original text.\nIt has some content that will be changed.');
  const [newText, setNewText] = useState('This is the modified text.\nIt has new content that was changed.');

  const newStyles = {
    variables: {
      light: {
        color: '#212121',
        addedBackground: '#e6ffec',
        addedColor: '#24292e',
        removedBackground: '#ffeef0',
        removedColor: '#24292e',
        wordAddedBackground: '#acf2bd',
        wordRemovedBackground: '#fdb8c0',
      },
      dark: {
        color: '#f1f1f1',
        addedBackground: '#044B53',
        addedColor: 'white',
        removedBackground: '#632F34',
        removedColor: 'white',
        wordAddedBackground: '#034159',
        wordRemovedBackground: '#75252B',
      },
    },
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Text Difference Checker</CardTitle>
        <CardDescription>
          <div class="space-y-2">
            <p>Paste two blocks of text in the fields below to see the differences. Added and removed lines will be highlighted.</p>
            <ol class="list-decimal list-inside space-y-1 pl-4">
                <li><strong>Paste Original Text:</strong> Enter the first version of your text in the left text area.</li>
                <li><strong>Paste Modified Text:</strong> Enter the second version of your text in the right text area.</li>
                <li><strong>View Differences:</strong> The comparison view below will automatically update, highlighting additions in green and deletions in red.</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Original Text</h3>
            <Textarea
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              className="min-h-[200px] font-mono"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Modified Text</h3>
            <Textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="min-h-[200px] font-mono"
            />
          </div>
        </div>

        <div>
            <h3 className="font-semibold text-lg mb-2">Differences</h3>
            <div className="rounded-lg border overflow-hidden text-sm p-4 bg-muted">
                {/* <ReactDiffViewer
                    oldValue={oldText}
                    newValue={newText}
                    splitView={true}
                    compareMethod={DiffMethod.WORDS}
                    styles={newStyles}
                    useDarkTheme={theme === 'dark'}
                /> */}
                The diff viewer is temporarily disabled due to an installation issue.
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
