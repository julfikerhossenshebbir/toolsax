
import { MetadataRoute } from 'next'
import type { Tool } from '@/lib/types';
import { getTools } from '@/lib/firebase';

async function getAllToolsServerSide(): Promise<Tool[]> {
    return new Promise((resolve) => {
        // Since getTools uses onValue, we need to adapt it for a one-time fetch.
        const tools: Tool[] = [];
        let resolved = false;
        
        const mockCallback = (loadedTools: Tool[]) => {
            if (!resolved) {
                resolve(loadedTools);
                resolved = true;
            }
        };
        const unsubscribe = getTools(mockCallback);
        
        setTimeout(() => {
            if (!resolved) {
                console.warn("Sitemap tool fetch timed out.");
                resolve([]);
                resolved = true;
            }
        }, 3000);
    });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://toolsax.com';

  const tools = await getAllToolsServerSide();
  const toolUrls = tools
    .filter(tool => tool.isEnabled)
    .map((tool) => ({
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
