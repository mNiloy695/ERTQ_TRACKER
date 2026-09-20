/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  transpilePackages: ['maplibre-gl', 'echarts', 'echarts-for-react'],
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
}

module.exports = nextConfig
