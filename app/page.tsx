'use client'
import { useState, useCallback } from 'react'
import { CardData, defaultCardData, TemplateId } from '@/lib/types'
import FieldSelector from '@/components/FieldSelector'
import ValuesForm from '@/components/ValuesForm'
import CardPreview from '@/components/CardPreview'
import TemplatePicker from '@/components/TemplatePicker'
import PhotoUpload from '@/components/PhotoUpload'
import QRCode from 'react-qr-code'

type Step = 'alanlar' | 'bilgiler' | 'foto' | 'sablon'

const steps: { id: Step; label: string }[] = [
  { id: 'alanlar', label: '1. Alanlar' },
  { id: 'bilgiler', label: '2. Bilgiler' },
  { id: 'foto', label: '3. Fotoğraf' },
  { id: 'sablon', label: '4. Şablon' },
]

export default function BuilderPage() {
  const [data, setData] = useState<CardData>(defaultCardData)
  const [step, setStep] = useState<Step>('alanlar')
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const updateField = useCallback((key: keyof CardData['fields'], value: boolean) => {
    setData(d => ({ ...d, fields: { ...d.fields, [key]: value } }))
  }, [])

  const updateValue = useCallback((key: keyof CardData['values'], value: string) => {
    setData(d => ({ ...d, values: { ...d.values, [key]: value } }))
  }, [])

  const setTemplate = useCallback((t: TemplateId) => {
    setData(d => ({ ...d, template: t }))
  }, [])

  const shareUrl = savedId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/k/${savedId}` : ''

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      setSavedId(json.id)
    } catch {
      alert('Bir hata oluştu, lütfen tekrar dene.')
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #f3f4f6', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: '#111', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="12" height="9" rx="2" stroke="white" strokeWidth="1.2"/>
              <path d="M4 13H10" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M7 10V13" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Kartvizit</span>
          <span style={{ fontSize: 11, background: '#f3f4f6', padding: '2px 8px', borderRadius: 20, color: '#6b7280' }}>Ücretsiz</span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 'calc(100vh - 61px)' }}>
        {/* Sol panel */}
        <div style={{ borderRight: '1px solid #f3f4f6', padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Step tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {steps.map(s => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                style={{
                  padding: '9px 12px',
                  border: 'none',
                  borderRadius: 8,
                  background: step === s.id ? '#111' : 'transparent',
                  color: step === s.id ? '#fff' : '#6b7280',
                  fontSize: 13,
                  fontWeight: step === s.id ? 500 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #f3f4f6' }} />

          {/* Step content */}
          {step === 'alanlar' && (
            <FieldSelector fields={data.fields} onChange={updateField} />
          )}
          {step === 'bilgiler' && (
            <ValuesForm values={data.values} fields={data.fields} onChange={updateValue} />
          )}
          {step === 'foto' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <PhotoUpload
                label="Profil fotoğrafı"
                value={data.profilFoto}
                onChange={v => setData(d => ({ ...d, profilFoto: v }))}
                hint="Yuvarlak görünür"
              />
              <PhotoUpload
                label="Arka plan fotoğrafı"
                value={data.arkaplanFoto}
                onChange={v => setData(d => ({ ...d, arkaplanFoto: v }))}
                hint="Kapak & Gece şablonlarında görünür"
              />
            </div>
          )}
          {step === 'sablon' && (
            <TemplatePicker selected={data.template} onChange={setTemplate} />
          )}
        </div>

        {/* Sağ panel - önizleme */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 24, background: '#fafafa' }}>
          <div style={{ maxWidth: 560 }}>
            <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Canlı önizleme
            </p>
            <CardPreview data={data} />
          </div>

          {/* Paylaş butonu */}
          {!savedId ? (
            <div style={{ maxWidth: 560 }}>
              <button
                onClick={handleSave}
                disabled={saving || !data.values.isim}
                style={{
                  padding: '13px 24px',
                  background: data.values.isim ? '#111' : '#e5e7eb',
                  color: data.values.isim ? '#fff' : '#9ca3af',
                  border: 'none', borderRadius: 10,
                  fontSize: 14, fontWeight: 500,
                  cursor: data.values.isim ? 'pointer' : 'not-allowed',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'opacity 0.15s',
                }}
              >
                {saving ? 'Oluşturuluyor...' : '🔗 Kartvizitimi oluştur'}
              </button>
              {!data.values.isim && (
                <p style={{ margin: '8px 0 0', fontSize: 12, color: '#9ca3af' }}>İsim girmeden paylaşamazsın</p>
              )}
            </div>
          ) : (
            <div style={{ maxWidth: 560, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '20px 24px' }}>
              <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 500, color: '#111' }}>✅ Kartvizitın hazır!</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input
                  readOnly value={shareUrl}
                  style={{
                    flex: 1, padding: '9px 12px', fontSize: 13,
                    border: '1px solid #e5e7eb', borderRadius: 8,
                    background: '#f9fafb', color: '#374151',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <button
                  onClick={handleCopy}
                  style={{
                    padding: '9px 16px', fontSize: 13, fontWeight: 500,
                    background: copied ? '#f0fdf4' : '#111',
                    color: copied ? '#166534' : '#fff',
                    border: 'none', borderRadius: 8, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.2s',
                  }}
                >
                  {copied ? '✓ Kopyalandı' : 'Kopyala'}
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ background: '#fff', padding: 8, border: '1px solid #e5e7eb', borderRadius: 8 }}>
                  <QRCode value={shareUrl} size={96} />
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 12, color: '#6b7280' }}>QR kodu sağ tıklayıp kaydedebilirsin.</p>
                  <a
                    href={shareUrl} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 12, color: '#111', textDecoration: 'underline' }}
                  >
                    Kartviziti görüntüle →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
