
import { MetadataRoute } from 'next'
import type { Tool } from '@/lib/types';
import { initializeAppOnce, getTools } from '@/lib/firebase';


async function getAllToolsServerSide(): Promise<Tool[]> {
    initializeAppOnce();
    return getTools();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://toolsax.pages.dev';

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
    changeFrequency: route.changeFrequency as "yearly" | "always" | "hourly" | "daily" | "weekly" | "monthly" | "never" | undefined,
    priority: route.priority,
  }));

  return [
    ...staticPages,
    ...toolUrls,
  ];
}
