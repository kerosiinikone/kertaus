/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  env: {
    CLIENT_URL: process.env.CLIENT_URL,
    SERVER_URL: process.env.SERVER_URL,
    ENVINROMENT: process.env.ENVINROMENT,
  },
  generateEtags: false,
};

module.exports = nextConfig;
