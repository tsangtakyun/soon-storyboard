import type { Metadata } from 'next'
import { EmbeddedMode } from '@/components/EmbeddedMode'
import './globals.css'

export const metadata: Metadata = {
  title: 'SOON Storyboard',
  description: 'SOON storyboard workspace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-HK">
      <head>
        <link rel="stylesheet" href="/soon-design-system.css" />
      </head>
      <body style={{ margin: 0, padding: 0, background: 'var(--soon-bg)' }}>
        <EmbeddedMode />
        {children}
      </body>
    </html>
  )
}
