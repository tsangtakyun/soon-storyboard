import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SOON 分鏡指引',
  description: 'SOON Internal System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-HK">
      <body>{children}</body>
    </html>
  )
}
