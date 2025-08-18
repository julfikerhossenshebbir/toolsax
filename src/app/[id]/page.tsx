
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ALL_TOOLS } from '@/lib/tools';
import { Tool } from '@/lib/types';
import Icon from '@/components/Icon';
import RelatedTools from '@/components/RelatedTools';
import { Badge } from '@/components/ui/badge';
import CaseConverter from '@/components/tools/CaseConverter';
import PasswordGenerator from '@/components/tools/PasswordGenerator';
import QrCodeGenerator from '@/components/tools/QrCodeGenerator';
import JsonFormatter from '@/components/tools/JsonFormatter';
import PdfMerger from '@/components/tools/PdfMerger';
import LoremIpsumGenerator from '@/components/tools/LoremIpsumGenerator';
import UnitConverter from '@/components/tools/UnitConverter';
import ColorConverter from '@/components/tools/ColorConverter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getColorByIndex } from '@/lib/utils';
import ToolActions from '@/components/ToolActions';
import ImageCompressor from '@/components/tools/ImageCompressor';
import MarkdownEditor from '@/components/tools/MarkdownEditor';
import WordCounter from '@/components/tools/WordCounter';
import UrlEncoderDecoder from '@/components/tools/UrlEncoderDecoder';
import ImageResizer from '@/components/tools/ImageResizer';
import Base64Encoder from '@/components/tools/Base64Encoder';
import HashGenerator from '@/components/tools/HashGenerator';
import FaviconGenerator from '@/components/tools/FaviconGenerator';

type Props = {
  params: { id: string };
};

async function getTools(): Promise<Tool[]> {
  return ALL_TOOLS;
}

async function getTool(id: string): Promise<{ tool: Tool | undefined, index: number }> {
  const tools = await getTools();
  const toolIndex = tools.findIndex((tool) => tool.id === id);
  if (toolIndex === -1) {
    return { tool: undefined, index: -1 };
  }
  return { tool: tools[toolIndex], index: toolIndex };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const { tool } = await getTool(id);

  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  return {
    title: `${tool.name} | Toolsax`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} | Toolsax`,
      description: tool.description,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const tools = await getTools();
  return tools.map((tool) => ({
    id: tool.id,
  }));
}

const ToolComponents: { [key: string]: React.ComponentType } = {
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


export default async function ToolPage({ params }: Props) {
  const { id } = params;
  const { tool, index } = await getTool(id);
  const allTools = await getTools();
  
  if (!tool) {
    notFound();
  }

  const ToolComponent = ToolComponents[tool.id] || (() => <PlaceholderTool tool={tool} />);
  const iconColor = getColorByIndex(index);

  const relatedTools = allTools.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 3);
  const originalIndexMap = new Map<string, number>();
  allTools.forEach((tool, index) => {
    originalIndexMap.set(tool.id, index);
  });


  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ 
                backgroundColor: iconColor.bg,
                color: iconColor.text
              }}
            >
              <Icon name={tool.icon} className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tighter">{tool.name}</h1>
            <Badge variant="secondary" className="mt-3 text-sm">{tool.category}</Badge>
          </div>

          <ToolComponent />

          <div className="mt-12 flex justify-center items-center gap-3">
             <ToolActions tool={tool} />
          </div>

        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <RelatedTools 
          relatedTools={relatedTools} 
          currentTool={tool} 
          originalIndexMap={originalIndexMap} 
        />
      </div>
    </>
  );
}
