'use client'
import { useEffect, useRef, useState } from 'react'
import { CardData } from '@/lib/types'
import CardPreview from '@/components/CardPreview'
import QRStyled, { QRStyledHandle } from '@/components/QRStyled'
import Footer from '@/components/Footer'
import LogoText from '@/components/LogoText'
import LogoIcon from '@/components/LogoIcon'
import { downloadVCard } from '@/lib/downloads'

export default function CardPage() {
  const [card, setCard] = useState<CardData | null>(null)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const [cardId, setCardId] = useState('')
  const qrRef = useRef<QRStyledHandle>(null)

  useEffect(() => {
    const segments = window.location.pathname.split('/')
    const id = segments[segments.length - 1]
    setCardId(id)
    if (!id) return
    fetch(`/api/card?id=${id}`).then(r => r.json()).then(d => { if (d.error) setError(true); else setCard(d) }).catch(() => setError(true))
    // Görüntülenme kaydet (fire & forget)
    fetch(`/api/card/view?id=${id}`, { method: 'POST' }).catch(() => {})
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

  const handleQRDownload = () => {
    const isim = card?.values.isim?.replace(/\s+/g, '-').toLowerCase() || 'kartvizit'
    qrRef.current?.download(`${isim}-qr`)
  }

  const handleVCardDownload = () => {
    if (card) downloadVCard(card)
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
      <header className="mobile-header no-print" style={{ borderBottom: '1px solid var(--border)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <LogoIcon size={36} />
          <LogoText size={16} />
        </a>
        {isOwner && (
          <a href={`/duzenle/${cardId}`} className="btn-primary" style={{ fontSize: 13, padding: '9px 18px', textDecoration: 'none', display: 'inline-block' }}>
            ✏️ Düzenle
          </a>
        )}
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '32px 16px' }}>
        <div style={{ width: '100%', maxWidth: 480 }} className="fade-up">
          <div className="print-card"><CardPreview data={card} /></div>

          {/* Aksiyon butonları */}
          <div className="no-print" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
            <button onClick={handleCopy} className="btn-primary" style={{ fontSize: 13, padding: '12px' }}>
              {copied ? '✓ Kopyalandı' : '🔗 Linki kopyala'}
            </button>
            <button onClick={handleVCardDownload} className="btn-secondary" style={{ fontSize: 13, padding: '11px' }}>
              📇 Rehbere ekle
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent('Kartvizitimi gör: ' + url)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#25d366', color: '#fff', borderRadius: 12, fontSize: 13, padding: '12px', fontWeight: 600, textDecoration: 'none' }}
            >
              WhatsApp
            </a>
            <a
              href={`sms:?body=${encodeURIComponent('Kartvizitimi gör: ' + url)}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: 'var(--brand-700)', border: '1.5px solid var(--brand-200)', borderRadius: 12, fontSize: 13, padding: '11px', fontWeight: 600, textDecoration: 'none' }}
            >
              SMS ile gönder
            </a>
          </div>

          {/* QR Kod - sadece tarama için, sade */}
          <div className="no-print" style={{ marginTop: 14, background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 700, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>QR Kod</p>
            <div style={{ display: 'inline-block', background: '#fff', padding: 12, borderRadius: 12, border: '1px solid var(--border)' }}>
              <QRStyled ref={qrRef} value={url} size={160} dotType="square" />
            </div>
            <p style={{ margin: '10px 0 12px', fontSize: 12, color: 'var(--muted)' }}>Telefonla okutarak kartvizite ulaş</p>
            <button onClick={handleQRDownload} className="btn-secondary" style={{ fontSize: 13, padding: '9px 20px' }}>
              QR İndir (PNG)
            </button>
          </div>

          <div className="no-print" style={{ marginTop: 24, textAlign: 'center' }}>
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
