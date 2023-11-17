/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  env: {
    BASE_URL: process.env.CLIENT_URL,
    SERVER_URL: process.env.SERVER_URL,
    ENVIRONMENT: process.env.ENVINROMENT,
  },
  generateEtags: false,
};

module.exports = nextConfig;
