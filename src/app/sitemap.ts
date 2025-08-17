import { MetadataRoute } from 'next'
import fs from 'fs';
import path from 'path';
import { Tool } from '@/lib/types';

const toolsFilePath = path.join(process.cwd(), 'src', 'data', 'tools.json');

async function getTools(): Promise<Tool[]> {
  const jsonData = await fs.promises.readFile(toolsFilePath, 'utf-8');
  return JSON.parse(jsonData);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://toolsax.com';

  const tools = await getTools();
  const toolUrls = tools.map((tool) => ({
    url: `${baseUrl}/${tool.id}`,
    lastModified: new Date(),
  }));

  const staticPages = [
    '/contact',
    '/cookies',
    '/dmca',
    '/privacy',
    '/report-a-bug',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...toolUrls,
    ...staticPages,
  ];
}
