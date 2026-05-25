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
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://egg.sooncreator.network',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://egg.sooncreator.network",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
