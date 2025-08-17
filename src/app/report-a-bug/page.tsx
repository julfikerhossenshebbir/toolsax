import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { Tool } from '@/lib/types';
import ReportBugForm from './ReportBugForm';

export const metadata: Metadata = {
    title: 'Report a Bug | Toolsax',
    description: 'Report an issue with one of our tools.',
};

const toolsFilePath = path.join(process.cwd(), 'src', 'data', 'tools.json');

async function getTools(): Promise<Tool[]> {
  const jsonData = await fs.promises.readFile(toolsFilePath, 'utf-8');
  return JSON.parse(jsonData);
}


export default async function ReportBugPage() {
    const tools = await getTools();

    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Report a Bug</CardTitle>
                    <CardDescription>
                        We appreciate your help in making our tools better. Please fill out the form below to report an issue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ReportBugForm tools={tools} />
                </CardContent>
            </Card>
        </div>
    );
}
