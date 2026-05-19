import { CardData } from './types'

export function generateSignatureHtml(data: CardData, cardUrl: string): string {
  const accent = data.accentColor || '#2563eb'
  const name = data.values.isim || ''
  const title = data.fields.unvan ? data.values.unvan : ''
  const company = data.fields.sirket ? data.values.sirket : ''
  const phone = data.fields.telefon ? data.values.telefon : ''
  const email = data.fields.eposta ? data.values.eposta : ''
  const website = data.fields.website ? data.values.website : ''
  const linkedin = data.fields.linkedin ? data.values.linkedin : ''
  const address = data.fields.adres ? data.values.adres : ''

  const subtitle = [title, company].filter(Boolean).join(' · ')

  const avatarHtml = data.profilFoto
    ? `<td style="padding-right:16px;vertical-align:top;">
        <img src="${data.profilFoto}" width="64" height="64" alt="${name}" style="border-radius:8px;display:block;object-fit:cover;" />
       </td>`
    : ''

  const rows: string[] = []

  if (phone) rows.push(`<tr><td style="padding:1px 0;font-size:12px;color:#374151;">📱 ${phone}</td></tr>`)
  if (email) rows.push(`<tr><td style="padding:1px 0;font-size:12px;"><a href="mailto:${email}" style="color:${accent};text-decoration:none;">✉️ ${email}</a></td></tr>`)
  if (website) {
    const href = website.startsWith('http') ? website : `https://${website}`
    rows.push(`<tr><td style="padding:1px 0;font-size:12px;"><a href="${href}" style="color:${accent};text-decoration:none;">🌐 ${website}</a></td></tr>`)
  }
  if (linkedin) {
    const href = linkedin.startsWith('http') ? linkedin : `https://linkedin.com/in/${linkedin}`
    rows.push(`<tr><td style="padding:1px 0;font-size:12px;"><a href="${href}" style="color:${accent};text-decoration:none;">in ${linkedin}</a></td></tr>`)
  }
  if (address) rows.push(`<tr><td style="padding:1px 0;font-size:12px;color:#6b7280;">📍 ${address}</td></tr>`)

  rows.push(`<tr><td style="padding-top:8px;font-size:11px;"><a href="${cardUrl}" style="color:#9ca3af;text-decoration:none;">🪪 Dijital kartivizitimi görüntüle →</a></td></tr>`)

  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;max-width:480px;">
  <tr>
    ${avatarHtml}
    <td style="vertical-align:top;border-left:3px solid ${accent};padding-left:14px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr><td style="font-size:17px;font-weight:700;color:#111827;padding-bottom:2px;">${name}</td></tr>
        ${subtitle ? `<tr><td style="font-size:12px;color:#6b7280;padding-bottom:6px;">${subtitle}</td></tr>` : ''}
        ${rows.join('\n        ')}
      </table>
    </td>
  </tr>
</table>`
}
