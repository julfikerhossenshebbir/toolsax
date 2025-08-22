
import { MetadataRoute } from 'next'
import type { Tool } from '@/lib/types';
import { getTools } from '@/lib/firebase';

async function getAllToolsServerSide(): Promise<Tool[]> {
    return new Promise((resolve) => {
        // Since getTools uses onValue, we need to adapt it for a one-time fetch.
        // A more robust solution would be to use the Firebase Admin SDK for server-side fetches.
        let resolved = false;
        
        const callback = (loadedTools: Tool[]) => {
            if (!resolved) {
                resolve(loadedTools);
                resolved = true;
                // Unsubscribe after the first fetch
                if (unsubscribe) {
                    unsubscribe();
                }
            }
        };

        const unsubscribe = getTools(callback);
        
        // Timeout to prevent hanging during build if Firebase is slow
        setTimeout(() => {
            if (!resolved) {
                console.warn("Sitemap tool fetch timed out.");
                resolve([]);
                resolved = true;
                 if (unsubscribe) {
                    unsubscribe();
                }
            }
        }, 5000); // Increased timeout for reliability
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
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

  const staticPages = [
    { url: '/', changeFrequency: 'daily', priority: 1.0 },
    { url: '/contact', changeFrequency: 'monthly', priority: 0.5 },
    { url: '/cookies', changeFrequency: 'yearly', priority: 0.3 },
    { url: '/dmca', changeFrequency: 'yearly', priority: 0.3 },
    { url: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { url: '/report-a-bug', changeFrequency: 'monthly', priority: 0.4 },
    { url: '/login', changeFrequency: 'monthly', priority: 0.6 },
    { url: '/signup', changeFrequency: 'monthly', priority: 0.6 },
    { url: '/join-vip', changeFrequency: 'monthly', priority: 0.7 },
  ].map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [
    ...staticPages,
    ...toolUrls,
  ];
}
