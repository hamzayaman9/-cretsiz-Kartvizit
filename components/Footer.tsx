'use client'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #f3f4f6',
      padding: '16px 24px',
      textAlign: 'center',
      background: '#fff',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
        © {new Date().getFullYear()} Tüm hakları <strong style={{ color: '#6b7280' }}>Hamza Yaman</strong>'a aittir.
      </p>
    </footer>
  )
}
