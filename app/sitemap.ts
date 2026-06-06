import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const routes = [
    '',
    '/astrologers',
    '/porutham',
    '/spiritual',
    '/astrology',
    '/temple',
    '/festival',
    '/others',
    '/rasipalan/daily',
    '/rasipalan/weekly',
    '/rasipalan/monthly',
    '/rasipalan/subamuhurtha-natkal'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));
}
