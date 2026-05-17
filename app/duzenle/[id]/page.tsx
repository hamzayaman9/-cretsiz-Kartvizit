'use client'
import { useState, useCallback, useEffect } from 'react'
import { CardData, CardStyle, defaultCardData, TemplateId } from '@/lib/types'
import FieldSelector from '@/components/FieldSelector'
import ValuesForm from '@/components/ValuesForm'
import CardPreview from '@/components/CardPreview'
import TemplatePicker from '@/components/TemplatePicker'
import PhotoUpload from '@/components/PhotoUpload'
import StepIndicator from '@/components/StepIndicator'
import Footer from '@/components/Footer'
import LogoText from '@/components/LogoText'
import StyleBar from '@/components/StyleBar'

type Step = 1 | 2 | 3 | 4

export default function EditPage() {
  const [data, setData] = useState<CardData>(defaultCardData)
  const [step, setStep] = useState<Step>(1)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cardId, setCardId] = useState('')

  useEffect(() => {
    const segments = window.location.pathname.split('/')
    const id = segments[segments.length - 1]
    setCardId(id)
    fetch(`/api/card?id=${id}`).then(r => r.json()).then(d => { if (!d.error) setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const updateField = useCallback((key: keyof CardData['fields'], value: boolean) => setData(d => ({ ...d, fields: { ...d.fields, [key]: value } })), [])
  const updateValue = useCallback((key: keyof CardData['values'], value: string) => setData(d => ({ ...d, values: { ...d.values, [key]: value } })), [])
  const setTemplate = useCallback((t: TemplateId) => setData(d => ({ ...d, template: t })), [])
  const setAccentColor = useCallback((c: string) => setData(d => ({ ...d, accentColor: c })), [])
  const setCardStyle = useCallback((s: CardStyle) => setData(d => ({ ...d, cardStyle: s })), [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/card', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, id: cardId }) })
      const json = await res.json()
      if (json.success) { setSaved(true); setTimeout(() => { window.location.href = `/k/${cardId}` }, 1200) }
    } catch { alert('Bir hata oluştu.') } finally { setSaving(false) }
  }

  const stepContent = () => {
    switch (step) {
      case 1: return <FieldSelector fields={data.fields} onChange={updateField} />
      case 2: return <ValuesForm values={data.values} fields={data.fields} onChange={updateValue} />
      case 3: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <PhotoUpload label="Profil fotoğrafı" value={data.profilFoto} onChange={v => setData(d => ({ ...d, profilFoto: v }))} hint="Yuvarlak görünür" />
          <PhotoUpload label="Arka plan fotoğrafı" value={data.arkaplanFoto} onChange={v => setData(d => ({ ...d, arkaplanFoto: v }))} hint="Kapak & Gece şablonlarında görünür" />
        </div>
      )
      case 4: return <TemplatePicker selected={data.template} onChange={setTemplate} />
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
      <p style={{ fontSize: 14, color: 'var(--muted)' }}>Yükleniyor...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      <header className="mobile-header" style={{ borderBottom: '1px solid var(--border)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="12" height="9" rx="2" stroke="white" strokeWidth="1.4"/>
              <path d="M4 13H10" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M7 10V13" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <LogoText size={16} />
        </a>
        <a href={`/k/${cardId}`} style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>← Kartı görüntüle</a>
      </header>

      <div className="mobile-padding" style={{ flex: 1, padding: '32px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: 24 }}>
          <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: 'var(--brand-600)', letterSpacing: '0.1em' }}>DÜZENLEME</p>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>Kartını güncelle</h1>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06), 0 0 0 1px var(--border)', overflow: 'hidden' }}>
          <StepIndicator current={step} onChange={(s) => setStep(s as Step)} />
          <div className="desktop-grid" style={{ display: 'grid', gridTemplateColumns: '340px 1fr' }}>
            <div className="mobile-card-padding" style={{ borderRight: '1px solid var(--border)', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 24, minHeight: 540 }}>
              {stepContent()}
              <div style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 20 }}>
                {step > 1 && (
                  <button onClick={() => setStep((step - 1) as Step)} className="btn-secondary" style={{ flex: 1, padding: '13px', fontSize: 14 }}>← Geri</button>
                )}
                {step < 4 ? (
                  <button onClick={() => setStep((step + 1) as Step)} className="btn-primary" style={{ flex: 1, padding: '13px', fontSize: 14 }}>İleri →</button>
                ) : (
                  <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ flex: 1, padding: '13px', fontSize: 14 }}>
                    {saving ? 'Kaydediliyor...' : saved ? '✓ Kaydedildi!' : '💾 Kaydet'}
                  </button>
                )}
              </div>
            </div>
            <div className="desktop-only mobile-card-padding" style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: 20, background: 'var(--surface)' }}>
              <div>
                <p style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 700, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Canlı önizleme</p>
                <CardPreview data={data} />
              </div>
              <StyleBar accentColor={data.accentColor || ''} onColorChange={setAccentColor} cardStyle={data.cardStyle || {}} onStyleChange={setCardStyle} templateId={data.template} />
            </div>
          </div>
        </div>

        <div className="mobile-bottom-preview" style={{ display: 'none', marginTop: 20, background: '#fff', borderRadius: 16, padding: 20, border: '1px solid var(--border)' }}>
          <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Önizleme
          </p>
          <CardPreview data={data} />
        </div>
      </div>

      <Footer />
    </div>
  )
}
