/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configure for Replit environment
  serverExternalPackages: [],
  // Configure for Replit proxy - use hostname instead
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
  // Allow dev origins for Replit
  allowedDevOrigins: ['*.replit.dev', '*.riker.replit.dev', '127.0.0.1'],
  // Allow requests from all hosts (required for Replit proxy)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache',
          },
        ],
      },
    ];
  },
}

export default nextConfig
