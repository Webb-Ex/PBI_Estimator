import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignores TypeScript errors during the build
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors during the build
  },
  async redirects() {
    return [
      {
        source: "/", 
        destination: "/ATMManager/ATM", 
        permanent: true, 
      },
    ];
  },
};

export default nextConfig;
