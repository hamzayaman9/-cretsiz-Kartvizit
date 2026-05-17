import { CardData } from './types'

// QR kodu PNG olarak indir
export function downloadQR(url: string, filename = 'qr-kod.png') {
  const svg = document.querySelector('#qr-code-svg svg') as SVGElement
  if (!svg) return

  const svgData = new XMLSerializer().serializeToString(svg)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const img = new Image()
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url2 = URL.createObjectURL(svgBlob)

  img.onload = () => {
    const size = 600
    canvas.width = size
    canvas.height = size
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, size, size)
    ctx.drawImage(img, 40, 40, size - 80, size - 80)
    URL.revokeObjectURL(url2)
    const a = document.createElement('a')
    a.download = filename
    a.href = canvas.toDataURL('image/png')
    a.click()
  }
  img.src = url2
}

// vCard (.vcf) oluştur ve indir
export function downloadVCard(card: CardData) {
  const v = card.values
  const lines = ['BEGIN:VCARD', 'VERSION:3.0']

  if (card.fields.isim && v.isim) {
    const names = v.isim.split(' ')
    const lastName = names.slice(-1)[0] || ''
    const firstName = names.slice(0, -1).join(' ') || names[0] || ''
    lines.push(`N:${lastName};${firstName};;;`)
    lines.push(`FN:${v.isim}`)
  }
  if (card.fields.unvan && v.unvan) lines.push(`TITLE:${v.unvan}`)
  if (card.fields.sirket && v.sirket) lines.push(`ORG:${v.sirket}`)
  if (card.fields.telefon && v.telefon) lines.push(`TEL;TYPE=CELL:${v.telefon}`)
  if (card.fields.eposta && v.eposta) lines.push(`EMAIL:${v.eposta}`)
  if (card.fields.adres && v.adres) lines.push(`ADR:;;${v.adres};;;;`)
  if (card.fields.website && v.website) lines.push(`URL:${v.website.startsWith('http') ? v.website : 'https://' + v.website}`)
  if (card.fields.linkedin && v.linkedin) lines.push(`URL;TYPE=LinkedIn:https://linkedin.com/in/${v.linkedin.replace('@', '')}`)
  if (card.fields.twitter && v.twitter) lines.push(`URL;TYPE=Twitter:https://twitter.com/${v.twitter.replace('@', '')}`)
  if (card.fields.instagram && v.instagram) lines.push(`URL;TYPE=Instagram:https://instagram.com/${v.instagram.replace('@', '')}`)
  if (card.fields.github && v.github) lines.push(`URL;TYPE=GitHub:https://github.com/${v.github.replace('@', '')}`)

  lines.push('END:VCARD')
  const vcard = lines.join('\n')

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${(v.isim || 'kartvizit').replace(/\s+/g, '-').toLowerCase()}.vcf`
  link.click()
  URL.revokeObjectURL(link.href)
}
