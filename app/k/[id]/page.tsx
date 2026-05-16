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
  const [cardId, setCardId] = useState('')

  useEffect(() => {
    const segments = window.location.pathname.split('/')
    const id = segments[segments.length - 1]
    setCardId(id)
    if (!id) return
    fetch(`/api/card?id=${id}`).then(r => r.json()).then(d => { if (d.error) setError(true); else setCard(d) }).catch(() => setError(true))
    fetch('/api/auth/me').then(r => r.json()).then(async me => {
      if (!me.user) return
      const res = await fetch('/api/user/cards')
      const data = await res.json()
      if (data.cards?.some((c: any) => c.id === id)) setIsOwner(true)
    }).catch(() => {})
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '48px', textAlign: 'center', maxWidth: 400, border: '1px solid var(--border)' }}>
        <div style={{ width: 64, height: 64, background: 'var(--brand-50)', borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, marginBottom: 16 }}>🔍</div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>Kartvizit bulunamadı</h2>
        <p style={{ margin: '8px 0 20px', fontSize: 14, color: 'var(--muted)' }}>Bu link geçersiz veya süresi dolmuş olabilir.</p>
        <a href="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', fontSize: 14 }}>Yeni kart oluştur →</a>
      </div>
    </div>
  )

  if (!card) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
      <p style={{ fontSize: 14, color: 'var(--muted)' }}>Yükleniyor...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ borderBottom: '1px solid var(--border)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="12" height="9" rx="2" stroke="white" strokeWidth="1.4"/>
              <path d="M4 13H10" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M7 10V13" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>Kartvizitim</span>
        </a>
        {isOwner && (
          <a href={`/duzenle/${cardId}`} className="btn-primary" style={{ fontSize: 13, padding: '9px 18px', textDecoration: 'none', display: 'inline-block' }}>
            ✏️ Düzenle
          </a>
        )}
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ width: '100%', maxWidth: 480 }} className="fade-up">
          <CardPreview data={card} />

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={handleCopy} className="btn-primary" style={{ flex: 1, fontSize: 14, padding: '13px' }}>
              {copied ? '✓ Kopyalandı' : '🔗 Linki kopyala'}
            </button>
            <button onClick={() => setShowQR(v => !v)} className="btn-secondary" style={{ fontSize: 14, padding: '12px 22px' }}>
              QR
            </button>
          </div>

          {showQR && (
            <div style={{ marginTop: 14, background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'flex', justifyContent: 'center' }} className="fade-in">
              <QRCode value={url} size={160} />
            </div>
          )}

          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <a href="/" style={{ fontSize: 13, color: 'var(--brand-700)', textDecoration: 'none', fontWeight: 500 }}>
              Sen de ücretsiz kartvizit oluştur →
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
