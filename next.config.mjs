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
};

export default nextConfig;
