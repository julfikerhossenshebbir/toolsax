

import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'microstock.pages.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'paylogo.pages.dev',
        port: '',
        pathname: '/**',
      }
    ],
  },

  webpack: (config, { isServer, nextRuntime }) => {
    // Exclude Node.js modules from Edge Runtime builds
    if (!isServer) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            "fs": false,
            "tls": false,
            "net": false,
            "zlib": false,
            "stream": false,
            "dns": false,
            "http": false,
            "https": false,
            "http2": false,
            "os": false,
            "path": false,
            "querystring": false,
            "crypto": false,
        };
    }

    // Add a rule to handle "node:" scheme
    config.module.rules.push({
      test: /^node:/,
      use: 'raw-loader',
    });

    return config;
  },

  experimental: {},
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'",
          },
        ],
      },
      {
        // Allow embedding specifically for the /embed/ route
        source: '/embed/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 'frame-ancestors *',
          },
        ],
      },
    ];
  },
};

export default nextConfig;




