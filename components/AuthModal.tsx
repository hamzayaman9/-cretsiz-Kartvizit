'use client'
import { useState } from 'react'

interface Props {
  onClose: () => void
  onSuccess: (email: string) => void
}

type Mode = 'login' | 'register' | 'verify' | 'forgot' | 'forgot-sent'

export default function AuthModal({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<Mode>('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', fontSize: 14,
    border: '1.5px solid var(--border)', borderRadius: 10,
    color: 'var(--ink)', outline: 'none', transition: 'border-color 0.15s',
  }

  const handleRegisterLogin = async () => {
    setError('')
    if (!email || !password) { setError('Tüm alanları doldur'); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error); return }

      if (mode === 'register') {
        // Email doğrulama kodu gönder
        await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        setMode('verify')
      } else {
        onSuccess(email)
      }
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setError('')
    if (!code || code.length !== 6) { setError('6 haneli kodu gir'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error); return }
      onSuccess(email)
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async () => {
    setError('')
    if (!forgotEmail) { setError('Email gir'); return }
    setLoading(true)
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })
      setMode('forgot-sent')
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async () => {
    await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setError('Yeni kod gönderildi!')
  }

  const modeConfig = {
    register: { icon: '✨', title: 'Hesap oluştur', subtitle: 'Kartlarını kaydet, istediğin zaman düzenle.' },
    login: { icon: '👋', title: 'Tekrar hoş geldin', subtitle: 'Hesabına giriş yap, kartlarını yönet.' },
    verify: { icon: '📧', title: 'Emailini doğrula', subtitle: `${email} adresine 6 haneli kod gönderdik.` },
    forgot: { icon: '🔑', title: 'Şifremi unuttum', subtitle: 'Email adresini gir, sıfırlama linki gönderelim.' },
    'forgot-sent': { icon: '✅', title: 'Email gönderildi!', subtitle: `${forgotEmail} adresine sıfırlama linki gönderdik.` },
  }

  const current = modeConfig[mode]

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16,
    }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '36px', width: '100%', maxWidth: 420, boxShadow: '0 30px 80px rgba(15, 23, 42, 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ width: 48, height: 48, background: 'var(--brand-50)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            {current.icon}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: 'var(--muted)', padding: 0, lineHeight: 1 }}>×</button>
        </div>

        <h2 style={{ margin: '16px 0 6px', fontSize: 22, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
          {current.title}
        </h2>
        <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--muted)' }}>{current.subtitle}</p>

        {/* Register / Login */}
        {(mode === 'register' || mode === 'login') && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>E-posta</label>
                <input type="email" value={email} placeholder="ornek@email.com" onChange={e => setEmail(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'var(--brand-500)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>
                  Şifre {mode === 'register' && <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(en az 8 karakter, harf + rakam)</span>}
                </label>
                <input type="password" value={password} placeholder={mode === 'register' ? 'örn: Kart2024' : '••••••••'} onChange={e => setPassword(e.target.value)} style={inputStyle}
                  onKeyDown={e => e.key === 'Enter' && handleRegisterLogin()}
                  onFocus={e => (e.target.style.borderColor = 'var(--brand-500)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>
            </div>

            {error && (
              <div style={{ marginTop: 14, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10 }}>
                <p style={{ margin: 0, fontSize: 13, color: '#dc2626' }}>{error}</p>
              </div>
            )}

            <button onClick={handleRegisterLogin} disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 16, padding: '14px', fontSize: 15, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Bekle...' : mode === 'register' ? 'Hesap oluştur' : 'Giriş yap'}
            </button>

            {mode === 'login' && (
              <button onClick={() => { setMode('forgot'); setError('') }} style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--muted)', fontFamily: 'inherit' }}>
                Şifremi unuttum
              </button>
            )}

            <p style={{ margin: '16px 0 0', fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
              {mode === 'register' ? 'Zaten hesabın var mı? ' : 'Hesabın yok mu? '}
              <button onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError('') }} style={{ background: 'none', border: 'none', color: 'var(--brand-700)', fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                {mode === 'register' ? 'Giriş yap' : 'Kayıt ol'}
              </button>
            </p>
          </>
        )}

        {/* Email verification */}
        {mode === 'verify' && (
          <>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>Doğrulama kodu</label>
              <input
                type="text" value={code} placeholder="123456" maxLength={6}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                style={{ ...inputStyle, fontSize: 24, letterSpacing: '8px', textAlign: 'center', fontWeight: 700 }}
                onKeyDown={e => e.key === 'Enter' && handleVerify()}
                onFocus={e => (e.target.style.borderColor = 'var(--brand-500)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                autoFocus
              />
            </div>

            {error && (
              <div style={{ marginTop: 14, padding: '10px 14px', background: error.includes('gönderildi') ? '#f0fdf4' : '#fef2f2', border: `1px solid ${error.includes('gönderildi') ? '#bbf7d0' : '#fecaca'}`, borderRadius: 10 }}>
                <p style={{ margin: 0, fontSize: 13, color: error.includes('gönderildi') ? '#166534' : '#dc2626' }}>{error}</p>
              </div>
            )}

            <button onClick={handleVerify} disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 16, padding: '14px', fontSize: 15 }}>
              {loading ? 'Doğrulanıyor...' : 'Doğrula'}
            </button>

            <button onClick={resendCode} style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--muted)', fontFamily: 'inherit' }}>
              Kodu tekrar gönder
            </button>

            <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
              Emailin gelmedi mi? Spam klasörünü kontrol et.
            </p>
          </>
        )}

        {/* Forgot password */}
        {mode === 'forgot' && (
          <>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>E-posta adresi</label>
              <input type="email" value={forgotEmail} placeholder="ornek@email.com" onChange={e => setForgotEmail(e.target.value)} style={inputStyle}
                onKeyDown={e => e.key === 'Enter' && handleForgot()}
                onFocus={e => (e.target.style.borderColor = 'var(--brand-500)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>

            {error && (
              <div style={{ marginTop: 14, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10 }}>
                <p style={{ margin: 0, fontSize: 13, color: '#dc2626' }}>{error}</p>
              </div>
            )}

            <button onClick={handleForgot} disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 16, padding: '14px', fontSize: 15 }}>
              {loading ? 'Gönderiliyor...' : 'Sıfırlama linki gönder'}
            </button>

            <button onClick={() => { setMode('login'); setError('') }} style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--muted)', fontFamily: 'inherit' }}>
              ← Geri dön
            </button>
          </>
        )}

        {/* Forgot sent */}
        {mode === 'forgot-sent' && (
          <>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
              Şifre sıfırlama linki gönderildi. Spam klasörünü de kontrol etmeyi unutma!
            </p>
            <button onClick={onClose} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15 }}>
              Tamam
            </button>
          </>
        )}
      </div>
    </div>
  )
}
