import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React Compiler (stable in Next.js 16)
  reactCompiler: true,
  // Turbopack is now default in Next.js 16
  experimental: {},
};

export default nextConfig;
