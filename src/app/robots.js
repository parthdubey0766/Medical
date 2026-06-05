/**
 * Robots.txt Generation
 * 
 * Controls search engine crawling.
 * Blocks /admin and /api from being indexed.
 * Next.js automatically serves this at /robots.txt
 */
export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://parth06.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
