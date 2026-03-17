import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yodelazig.org",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
    ],
  },

  // API rewrites for development
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_INTERNAL_URL || "http://localhost:5000/api/v1"}/:path*`,
      },
    ];
  },

  // Trailing slash configuration
  trailingSlash: false,

  // Output configuration for production
  output: "standalone",
};

export default nextConfig;
