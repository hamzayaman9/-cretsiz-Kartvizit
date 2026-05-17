'use client'
import { useState, useRef } from 'react'

interface Props {
  html: string
  onClose: () => void
}

const PLATFORMS = [
  { id: 'gmail', label: 'Gmail' },
  { id: 'outlook', label: 'Outlook' },
  { id: 'apple', label: 'Apple Mail' },
  { id: 'yahoo', label: 'Yahoo Mail' },
]

const GUIDES: Record<string, { step: string; desc: string }[]> = {
  gmail: [
    { step: '1', desc: 'Gmail\'i aç → Sağ üstten ⚙️ simgesine tıkla → "Tüm ayarları gör"' },
    { step: '2', desc: '"Genel" sekmesinde "İmza" bölümünü bul → "+ Yeni oluştur" tıkla' },
    { step: '3', desc: 'İmzana bir isim ver (örn. "Kartvizitim") → Oluştur' },
    { step: '4', desc: 'Bu sayfada "Önizleme" sekmesine geç → "Tümünü Seç" butonuna bas' },
    { step: '5', desc: 'Seçili içeriği kopyala (Ctrl+C / Cmd+C)' },
    { step: '6', desc: 'Gmail imza kutusuna yapıştır (Ctrl+V / Cmd+V)' },
    { step: '7', desc: 'Sayfanın en altındaki "Değişiklikleri kaydet" butonuna bas ✅' },
  ],
  outlook: [
    { step: '1', desc: 'Outlook\'u aç → Dosya → Seçenekler → Posta → "İmzalar..."' },
    { step: '2', desc: '"Yeni" tıkla → İmzana bir isim ver' },
    { step: '3', desc: 'İmza düzenleme kutusunda sağ alt köşedeki kaynak kodu ("< >") ikonunu bul' },
    { step: '4', desc: 'Aşağıdan "HTML Kodu" sekmesine geç → kodu kopyala → kaynak kod kutusuna yapıştır' },
    { step: '5', desc: 'Tamam → Tamam → Kaydet ✅' },
    { step: '💡', desc: 'Alternatif: "Önizleme" sekmesinde Tümünü Seç → Kopyala → Outlook imza kutusuna yapıştır' },
  ],
  apple: [
    { step: '1', desc: 'Apple Mail → Tercihler (Cmd+,) → İmzalar sekmesi' },
    { step: '2', desc: 'Sol listeden hesabını seç → Ortadaki "+" ile yeni imza oluştur' },
    { step: '3', desc: '"Klasik metin biçimini kullan" kutucuğunun işaretini kaldır (HTML için gerekli)' },
    { step: '4', desc: 'Bu sayfada "Önizleme" sekmesine geç → "Tümünü Seç" butonuna bas → Kopyala' },
    { step: '5', desc: 'Apple Mail imza kutusuna yapıştır ✅' },
    { step: '💡', desc: 'Ya da: "HTML Kodu"nu kopyala → imza.html olarak kaydet → tarayıcıda aç → tümünü seç → kopyala → yapıştır' },
  ],
  yahoo: [
    { step: '1', desc: 'Yahoo Mail → Ayarlar (⚙️) → Diğer ayarlar → Yazma' },
    { step: '2', desc: '"İmza" bölümünü bul → Açık/Kapalı anahtarını aç' },
    { step: '3', desc: 'İmza düzenleme kutusundaki "<> HTML" moduna geç' },
    { step: '4', desc: 'Aşağıdan "HTML Kodu" sekmesine geç → kodu kopyala → yapıştır' },
    { step: '5', desc: 'Kaydet ✅' },
  ],
}

export default function SignatureModal({ html, onClose }: Props) {
  const [tab, setTab] = useState<'preview' | 'html' | 'guide'>('preview')
  const [platform, setPlatform] = useState('gmail')
  const [copied, setCopied] = useState(false)
  const [selected, setSelected] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const copyHtml = () => {
    navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectAll = () => {
    if (!previewRef.current) return
    const range = document.createRange()
    range.selectNodeContents(previewRef.current)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
    setSelected(true)
    setTimeout(() => setSelected(false), 3000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>E-posta İmzası</h2>
              <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--muted)' }}>Kartvizitini e-posta imzan olarak kullan</p>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0 }}>
            {([['preview','👁️ Önizleme'],['html','</> HTML Kodu'],['guide','📖 Nasıl Eklenir?']] as const).map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)}
                style={{ padding: '10px 16px', fontSize: 13, fontWeight: tab === id ? 600 : 400, background: 'none', border: 'none', borderBottom: tab === id ? '2.5px solid #2563eb' : '2.5px solid transparent', color: tab === id ? '#2563eb' : 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

          {tab === 'preview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'var(--surface)', borderRadius: 12, padding: 20, border: '1px solid var(--border)' }}>
                <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Önizleme</p>
                <div ref={previewRef} dangerouslySetInnerHTML={{ __html: html }} style={{ cursor: 'text' }} />
              </div>
              <div style={{ background: '#eff6ff', borderRadius: 10, padding: '12px 16px', border: '1px solid #bfdbfe', fontSize: 13, color: '#1e3a8a', lineHeight: 1.6 }}>
                <strong>Nasıl kopyalanır?</strong><br />
                "Tümünü Seç" butonuna bas → kopyala (Ctrl+C) → e-posta programının imza kutusuna yapıştır (Ctrl+V)
              </div>
              <button onClick={selectAll}
                style={{ padding: '13px', fontSize: 14, fontWeight: 600, background: selected ? '#16a34a' : '#2563eb', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}>
                {selected ? '✓ Seçildi! Şimdi Ctrl+C ile kopyala' : '🖱️ Tümünü Seç'}
              </button>
            </div>
          )}

          {tab === 'html' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px', border: '1px solid var(--border)', fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>
                Bu kodu kopyalayıp e-posta programının HTML imza editörüne yapıştır.
              </div>
              <textarea
                readOnly
                value={html}
                style={{ width: '100%', minHeight: 280, fontFamily: 'monospace', fontSize: 11, lineHeight: 1.6, padding: '12px', borderRadius: 10, border: '1px solid var(--border)', background: '#f8fafc', color: '#374151', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
                onClick={e => (e.target as HTMLTextAreaElement).select()}
              />
              <button onClick={copyHtml}
                style={{ padding: '13px', fontSize: 14, fontWeight: 600, background: copied ? '#16a34a' : '#2563eb', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}>
                {copied ? '✓ Kopyalandı!' : '📋 HTML Kodunu Kopyala'}
              </button>
            </div>
          )}

          {tab === 'guide' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Platform seçici */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {PLATFORMS.map(p => (
                  <button key={p.id} onClick={() => setPlatform(p.id)}
                    style={{ padding: '8px 16px', fontSize: 13, fontWeight: platform === p.id ? 600 : 400, borderRadius: 20, border: `1.5px solid ${platform === p.id ? '#2563eb' : 'var(--border)'}`, background: platform === p.id ? 'var(--brand-50)' : '#fff', color: platform === p.id ? 'var(--brand-700)' : 'var(--ink)', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {GUIDES[platform].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.step === '💡' ? '#fef9c3' : 'var(--brand-50)', border: `1.5px solid ${s.step === '💡' ? '#fde047' : 'var(--brand-200)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s.step === '💡' ? 14 : 12, fontWeight: 700, color: s.step === '💡' ? '#713f12' : 'var(--brand-700)', flexShrink: 0 }}>
                      {s.step}
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink)', lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '12px 16px', border: '1px solid #bbf7d0', fontSize: 13, color: '#14532d', lineHeight: 1.6, marginTop: 4 }}>
                <strong>💡 Genel İpucu:</strong> Önizleme sekmesinde "Tümünü Seç" yapıp kopyaladıktan sonra çoğu e-posta programına direkt yapıştırabilirsin. HTML bilgisi gerekmez!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
