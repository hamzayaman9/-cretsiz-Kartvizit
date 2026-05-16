'use client'
import { useState, useCallback, useEffect } from 'react'
import { CardData, defaultCardData, TemplateId } from '@/lib/types'
import FieldSelector from '@/components/FieldSelector'
import ValuesForm from '@/components/ValuesForm'
import CardPreview from '@/components/CardPreview'
import TemplatePicker from '@/components/TemplatePicker'
import PhotoUpload from '@/components/PhotoUpload'
import StepIndicator from '@/components/StepIndicator'
import Footer from '@/components/Footer'

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

    fetch(`/api/card?id=${id}`)
      .then(r => r.json())
      .then(d => {
        if (!d.error) setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const updateField = useCallback((key: keyof CardData['fields'], value: boolean) => {
    setData(d => ({ ...d, fields: { ...d.fields, [key]: value } }))
  }, [])

  const updateValue = useCallback((key: keyof CardData['values'], value: string) => {
    setData(d => ({ ...d, values: { ...d.values, [key]: value } }))
  }, [])

  const setTemplate = useCallback((t: TemplateId) => {
    setData(d => ({ ...d, template: t }))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/card', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, id: cardId }),
      })
      const json = await res.json()
      if (json.success) {
        setSaved(true)
        setTimeout(() => { window.location.href = `/k/${cardId}` }, 1200)
      }
    } catch {
      alert('Bir hata oluştu.')
    } finally {
      setSaving(false)
    }
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <p style={{ fontSize: 13, color: '#9ca3af' }}>Yükleniyor...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <header style={{ borderBottom: '1px solid #f3f4f6', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: '#111', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="12" height="9" rx="2" stroke="white" strokeWidth="1.2"/>
                <path d="M4 13H10" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M7 10V13" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>Kartvizitim</span>
          </a>
        </div>
        <a href={`/k/${cardId}`} style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← Kartı görüntüle</a>
      </header>

      <StepIndicator current={step} onChange={(s) => setStep(s as Step)} />

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', flex: 1 }}>
        <div style={{ borderRight: '1px solid #f3f4f6', padding: '28px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {stepContent()}

          <div style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 20 }}>
            {step > 1 && (
              <button onClick={() => setStep((step - 1) as Step)} style={{ flex: 1, padding: '12px', fontSize: 14, fontWeight: 500, background: '#fff', color: '#111', border: '1.5px solid #e5e7eb', borderRadius: 10, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                ← Geri
              </button>
            )}
            {step < 4 ? (
              <button onClick={() => setStep((step + 1) as Step)} style={{ flex: 1, padding: '12px', fontSize: 14, fontWeight: 600, background: '#111', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                İleri →
              </button>
            ) : (
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '12px', fontSize: 14, fontWeight: 600, background: '#111', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                {saving ? 'Kaydediliyor...' : saved ? '✓ Kaydedildi!' : '💾 Kaydet'}
              </button>
            )}
          </div>
        </div>

        <div style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: 28, background: '#fafafa' }}>
          <div style={{ maxWidth: 600 }}>
            <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Canlı önizleme</p>
            <CardPreview data={data} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
