'use client'
import { useEffect, useState } from 'react'
import { CardData } from '@/lib/types'
import CardPreview from '@/components/CardPreview'
import QRCode from 'react-qr-code'

export default function CardPage({ params }: { params: { id: string } }) {
  const [id, setId] = useState<string>('')
  const [card, setCard] = useState<CardData | null>(null)
  const [error, setError] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    const segments = window.location.pathname.split('/')
    const cardId = segments[segments.length - 1]
    setId(cardId)
    if (!cardId) return
    fetch(`/api/card?id=${cardId}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(true)
        else setCard(d)
      })
      .catch(() => setError(true))
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 32, margin: '0 0 8px' }}>🔍</p>
        <p style={{ fontSize: 16, fontWeight: 500, color: '#111', margin: '0 0 4px' }}>Kartvizit bulunamadı</p>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>Bu link geçersiz veya süresi dolmuş olabilir.</p>
        <a href="/" style={{ fontSize: 13, color: '#111', textDecoration: 'underline' }}>Yeni kartvizit oluştur →</a>
      </div>
    </div>
  )

  if (!card) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <p style={{ fontSize: 13, color: '#9ca3af' }}>Yükleniyor...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <CardPreview data={card} />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button
            onClick={handleCopy}
            style={{
              flex: 1, padding: '11px', fontSize: 13, fontWeight: 500,
              background: copied ? '#f0fdf4' : '#111',
              color: copied ? '#166534' : '#fff',
              border: 'none', borderRadius: 10, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Kopyalandı' : '🔗 Linki kopyala'}
          </button>
          <button
            onClick={() => setShowQR(v => !v)}
            style={{
              padding: '11px 16px', fontSize: 13, fontWeight: 500,
              background: '#fff', color: '#111',
              border: '1px solid #e5e7eb', borderRadius: 10, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            QR
          </button>
        </div>
        {showQR && (
          <div style={{ marginTop: 12, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, display: 'flex', justifyContent: 'center' }}>
            <QRCode value={url} size={160} />
          </div>
        )}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <a href="/" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none' }}>
            Sen de ücretsiz kartvizit oluştur →
          </a>
        </div>
      </div>
    </div>
  )
}