/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
