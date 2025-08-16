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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  params: { id: string };
};

const toolsFilePath = path.join(process.cwd(), 'src', 'data', 'tools.json');

async function getTools(): Promise<Tool[]> {
  const jsonData = await fs.promises.readFile(toolsFilePath, 'utf-8');
  return JSON.parse(jsonData);
}

async function getTool(id: string): Promise<Tool | undefined> {
  const tools = await getTools();
  return tools.find((tool) => tool.id === id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = await getTool(params.id);

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
  const tool = await getTool(params.id);
  const allTools = await getTools();

  if (!tool) {
    notFound();
  }

  const ToolComponent = ToolComponents[tool.id] || (() => <PlaceholderTool tool={tool} />);

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary rounded-2xl mb-4">
              <Icon name={tool.icon} className="w-10 h-10 text-foreground" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter">{tool.name}</h1>
            <Badge variant="secondary" className="mt-3 text-sm">{tool.category}</Badge>
          </div>

          <ToolComponent />

          <div className="text-center mt-16">
            <Link href="/">
              <Button variant="outline">Back to All Tools</Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <RelatedTools allTools={allTools} currentTool={tool} />
      </div>
    </>
  );
}
