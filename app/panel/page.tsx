'use client'
import { useEffect, useState } from 'react'
import { CardData } from '@/lib/types'
import CardPreview from '@/components/CardPreview'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import SignatureModal from '@/components/SignatureModal'
import { generateSignatureHtml } from '@/lib/signatureHtml'

interface SavedCard {
  id: string
  data: CardData
  created_at: string
  viewCount: number
}

export default function PanelPage() {
  const [cards, setCards] = useState<SavedCard[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [signatureCard, setSignatureCard] = useState<SavedCard | null>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (!d.user) window.location.href = '/'; else setUserEmail(d.user.email) })
    loadCards()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/me', { method: 'DELETE' })
    window.location.href = '/'
  }

  const loadCards = () => {
    fetch('/api/user/cards').then(r => r.json()).then(d => { setCards(d.cards || []); setLoading(false) }).catch(() => setLoading(false))
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      const res = await fetch(`/api/card?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        setCards(cs => cs.filter(c => c.id !== id))
      } else {
        alert('Silinemedi: ' + json.error)
      }
    } catch {
      alert('Bir hata oluştu')
    } finally {
      setDeleting(null)
      setConfirmDelete(null)
    }
  }

  const cardUrl = (id: string) => `${typeof window !== 'undefined' ? window.location.origin : ''}/k/${id}`

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      {signatureCard && (
        <SignatureModal
          html={generateSignatureHtml(signatureCard.data, cardUrl(signatureCard.id))}
          onClose={() => setSignatureCard(null)}
        />
      )}
      <Header onAuthClick={() => {}} />

      <div className="mobile-padding" style={{ flex: 1, padding: '40px 32px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div className="mobile-stack" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: 'var(--brand-600)', letterSpacing: '0.1em' }}>HESABIM</p>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              Kartlarım
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {userEmail && <span style={{ fontSize: 12, color: 'var(--muted)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</span>}
            <button onClick={handleLogout} style={{ fontSize: 13, color: 'var(--muted)', background: '#fff', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', padding: '9px 14px', fontFamily: 'inherit' }}>
              Çıkış Yap
            </button>
            <a href="/" className="btn-primary" style={{ fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>
              + Yeni kart
            </a>
          </div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {cards.map(card => (
              <div key={card.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', transition: 'all 0.2s', position: 'relative' }}>
                {confirmDelete === card.id && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.92)', borderRadius: 16, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
                    <div style={{ fontSize: 28 }}>⚠️</div>
                    <p style={{ margin: 0, fontSize: 14, color: '#fff', textAlign: 'center', fontWeight: 500 }}>
                      Bu kartı kalıcı olarak silmek istediğine emin misin?
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                      Bu işlem geri alınamaz
                    </p>
                    <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        style={{ flex: 1, padding: '10px', fontSize: 13, fontWeight: 500, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Vazgeç
                      </button>
                      <button
                        onClick={() => handleDelete(card.id)}
                        disabled={deleting === card.id}
                        style={{ flex: 1, padding: '10px', fontSize: 13, fontWeight: 600, background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        {deleting === card.id ? 'Siliniyor...' : 'Evet, sil'}
                      </button>
                    </div>
                  </div>
                )}
                <div style={{ padding: 18 }}>
                  <CardPreview data={card.data} />
                </div>
                <div style={{ padding: '8px 18px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14 }}>👁️</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>
                    {card.viewCount} kişi gördü
                  </span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', padding: '14px 18px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <a href={`/k/${card.id}`} className="btn-primary" style={{ flex: 1, fontSize: 12, padding: '9px', textDecoration: 'none', textAlign: 'center' }}>
                    Görüntüle
                  </a>
                  <a href={`/duzenle/${card.id}`} className="btn-secondary" style={{ fontSize: 12, padding: '8px 12px', textDecoration: 'none', textAlign: 'center' }}>
                    Düzenle
                  </a>
                  <button
                    onClick={() => setSignatureCard(card)}
                    style={{ padding: '8px 12px', fontSize: 12, fontWeight: 500, background: '#fff', color: 'var(--brand-700)', border: '1px solid var(--brand-200)', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}
                    title="E-posta İmzası"
                  >
                    ✉️
                  </button>
                  <button
                    onClick={() => setConfirmDelete(card.id)}
                    style={{ padding: '8px 12px', fontSize: 12, fontWeight: 500, background: '#fff', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}
                    title="Sil"
                  >
                    🗑️
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
