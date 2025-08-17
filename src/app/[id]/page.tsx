import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import type { Metadata } from 'next';

import { Tool } from '@/lib/types';
import Icon from '@/components/Icon';
import RelatedTools from '@/components/RelatedTools';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CaseConverter from '@/components/tools/CaseConverter';
import PasswordGenerator from '@/components/tools/PasswordGenerator';
import QrCodeGenerator from '@/components/tools/QrCodeGenerator';
import JsonFormatter from '@/components/tools/JsonFormatter';
import PdfMerger from '@/components/tools/PdfMerger';
import LoremIpsumGenerator from '@/components/tools/LoremIpsumGenerator';
import UnitConverter from '@/components/tools/UnitConverter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { getColorByIndex } from '@/lib/utils';
import { getToolLikes } from '@/lib/firebase';
import ToolActions from '@/components/ToolActions';

type Props = {
  params: { id: string };
};

const toolsFilePath = path.join(process.cwd(), 'src', 'data', 'tools.json');

async function getTools(): Promise<Tool[]> {
  const jsonData = await fs.promises.readFile(toolsFilePath, 'utf-8');
  return JSON.parse(jsonData);
}

async function getTool(id: string): Promise<{ tool: Tool | undefined, index: number }> {
  const tools = await getTools();
  const toolIndex = tools.findIndex((tool) => tool.id === id);
  if (toolIndex === -1) {
    return { tool: undefined, index: -1 };
  }
  return { tool: tools[toolIndex], index: toolIndex };
}

export async function generateMetadata({ params: { id } }: Props): Promise<Metadata> {
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
  const { tool, index } = await getTool(params.id);
  const allTools = await getTools();
  
  if (!tool) {
    notFound();
  }

  const initialLikes = await getToolLikes(tool.id);
  const ToolComponent = ToolComponents[tool.id] || (() => <PlaceholderTool tool={tool} />);
  const iconColor = getColorByIndex(index);


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

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-row justify-center gap-3">
             <ToolActions toolId={tool.id} initialLikes={initialLikes} />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <RelatedTools allTools={allTools} currentTool={tool} />
      </div>
    </>
  );
}
