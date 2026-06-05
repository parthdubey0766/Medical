const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')?.pop();
const basePath = isGitHubPages && repositoryName ? `/${repositoryName}` : undefined;
const shouldExport = process.env.NEXT_PUBLIC_PREVIEW_MODE === 'true';

// Determine the site URL for CORS and CSP
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://parth06.app';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: shouldExport ? 'export' : undefined,
  trailingSlash: shouldExport,
  basePath,
  assetPrefix: basePath,
  // --- Security Headers ---
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // HSTS — enforce HTTPS for 1 year, include subdomains
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // XSS Protection (legacy browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer Policy — send origin only for cross-origin
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy — disable unnecessary browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              `connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://api.resend.com ${siteUrl}`,
              "frame-src 'self' https://www.google.com https://maps.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
      // API routes — additional CORS headers
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: siteUrl,
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          // Prevent caching of API responses
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    ];
  },

  // --- Image Optimization ---
  images: {
    unoptimized: shouldExport,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 480, 768, 1024, 1440, 1920],
  },

  // --- Performance ---
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true,

  // --- Experimental features ---
  experimental: {
    // Enable server actions if needed in future
  },
};

export default nextConfig;
