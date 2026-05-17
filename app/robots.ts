import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/panel', '/duzenle/'],
      },
    ],
    sitemap: 'https://kartivizitim.com.tr/sitemap.xml',
  }
}
