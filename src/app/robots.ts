import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/search-index/'],
      },
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'Bytespider', 'Amazonbot'],
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: ['anthropic-ai', 'Meta-ExternalAgent', 'FacebookBot'],
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://www.calculat.online/sitemap.xml',
  }
}
