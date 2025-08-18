
'use client';

import type { Tool } from '@/lib/types';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// --- Static Imports ---
import CaseConverter from '@/components/tools/CaseConverter';
import PasswordGenerator from '@/components/tools/PasswordGenerator';
import QrCodeGenerator from '@/components/tools/QrCodeGenerator';
import JsonFormatter from '@/components/tools/JsonFormatter';
import PdfMerger from '@/components/tools/PdfMerger';
import LoremIpsumGenerator from '@/components/tools/LoremIpsumGenerator';
import UnitConverter from '@/components/tools/UnitConverter';
import ColorConverter from '@/components/tools/ColorConverter';
import ImageCompressor from '@/components/tools/ImageCompressor';
import MarkdownEditor from '@/components/tools/MarkdownEditor';
import WordCounter from '@/components/tools/WordCounter';
import UrlEncoderDecoder from '@/components/tools/UrlEncoderDecoder';
import ImageResizer from '@/components/tools/ImageResizer';
import Base64Encoder from '@/components/tools/Base64Encoder';
import HashGenerator from '@/components/tools/HashGenerator';
import FaviconGenerator from '@/components/tools/FaviconGenerator';
import HtmlMinifier from '@/components/tools/HtmlMinifier';
import CssMinifier from '@/components/tools/CssMinifier';
import JavaScriptMinifier from '@/components/tools/JavaScriptMinifier';
import MetaTagGenerator from '@/components/tools/MetaTagGenerator';


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

// --- Dynamic Imports for Client-Side Only Components ---
const OpenGraphGenerator = dynamic(
  () => import('@/components/tools/OpenGraphGenerator'),
  { 
    ssr: false,
    loading: () => <ToolLoadingSkeleton />
  }
);


const ToolComponents: { [key: string]: React.ComponentType<any> } = {
  'case-converter': CaseConverter,
  'password-generator': PasswordGenerator,
  'qr-generator': QrCodeGenerator,
  'json-formatter': JsonFormatter,
  'pdf-merger': PdfMerger,
  'lorem-ipsum-generator': LoremIpsumGenerator,
  'unit-converter': UnitConverter,
  'color-converter': ColorConverter,
  'image-compressor': ImageCompressor,
  'markdown-editor': MarkdownEditor,
  'word-counter': WordCounter,
  'url-encoder-decoder': UrlEncoderDecoder,
  'image-resizer': ImageResizer,
  'base64-encoder': Base64Encoder,
  'hash-generator': HashGenerator,
  'favicon-generator': FaviconGenerator,
  'html-minifier': HtmlMinifier,
  'css-minifier': CssMinifier,
  'javascript-minifier': JavaScriptMinifier,
  'meta-tag-generator': MetaTagGenerator,
  'open-graph-generator': OpenGraphGenerator,
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
