
import { MetadataRoute } from 'next'
import { Tool } from '@/lib/types';
import { ALL_TOOLS } from '@/lib/tools';

async function getTools(): Promise<Tool[]> {
  return ALL_TOOLS;
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
