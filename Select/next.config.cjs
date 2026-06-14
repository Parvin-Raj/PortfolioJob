/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
    ],
  },
}

module.exports = nextConfig


