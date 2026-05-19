'use client'
import { useEffect, useRef, useState } from 'react'
import { CardData } from '@/lib/types'
import CardPreview from '@/components/CardPreview'
import QRStyled, { QRStyledHandle } from '@/components/QRStyled'
import LogoIcon from '@/components/LogoIcon'
import LogoText from '@/components/LogoText'
import { downloadVCard } from '@/lib/downloads'

// Hex rengini HSL'e çevirir
function hexToHsl(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return [220, 70, 50]
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

// Karttaki rengi alıp sayfa arka planı için koyu ton üretir
function getPageBg(card: CardData): { bg: string; glow: string } {
  const raw = card.cardStyle?.bgColor || card.accentColor || '#2563eb'
  // Gradient varsa ilk hex rengi yakala
  const hexMatch = raw.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/)
  const hex = hexMatch ? hexMatch[0] : '#2563eb'
  const [h, s] = hexToHsl(hex)
  const bg = `hsl(${h}, ${Math.min(s, 25)}%, 7%)`
  const glow = `hsla(${h}, ${Math.min(s + 20, 80)}%, 45%, 0.18)`
  return { bg, glow }
}

export default function CardPage() {
  const [card, setCard] = useState<CardData | null>(null)
  const [error, setError] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [cardId, setCardId] = useState('')
  const [showActions, setShowActions] = useState(false)
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<QRStyledHandle>(null)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    const segments = window.location.pathname.split('/')
    const id = segments[segments.length - 1]
    setCardId(id)
    if (!id) return
    fetch(`/api/card?id=${id}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(true); else setCard(d) })
      .catch(() => setError(true))
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

  const handleVCard = () => { if (card) downloadVCard(card) }

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
      <div style={{ background: '#1e293b', borderRadius: 20, padding: 48, textAlign: 'center', maxWidth: 360, border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#f1f5f9' }}>Kartvizit bulunamadı</h2>
        <p style={{ margin: '8px 0 20px', fontSize: 13, color: '#94a3b8' }}>Bu link geçersiz veya süresi dolmuş olabilir.</p>
        <a href="/" style={{ textDecoration: 'none', display: 'inline-block', fontSize: 13, background: '#2563eb', color: '#fff', padding: '10px 24px', borderRadius: 10, fontWeight: 600 }}>Yeni kart oluştur →</a>
      </div>
    </div>
  )

  if (!card) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
      <div style={{ width: 32, height: 32, border: '2px solid rgba(255,255,255,0.1)', borderTop: '2px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const { bg, glow } = getPageBg(card)

  // Body arka planını kart rengine göre ayarla
  useEffect(() => {
    document.body.style.background = bg
    return () => { document.body.style.background = '' }
  }, [bg])

  return (
    <div style={{ minHeight: '100vh', background: bg, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>

      {/* Arka plan glow efekti */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -60%)',
        width: 700, height: 700,
        background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Üst bar — sadece owner görür */}
      {isOwner && (
        <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 8, zIndex: 10 }}>
          <a href={`/duzenle/${cardId}`}
            style={{ fontSize: 12, padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: '#e2e8f0', borderRadius: 10, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', fontWeight: 500 }}>
            ✏️ Düzenle
          </a>
        </div>
      )}

      {/* Kart */}
      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1, overflow: 'hidden', borderRadius: 16, boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)' }}
        className="fade-up">
        <CardPreview data={card} />
      </div>

      {/* Aksiyon butonu - karta tıklayınca açılır */}
      <div style={{ marginTop: 20, display: 'flex', gap: 10, zIndex: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={handleVCard}
          style={{ fontSize: 12, padding: '9px 18px', background: 'rgba(255,255,255,0.1)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(8px)', fontWeight: 500 }}>
          📇 Rehbere Ekle
        </button>
        <button onClick={handleCopy}
          style={{ fontSize: 12, padding: '9px 18px', background: copied ? 'rgba(22,163,74,0.3)' : 'rgba(255,255,255,0.1)', color: copied ? '#86efac' : '#e2e8f0', border: `1px solid ${copied ? 'rgba(22,163,74,0.4)' : 'rgba(255,255,255,0.12)'}`, borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(8px)', fontWeight: 500, transition: 'all 0.2s' }}>
          {copied ? '✓ Kopyalandı' : '🔗 Linki Kopyala'}
        </button>
        <a href={`https://wa.me/?text=${encodeURIComponent('Kartivizitimi gör: ' + url)}`}
          target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, padding: '9px 18px', background: 'rgba(37,211,102,0.15)', color: '#86efac', border: '1px solid rgba(37,211,102,0.25)', borderRadius: 20, textDecoration: 'none', backdropFilter: 'blur(8px)', fontWeight: 500 }}>
          WhatsApp
        </a>
      </div>

      {/* Branding */}
      <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: 0.35, zIndex: 1 }}>
        <LogoIcon size={18} />
        <span style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 500, letterSpacing: '0.02em' }}>kartivizitim.com.tr</span>
      </div>

      {/* Gizli QR ref (indirme için) */}
      <div style={{ position: 'absolute', left: -9999 }}>
        <QRStyled ref={qrRef} value={url} size={300} dotType="square" />
      </div>
    </div>
  )
}
