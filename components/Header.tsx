'use client'
import { useEffect, useState } from 'react'
import LogoText from './LogoText'
import LogoIcon from './LogoIcon'

interface Props {
  onAuthClick: () => void
}

export default function Header({ onAuthClick }: Props) {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [scrolled, setScrolled] = useState(false)

  const fetchUser = () => fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.user) setUser(d.user); else setUser(null) })

  useEffect(() => {
    fetchUser()
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    window.addEventListener('auth:changed', fetchUser)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('auth:changed', fetchUser)
    }
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/me', { method: 'DELETE' })
    window.location.reload()
  }

  return (
    <header className="mobile-header" style={{
      position: 'sticky', top: 0, zIndex: 50,
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      padding: '14px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition: 'all 0.3s',
      gap: 12,
    }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', minWidth: 0 }}>
        <div style={{ boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' }}>
          <LogoIcon size={36} />
        </div>
        <div style={{ minWidth: 0 }}>
          <LogoText size={17} />
          <p className="mobile-hide-tagline" style={{ margin: 0, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.05em' }}>
            PROFESYONEL DİJİTAL KARTVİZİT
          </p>
        </div>
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <a href="/asistan" className="desktop-only" style={{
          fontSize: 13, fontWeight: 600,
          color: '#7c3aed',
          textDecoration: 'none', padding: '9px 14px',
          border: '1.5px solid #e9d5ff', borderRadius: 10,
          background: '#faf5ff', whiteSpace: 'nowrap',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ✨ AI ile Oluştur
        </a>
        {user ? (
          <>
            <a href="/panel" style={{
              fontSize: 13, fontWeight: 600, color: 'var(--brand-700)',
              textDecoration: 'none', padding: '9px 14px',
              border: '1.5px solid var(--brand-200)', borderRadius: 10,
              background: '#fff', whiteSpace: 'nowrap',
            }}>
              Kartlarım
            </a>
            <button onClick={handleLogout} className="desktop-only" style={{
              fontSize: 13, color: '#dc2626', background: '#fff',
              border: '1.5px solid #fecaca', borderRadius: 10, cursor: 'pointer', padding: '9px 12px',
            }}>
              Çıkış
            </button>
          </>
        ) : (
          <button onClick={onAuthClick} className="btn-primary" style={{ fontSize: 13, padding: '10px 18px', whiteSpace: 'nowrap' }}>
            Giriş / Kayıt
          </button>
        )}
      </div>
    </header>
  )
}
