import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY:
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    PASSWORD_SECRET: process.env.PASSWORD_SECRET,
  },
  experimental: {
    turbo: {
      resolveAlias: {
        "@shared": path.resolve(
          __dirname,
          "../../packages/shared/src"
        ),
      },
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@shared": path.resolve(
        __dirname,
        "../../packages/shared/src"
      ),
    };
    return config;
  },
};

export default nextConfig;
