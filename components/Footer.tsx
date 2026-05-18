'use client'
import LogoText from './LogoText'
import LogoIcon from './LogoIcon'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--brand-950)',
      color: 'rgba(255,255,255,0.8)',
      padding: '40px 32px 28px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LogoIcon size={36} />
            <div>
              <LogoText size={16} color="#fff" iColor="#3b82f6" />
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Profesyonel dijital kartvizit</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Ana sayfa</a>
            <a href="/panel" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Kartlarım</a>
            <a href="/siparis" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>NFC Kart</a>
            <a href="#nasil-calisir" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Özellikler</a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            © {new Date().getFullYear()} Tüm hakları <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Hamza Yaman</strong>'a aittir.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="/kvkk" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>KVKK</a>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>❤️ ile yapıldı</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
