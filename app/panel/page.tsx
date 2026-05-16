'use client'
import { useEffect, useState } from 'react'
import { CardData } from '@/lib/types'
import CardPreview from '@/components/CardPreview'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

interface SavedCard {
  id: string
  data: CardData
  created_at: string
}

export default function PanelPage() {
  const [cards, setCards] = useState<SavedCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (!d.user) window.location.href = '/' })
    fetch('/api/user/cards').then(r => r.json()).then(d => { setCards(d.cards || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      <Header onAuthClick={() => {}} />

      <div style={{ flex: 1, padding: '40px 32px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: 'var(--brand-600)', letterSpacing: '0.1em' }}>HESABIM</p>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              Kartlarım
            </h1>
          </div>
          <a href="/" className="btn-primary" style={{ fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>
            + Yeni kart oluştur
          </a>
        </div>

        {loading ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: 60, textAlign: 'center', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>Yükleniyor...</p>
          </div>
        ) : cards.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: '80px 40px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ width: 64, height: 64, background: 'var(--brand-50)', borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, marginBottom: 18 }}>🪪</div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>Henüz kartvizitın yok</h2>
            <p style={{ margin: '8px 0 24px', fontSize: 14, color: 'var(--muted)' }}>İlk dijital kartvizitini oluştur, anında paylaş.</p>
            <a href="/" className="btn-primary" style={{ fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>
              İlk kartı oluştur →
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
            {cards.map(card => (
              <div key={card.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ padding: 18 }}>
                  <CardPreview data={card.data} />
                </div>
                <div style={{ borderTop: '1px solid var(--border)', padding: '14px 18px', display: 'flex', gap: 8 }}>
                  <a href={`/k/${card.id}`} className="btn-primary" style={{ flex: 1, fontSize: 12, padding: '9px', textDecoration: 'none', textAlign: 'center' }}>
                    Görüntüle
                  </a>
                  <a href={`/duzenle/${card.id}`} className="btn-secondary" style={{ flex: 1, fontSize: 12, padding: '8px', textDecoration: 'none', textAlign: 'center' }}>
                    Düzenle
                  </a>
                  <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/k/${card.id}`)} style={{ padding: '8px 14px', fontSize: 12, fontWeight: 500, background: 'var(--surface)', color: 'var(--ink-soft)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer' }}>
                    🔗
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
