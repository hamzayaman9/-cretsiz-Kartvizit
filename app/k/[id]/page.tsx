'use client'
import { useEffect, useState } from 'react'
import { CardData } from '@/lib/types'
import CardPreview from '@/components/CardPreview'
import QRCode from 'react-qr-code'
import Footer from '@/components/Footer'

export default function CardPage() {
  const [card, setCard] = useState<CardData | null>(null)
  const [error, setError] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    const segments = window.location.pathname.split('/')
    const cardId = segments[segments.length - 1]
    if (!cardId) return

    // Fetch card
    fetch(`/api/card?id=${cardId}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(true)
        else setCard(d)
      })
      .catch(() => setError(true))

    // Check if owner
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(async me => {
        if (!me.user) return
        const res = await fetch('/api/user/cards')
        const data = await res.json()
        if (data.cards?.some((c: any) => c.id === cardId)) {
          setIsOwner(true)
        }
      })
      .catch(() => {})
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEdit = () => {
    const segments = window.location.pathname.split('/')
    const cardId = segments[segments.length - 1]
    window.location.href = `/duzenle/${cardId}`
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
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #f3f4f6', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: '#111', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="12" height="9" rx="2" stroke="white" strokeWidth="1.2"/>
              <path d="M4 13H10" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M7 10V13" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Kartvizitim</span>
        </a>
        {isOwner && (
          <button
            onClick={handleEdit}
            style={{
              fontSize: 13, fontWeight: 500, color: '#fff', background: '#111',
              border: 'none', borderRadius: 8, padding: '8px 16px',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ✏️ Düzenle
          </button>
        )}
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <CardPreview data={card} />

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button
              onClick={handleCopy}
              style={{
                flex: 1, padding: '12px', fontSize: 13, fontWeight: 500,
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
                padding: '12px 18px', fontSize: 13, fontWeight: 500,
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

      <Footer />
    </div>
  )
}
