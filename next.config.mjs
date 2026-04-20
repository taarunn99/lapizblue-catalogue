/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Build for static export for easy Vercel deploy or any host
  // Can also run as Node.js app — removing `output: 'export'` enables full SSR
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Proxy external TDS PDFs don't need rewriting — they're direct links
};

export default nextConfig;
