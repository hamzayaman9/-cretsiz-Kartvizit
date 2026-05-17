'use client'

const features = [
  { icon: '⚡', title: 'Saniyeler içinde', desc: '4 adımda kartını oluştur, anında paylaş. Karmaşa yok.' },
  { icon: '🎨', title: '11 hazır şablon', desc: 'Minimal, koyu, modern, klasik... Tarzına uygun olanı seç.' },
  { icon: '📱', title: 'QR + link', desc: 'Toplantıda QR göster, mesajda link gönder. İki seçenek de hazır.' },
  { icon: '✏️', title: 'Sonradan düzenle', desc: 'Hesap aç, kartlarını sakla, istediğin zaman güncelle.' },
  { icon: '🆓', title: 'Tamamen ücretsiz', desc: 'Premium paket yok, kullanım limiti yok. Açık kaynak felsefesi.' },
  { icon: '🔒', title: 'Hesapsız da kullan', desc: 'Hızlı bir kart için kayıt olma zorunluluğu yok.' },
]

export default function Features() {
  return (
    <section id="nasil-calisir" className="mobile-section" style={{ padding: '80px 32px', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56, maxWidth: 600, margin: '0 auto 56px' }}>
          <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: 'var(--brand-600)', letterSpacing: '0.1em' }}>
            ÖZELLİKLER
          </p>
          <h2 className="mobile-features-title" style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Bilinmesi gereken her şey
          </h2>
          <p style={{ margin: '14px 0 0', fontSize: 16, color: 'var(--muted)', lineHeight: 1.6 }}>
            Profesyonel dijital kartvizit için ihtiyacın olan tüm araçlar tek bir yerde.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={f.title} style={{
              padding: '28px 26px',
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: 16,
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--brand-200)'
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(37, 99, 235, 0.08)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                width: 44, height: 44,
                background: 'var(--brand-50)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, marginBottom: 16,
              }}>{f.icon}</div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>{f.title}</h3>
              <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--muted)', lineHeight: 1.55 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
