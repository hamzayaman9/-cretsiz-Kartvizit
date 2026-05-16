import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kartvizit — Ücretsiz Dijital Kartvizit Oluştur',
  description: 'Saniyeler içinde profesyonel dijital kartvizit oluştur. Ücretsiz, hesap gerektirmez.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
