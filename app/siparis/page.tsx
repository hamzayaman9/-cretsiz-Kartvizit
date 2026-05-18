'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const PACKAGES = [
  {
    id: 'single',
    name: 'Tekli NFC Kart',
    price: '₺149',
    desc: 'Tek bir NFC kartvizit',
    features: ['1 adet NFC kart', 'Özel baskı tasarımı', 'Kargo dahil', 'Ömür boyu güncellenebilir link'],
    badge: '',
  },
  {
    id: 'pack5',
    name: '5\'li Paket',
    price: '₺599',
    desc: 'Ekip veya toplu kullanım',
    features: ['5 adet NFC kart', 'Farklı kişiler için', 'Özel baskı tasarımı', 'Kargo dahil', 'Ömür boyu güncellenebilir'],
    badge: '🔥 Popüler',
  },
  {
    id: 'corporate',
    name: 'Kurumsal',
    price: 'Teklif Al',
    desc: '10+ kart, özel logo ve tasarım',
    features: ['10+ adet NFC kart', 'Kurumsal logo baskısı', 'Öncelikli destek', 'Özel fiyatlandırma'],
    badge: '🏢',
  },
]

const STATUS_LABELS: Record<string, string> = {
  pending: '⏳ Beklemede',
  processing: '🔧 Hazırlanıyor',
  shipped: '🚚 Kargoda',
  delivered: '✅ Teslim Edildi',
}

export default function SiparisPage() {
  const [selected, setSelected] = useState('pack5')
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', card_url: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.user) setForm(f => ({ ...f, email: d.user.email }))
    })
  }, [])

  const up = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setError('')
    if (!form.name || !form.phone || !form.address) { setError('Ad, telefon ve adres zorunlu'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, package: selected }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error); return }
      setDone(true)
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', fontSize: 14,
    border: '1.5px solid var(--border)', borderRadius: 10,
    color: 'var(--ink)', outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box',
  }

  if (done) return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      <Header onAuthClick={() => {}} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 48, textAlign: 'center', maxWidth: 440, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>Siparişin alındı!</h2>
          <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
            En kısa sürede sana ulaşacağız. Sipariş durumunu e-posta ile bildireceğiz.
          </p>
          <a href="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', fontSize: 14 }}>
            Ana sayfaya dön
          </a>
        </div>
      </div>
      <Footer />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      <Header onAuthClick={() => {}} />

      <div style={{ flex: 1, maxWidth: 860, margin: '0 auto', width: '100%', padding: '48px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: 'var(--brand-600)', letterSpacing: '0.1em' }}>NFC KARTVİZİT</p>
          <h1 style={{ margin: '0 0 10px', fontSize: 32, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            Fiziksel NFC Kart Sipariş Et
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: 'var(--muted)' }}>
            Telefona yaklaştır — dijital kartvizitini anında paylaş. Bilgilerin değişince panelden güncelle, kart aynı kart.
          </p>
        </div>

        {/* Paket seçimi */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 40 }}>
          {PACKAGES.map(pkg => (
            <button key={pkg.id} onClick={() => setSelected(pkg.id)}
              style={{
                textAlign: 'left', padding: 20, borderRadius: 16, cursor: 'pointer', fontFamily: 'inherit',
                border: `2px solid ${selected === pkg.id ? '#2563eb' : 'var(--border)'}`,
                background: selected === pkg.id ? '#eff6ff' : '#fff',
                transition: 'all 0.15s', position: 'relative',
              }}>
              {pkg.badge && (
                <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 11, fontWeight: 700, background: '#2563eb', color: '#fff', borderRadius: 20, padding: '3px 8px' }}>
                  {pkg.badge}
                </span>
              )}
              <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{pkg.name}</p>
              <p style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800, color: '#2563eb' }}>{pkg.price}</p>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--muted)' }}>{pkg.desc}</p>
              <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                {pkg.features.map((f, i) => (
                  <li key={i} style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 3 }}>{f}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--border)', padding: '32px' }}>
          <h2 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>Teslimat Bilgileri</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>Ad Soyad *</label>
              <input value={form.name} onChange={e => up('name', e.target.value)} placeholder="Hamza Yaman" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>Telefon *</label>
              <input value={form.phone} onChange={e => up('phone', e.target.value)} placeholder="05xx xxx xx xx" style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>E-posta</label>
            <input value={form.email} onChange={e => up('email', e.target.value)} placeholder="ornek@email.com" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>Teslimat Adresi *</label>
            <textarea value={form.address} onChange={e => up('address', e.target.value)} placeholder="Mahalle, sokak, bina no, daire, ilçe, şehir" rows={3}
              style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>
              Kartvizit Linkin <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(NFC karta yazılacak)</span>
            </label>
            <input value={form.card_url} onChange={e => up('card_url', e.target.value)} placeholder="kartivizitim.com.tr/k/abc123" style={inputStyle} />
            <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--muted)' }}>Henüz kartvizit oluşturmadıysan boş bırak, sonra bildiririz.</p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>
              Notlar <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(opsiyonel)</span>
            </label>
            <textarea value={form.notes} onChange={e => up('notes', e.target.value)} placeholder="Özel tasarım isteği, renk tercihi vb." rows={2}
              style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#dc2626' }}>{error}</p>
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading} className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: 15, fontWeight: 600, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Gönderiliyor...' : `Sipariş Ver — ${PACKAGES.find(p => p.id === selected)?.price}`}
          </button>

          <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
            Ödeme sipariş onayından sonra iletişime geçilerek alınacaktır.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
