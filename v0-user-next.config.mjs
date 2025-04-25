/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true, // 允许未优化的图片，包括本地表情图片
  },
}

export default nextConfig
