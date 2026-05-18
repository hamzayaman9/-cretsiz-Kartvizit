import type { Metadata, Viewport } from 'next'
import './globals.css'

const siteUrl = 'https://kartivizitim.com.tr'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Kartvizitim — Ücretsiz Dijital Kartvizit Oluşturucu',
    template: '%s | Kartvizitim',
  },
  description: 'Saniyeler içinde profesyonel dijital kartvizit oluştur. QR kod, link paylaşımı, telefon rehberine ekleme. Ücretsiz, hesapsız kullanılabilir, sınırsız kart.',
  keywords: [
    'kartvizit',
    'dijital kartvizit',
    'online kartvizit',
    'kartvizit oluştur',
    'ücretsiz kartvizit',
    'QR kartvizit',
    'vCard oluştur',
    'dijital iletişim kartı',
    'kartvizit yapma',
    'profesyonel kartvizit',
    'kartvizit tasarımı',
    'dijital kartvizit oluşturucu',
    'kartvizit linki',
    'QR kodlu kartvizit',
    'kartvizit paylaşma',
    'kartvizit hesabı',
    'kartvizit oluşturma sitesi',
    'modern kartvizit',
    'esnaf kartvizit',
    'freelance kartvizit',
  ],
  authors: [{ name: 'Hamza Yaman' }],
  creator: 'Hamza Yaman',
  publisher: 'Kartvizitim',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: siteUrl,
    siteName: 'Kartvizitim',
    title: 'Kartvizitim — Ücretsiz Dijital Kartvizit Oluşturucu',
    description: 'Saniyeler içinde profesyonel dijital kartvizit oluştur. QR kod, link, vCard. Ücretsiz, sınırsız.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Kartvizitim - Dijital Kartvizit Oluşturucu',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kartvizitim — Ücretsiz Dijital Kartvizit',
    description: 'Saniyeler içinde profesyonel dijital kartvizit oluştur.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Google Search Console'dan alacağın kod buraya gelecek
    // google: 'verification-code-here',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563eb',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kartvizitim',
  description: 'Ücretsiz dijital kartvizit oluşturma platformu',
  url: siteUrl,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'TRY',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    ratingCount: '1',
  },
  author: {
    '@type': 'Person',
    name: 'Hamza Yaman',
  },
  inLanguage: 'tr-TR',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
