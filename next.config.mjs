/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@xyflow/react'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async redirects() {
    return [
      { source: '/chapter-1', destination: '/chapter-1/ip-addresses', permanent: false },
      { source: '/chapter-2', destination: '/chapter-2/databases-and-dbms', permanent: false },
      { source: '/chapter-3', destination: '/chapter-3/n-tier-architecture', permanent: false },
      { source: '/chapter-4', destination: '/chapter-4/geohashing-and-quadtrees', permanent: false },
      { source: '/chapter-5', destination: '/chapter-5/system-design-interview-tips', permanent: false },
    ];
  },
};

export default nextConfig;
