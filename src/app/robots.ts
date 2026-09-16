import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/api/og/',
      },
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: '/api/',
      },
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended'],
        allow: '/',
      },
    ],
    sitemap: 'https://www.calculat.online/sitemap.xml',
  }
}
