import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

import { Tool } from '@/lib/types';
import Icon from '@/components/Icon';
import RelatedTools from '@/components/RelatedTools';
import { ShareButtons } from '@/components/ShareButtons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

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
    }
  };
}

export async function generateStaticParams() {
    const tools = await getTools();
    return tools.map((tool) => ({
        id: tool.id,
    }));
}

export default async function ToolPage({ params }: Props) {
  const tool = await getTool(params.id);
  const allTools = await getTools();
  
  if (!tool) {
    notFound();
  }

  const toolUrl = `https://toolsax.com/tool/${tool.id}`; // Replace with actual domain in production

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-2xl mb-6">
                    <Icon name={tool.icon} className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-5xl font-extrabold tracking-tighter font-headline">{tool.name}</h1>
                <Badge variant="secondary" className="mt-4 text-sm">{tool.category}</Badge>
                <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                    {tool.description}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={tool.link} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="shadow-lg hover:shadow-primary/40 transition-shadow">
                        Visit Tool <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
                <ShareButtons title={tool.name} url={toolUrl} />
            </div>

            <RelatedTools allTools={allTools} currentTool={tool} />

            <div className="text-center mt-16">
              <Link href="/">
                <Button variant="outline">Back to All Tools</Button>
              </Link>
            </div>
        </div>
    </div>
  );
}
