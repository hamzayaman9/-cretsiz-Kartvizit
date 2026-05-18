'use client'
import { useState, useEffect } from 'react'

interface Order {
  id: string
  name: string
  phone: string
  email: string
  address: string
  card_url: string
  package: string
  status: string
  notes: string
  created_at: string
}

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  pending:    { bg: '#fef9c3', color: '#713f12', label: '⏳ Beklemede' },
  processing: { bg: '#dbeafe', color: '#1e3a8a', label: '🔧 Hazırlanıyor' },
  shipped:    { bg: '#e0f2fe', color: '#0c4a6e', label: '🚚 Kargoda' },
  delivered:  { bg: '#dcfce7', color: '#14532d', label: '✅ Teslim Edildi' },
  cancelled:  { bg: '#fee2e2', color: '#7f1d1d', label: '❌ İptal' },
}

const PKG_LABELS: Record<string, string> = {
  single: 'Tekli',
  pack5: '5\'li Paket',
  corporate: 'Kurumsal',
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  const handleLogin = async () => {
    setLoginError('')
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) { setAuthed(true); loadOrders() }
    else setLoginError('Hatalı şifre')
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    setAuthed(false)
    setOrders([])
  }

  const loadOrders = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/orders')
    if (res.ok) { const d = await res.json(); setOrders(d.orders) }
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o))
    setUpdating(null)
  }

  // Cookie varsa direkt giriş dene
  useEffect(() => {
    fetch('/api/admin/orders').then(r => { if (r.ok) { setAuthed(true); r.json().then(d => setOrders(d.orders)) } })
  }, [])

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {} as Record<string, number>)

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 40, maxWidth: 380, width: '100%', margin: 16, border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>🔐 Admin Paneli</h1>
        <p style={{ margin: '0 0 24px', fontSize: 13, color: 'var(--muted)' }}>Devam etmek için şifre gir</p>
        <input
          type="password" value={password} placeholder="Admin şifresi"
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{ width: '100%', padding: '12px 14px', fontSize: 14, border: '1.5px solid var(--border)', borderRadius: 10, marginBottom: 12, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none' }}
        />
        {loginError && <p style={{ margin: '0 0 12px', fontSize: 13, color: '#dc2626' }}>{loginError}</p>}
        <button onClick={handleLogin} className="btn-primary" style={{ width: '100%', padding: '13px', fontSize: 14 }}>
          Giriş Yap
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>🛒 Sipariş Paneli</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={loadOrders} style={{ fontSize: 13, padding: '8px 14px', background: '#fff', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>
            🔄 Yenile
          </button>
          <button onClick={handleLogout} style={{ fontSize: 13, padding: '8px 14px', background: '#fff', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
            Çıkış
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
        {/* Özet kartları */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
          {[['all', '📦 Toplam', orders.length], ['pending', '⏳ Bekleyen', counts.pending || 0], ['processing', '🔧 Hazırlanan', counts.processing || 0], ['shipped', '🚚 Kargoda', counts.shipped || 0], ['delivered', '✅ Teslim', counts.delivered || 0]].map(([key, label, count]) => (
            <button key={key} onClick={() => setFilter(key as string)}
              style={{ padding: '16px', borderRadius: 12, border: `2px solid ${filter === key ? '#2563eb' : 'var(--border)'}`, background: filter === key ? '#eff6ff' : '#fff', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: 'var(--muted)' }}>{label}</p>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: filter === key ? '#2563eb' : 'var(--ink)' }}>{count}</p>
            </button>
          ))}
        </div>

        {/* Siparişler */}
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>Yükleniyor...</p>
        ) : filtered.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: 60, textAlign: 'center', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>Henüz sipariş yok</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(order => {
              const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending
              return (
                <div key={order.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)', padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{order.name}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: '#e0f2fe', color: '#0c4a6e' }}>
                          {PKG_LABELS[order.package] || order.package}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, color: 'var(--muted)' }}>📞 {order.phone}</span>
                        {order.email && <span style={{ fontSize: 13, color: 'var(--muted)' }}>✉️ {order.email}</span>}
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>{new Date(order.created_at).toLocaleString('tr-TR')}</span>
                      </div>
                      <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--ink-soft)' }}>📍 {order.address}</p>
                      {order.card_url && <p style={{ margin: '4px 0 0', fontSize: 13 }}><a href={order.card_url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>🔗 {order.card_url}</a></p>}
                      {order.notes && <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>💬 {order.notes}</p>}
                    </div>

                    {/* Durum güncelle */}
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      disabled={updating === order.id}
                      style={{ padding: '8px 12px', fontSize: 13, border: '1.5px solid var(--border)', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: 'inherit', outline: 'none' }}
                    >
                      <option value="pending">⏳ Beklemede</option>
                      <option value="processing">🔧 Hazırlanıyor</option>
                      <option value="shipped">🚚 Kargoda</option>
                      <option value="delivered">✅ Teslim Edildi</option>
                      <option value="cancelled">❌ İptal</option>
                    </select>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
