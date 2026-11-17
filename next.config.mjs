/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'typeone.com.my',
      },
    ],
  },
  // The sub pages (/how-it-fits, /applications, ...) read these files at request time through a
  // path built in src/lib/subpage.mjs, which Next's file tracer can't follow. Without this they are
  // left out of the Vercel function bundle and every sub page returns 500.
  outputFileTracingIncludes: {
    '/[slug]': ['./data/pages.json', './public/details.html'],
  },
};

export default nextConfig;
