/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://soon-core.vercel.app https://*.vercel.app https://egg.sooncreator.network",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
