
'use client';

import type { Tool } from '@/lib/types';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// --- Loading Skeleton ---
const ToolLoadingSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-3/4 mt-2" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-40 w-full" />
      <div className="flex justify-center">
        <Skeleton className="h-10 w-28" />
      </div>
    </CardContent>
  </Card>
);

// --- Dynamic Imports for All Tools ---
const ToolComponents: { [key: string]: React.ComponentType<any> } = {
  'case-converter': dynamic(() => import('@/components/tools/CaseConverter'), { loading: () => <ToolLoadingSkeleton /> }),
  'password-generator': dynamic(() => import('@/components/tools/PasswordGenerator'), { loading: () => <ToolLoadingSkeleton /> }),
  'qr-generator': dynamic(() => import('@/components/tools/QrCodeGenerator'), { loading: () => <ToolLoadingSkeleton /> }),
  'json-formatter': dynamic(() => import('@/components/tools/JsonFormatter'), { loading: () => <ToolLoadingSkeleton /> }),
  'pdf-merger': dynamic(() => import('@/components/tools/PdfMerger'), { ssr: false, loading: () => <ToolLoadingSkeleton /> }),
  'lorem-ipsum-generator': dynamic(() => import('@/components/tools/LoremIpsumGenerator'), { loading: () => <ToolLoadingSkeleton /> }),
  'unit-converter': dynamic(() => import('@/components/tools/UnitConverter'), { loading: () => <ToolLoadingSkeleton /> }),
  'color-converter': dynamic(() => import('@/components/tools/ColorConverter'), { loading: () => <ToolLoadingSkeleton /> }),
  'image-compressor': dynamic(() => import('@/components/tools/ImageCompressor'), { ssr: false, loading: () => <ToolLoadingSkeleton /> }),
  'markdown-editor': dynamic(() => import('@/components/tools/MarkdownEditor'), { loading: () => <ToolLoadingSkeleton /> }),
  'word-counter': dynamic(() => import('@/components/tools/WordCounter'), { loading: () => <ToolLoadingSkeleton /> }),
  'url-encoder-decoder': dynamic(() => import('@/components/tools/UrlEncoderDecoder'), { loading: () => <ToolLoadingSkeleton /> }),
  'image-resizer': dynamic(() => import('@/components/tools/ImageResizer'), { ssr: false, loading: () => <ToolLoadingSkeleton /> }),
  'base64-encoder': dynamic(() => import('@/components/tools/Base64Encoder'), { ssr: false, loading: () => <ToolLoadingSkeleton /> }),
  'hash-generator': dynamic(() => import('@/components/tools/HashGenerator'), { loading: () => <ToolLoadingSkeleton /> }),
  'favicon-generator': dynamic(() => import('@/components/tools/FaviconGenerator'), { ssr: false, loading: () => <ToolLoadingSkeleton /> }),
  'html-minifier': dynamic(() => import('@/components/tools/HtmlMinifier'), { loading: () => <ToolLoadingSkeleton /> }),
  'css-minifier': dynamic(() => import('@/components/tools/CssMinifier'), { loading: () => <ToolLoadingSkeleton /> }),
  'javascript-minifier': dynamic(() => import('@/components/tools/JavaScriptMinifier'), { loading: () => <ToolLoadingSkeleton /> }),
  'meta-tag-generator': dynamic(() => import('@/components/tools/MetaTagGenerator'), { loading: () => <ToolLoadingSkeleton /> }),
  'open-graph-generator': dynamic(() => import('@/components/tools/OpenGraphGenerator'), { ssr: false, loading: () => <ToolLoadingSkeleton /> }),
  'slug-generator': dynamic(() => import('@/components/tools/SlugGenerator'), { loading: () => <ToolLoadingSkeleton /> }),
  'emoji-picker': dynamic(() => import('@/components/tools/EmojiPicker'), { loading: () => <ToolLoadingSkeleton /> }),
};


const PlaceholderTool = ({ tool }: { tool: Tool }) => (
    <Card className="mt-8">
        <CardHeader>
            <CardTitle>Tool Not Implemented</CardTitle>
        </CardHeader>
        <CardContent>
            <p>The tool <span className="font-semibold">{tool.name}</span> is not yet implemented.</p>
            <p className="mt-4">Check back soon!</p>
        </CardContent>
    </Card>
);

interface ToolRendererProps {
  tool: Tool;
}

export default function ToolRenderer({ tool }: ToolRendererProps) {
  const ToolComponent = ToolComponents[tool.id] || (() => <PlaceholderTool tool={tool} />);
  return <ToolComponent />;
}
