import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:9002", "*.vercel.app"]
    }
  },
  env: {
    NEXT_PUBLIC_CEREBRAS_API_KEY: process.env.CEREBRAS_API_KEY,
  }
};

export default nextConfig;