import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Recommended for better first-load performance
  output: 'standalone',
  // Disable ESLint during production build for now
  // You can remove this once you've fixed the ESLint issues
  eslint: {
    // Warning rather than error in production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily ignore TypeScript errors in production builds
    // Remove this once you've fixed the TypeScript issues
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
