'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bold, Italic, Link, List, Code, Quote } from 'lucide-react';

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(`# Welcome to your Markdown Editor!

## Features
- **Live Preview:** See your rendered Markdown as you type.
- **GitHub Flavored Markdown:** Supports tables, strikethrough, and more.
- **Easy Formatting:** Use the toolbar to apply common styles.

### Example Code
\`\`\`javascript
function greet() {
  console.log("Hello, Markdown!");
}
\`\`\`

> Start typing in the editor on the left to see the magic happen!`);

  const applyStyle = (style: 'bold' | 'italic' | 'code' | 'quote' | 'list' | 'link') => {
    const textarea = document.getElementById('markdown-input') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    let newText;
    switch (style) {
        case 'bold':
            newText = `**${selectedText}**`;
            break;
        case 'italic':
            newText = `*${selectedText}*`;
            break;
        case 'code':
            newText = `\`${selectedText}\``;
            break;
        case 'quote':
            newText = `> ${selectedText}`;
            break;
        case 'list':
            newText = `- ${selectedText}`;
            break;
        case 'link':
            newText = `[${selectedText}](url)`;
            break;
        default:
            newText = selectedText;
    }

    const updatedMarkdown = markdown.substring(0, start) + newText + markdown.substring(end);
    setMarkdown(updatedMarkdown);
    textarea.focus();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Markdown Editor</CardTitle>
        <CardDescription>
            <div className="space-y-2">
                <p>Write, preview, and format your Markdown content in real-time with our side-by-side editor.</p>
                <ol className="list-decimal list-inside space-y-1 pl-4">
                    <li><strong>Write Markdown:</strong> Use the text area on the left to write or paste your content.</li>
                    <li><strong>Use the Toolbar:</strong> Select text and click a toolbar button to apply formatting like bold, italics, or lists.</li>
                    <li><strong>Live Preview:</strong> See the rendered HTML output on the right as you type.</li>
                    <li><strong>GitHub Flavored Markdown:</strong> The editor supports features like tables, task lists, and code blocks.</li>
                </ol>
            </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2 p-2 border rounded-md bg-muted">
            <Button variant="outline" size="icon" onClick={() => applyStyle('bold')}><Bold className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => applyStyle('italic')}><Italic className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => applyStyle('link')}><Link className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => applyStyle('list')}><List className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => applyStyle('code')}><Code className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => applyStyle('quote')}><Quote className="h-4 w-4" /></Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea
            id="markdown-input"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="min-h-[400px] text-base font-mono bg-background"
            placeholder="Type your Markdown here..."
          />
          <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md bg-muted overflow-y-auto min-h-[400px]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
