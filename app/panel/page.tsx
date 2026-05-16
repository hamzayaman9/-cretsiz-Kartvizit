'use client'
import { useEffect, useState } from 'react'
import { CardData } from '@/lib/types'
import CardPreview from '@/components/CardPreview'
import Footer from '@/components/Footer'

interface SavedCard {
  id: string
  data: CardData
  created_at: string
}

export default function PanelPage() {
  const [cards, setCards] = useState<SavedCard[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ email: string } | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.user) { window.location.href = '/'; return }
        setUser(d.user)
      })

    fetch('/api/user/cards')
      .then(r => r.json())
      .then(d => { setCards(d.cards || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/me', { method: 'DELETE' })
    window.location.href = '/'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #f3f4f6', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user && <span style={{ fontSize: 13, color: '#6b7280' }}>{user.email}</span>}
          <button onClick={handleLogout} style={{ fontSize: 13, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            Çıkış
          </button>
        </div>
      </header>

      <div style={{ flex: 1, padding: '32px 24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: '#111' }}>Kartlarım</h1>
          <a href="/" style={{
            fontSize: 13, fontWeight: 500, color: '#fff', background: '#111',
            padding: '9px 18px', borderRadius: 10, textDecoration: 'none',
          }}>
            + Yeni kart
          </a>
        </div>

        {loading ? (
          <p style={{ fontSize: 13, color: '#9ca3af' }}>Yükleniyor...</p>
        ) : cards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 32, margin: '0 0 8px' }}>🪪</p>
            <p style={{ fontSize: 15, fontWeight: 500, color: '#111', margin: '0 0 4px' }}>Henüz kartvizitın yok</p>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>İlk kartvizitini oluştur!</p>
            <a href="/" style={{ fontSize: 13, color: '#111', textDecoration: 'underline' }}>Oluştur →</a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {cards.map(card => (
              <div key={card.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: 16 }}>
                  <CardPreview data={card.data} />
                </div>
                <div style={{ borderTop: '1px solid #f3f4f6', padding: '12px 16px', display: 'flex', gap: 8 }}>
                  <a
                    href={`/k/${card.id}`}
                    style={{
                      flex: 1, padding: '8px', fontSize: 12, fontWeight: 500,
                      background: '#111', color: '#fff', borderRadius: 8,
                      textDecoration: 'none', textAlign: 'center',
                    }}
                  >
                    Görüntüle
                  </a>
                  <button
                    onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/k/${card.id}`) }}
                    style={{
                      padding: '8px 14px', fontSize: 12, fontWeight: 500,
                      background: '#f9fafb', color: '#374151',
                      border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Linki kopyala
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
