import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external images from Unsplash, YouTube thumbnails, and other sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },

  // Ensure Mongoose and other native modules work correctly on Vercel
  serverExternalPackages: ['mongoose'],
};

export default nextConfig;
