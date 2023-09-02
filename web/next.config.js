/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_ENDPOINT: process.env.NEXT_PUBLIC_API_KEY,
  },
};

module.exports = nextConfig;
