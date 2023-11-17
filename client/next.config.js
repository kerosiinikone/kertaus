/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    SERVER_URL: process.env.SERVER_URL,
    ENVIRONMENT: process.env.ENVIRONMENT,
  },
  generateEtags: false,
};

module.exports = nextConfig;
