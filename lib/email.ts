import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Kartivizitim <noreply@kartivizitim.com.tr>'
const SITE = 'https://kartivizitim.com.tr'

export async function sendVerificationEmail(email: string, code: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Email adresini doğrula — Kartivizitim',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; color: #1e3a8a; margin: 0;">Kartivizitim</h1>
          <p style="color: #64748b; font-size: 14px; margin: 4px 0 0;">Profesyonel Dijital Kartvizit</p>
        </div>
        
        <h2 style="font-size: 20px; color: #0f172a; margin: 0 0 12px;">Email adresini doğrula</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
          Aşağıdaki 6 haneli kodu girerek email adresini doğrulayabilirsin.
        </p>
        
        <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="font-size: 40px; font-weight: 700; letter-spacing: 8px; color: #1d4ed8; margin: 0; font-family: monospace;">
            ${code}
          </p>
          <p style="color: #94a3b8; font-size: 13px; margin: 8px 0 0;">10 dakika geçerli</p>
        </div>
        
        <p style="color: #94a3b8; font-size: 13px; margin: 0;">
          Bu emaili sen istemediysen görmezden gelebilirsin.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="color: #cbd5e1; font-size: 12px; text-align: center; margin: 0;">
          © ${new Date().getFullYear()} Kartivizitim — <a href="${SITE}" style="color: #94a3b8;">${SITE}</a>
        </p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${SITE}/sifre-sifirla?token=${token}`
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Şifre sıfırlama — Kartivizitim',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; color: #1e3a8a; margin: 0;">Kartivizitim</h1>
          <p style="color: #64748b; font-size: 14px; margin: 4px 0 0;">Profesyonel Dijital Kartvizit</p>
        </div>
        
        <h2 style="font-size: 20px; color: #0f172a; margin: 0 0 12px;">Şifreni sıfırla</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
          Şifre sıfırlama talebinde bulundun. Aşağıdaki butona tıklayarak yeni şifreni belirleyebilirsin.
        </p>
        
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px;">
            Şifremi Sıfırla →
          </a>
        </div>
        
        <p style="color: #94a3b8; font-size: 13px; margin: 0 0 8px;">
          Buton çalışmazsa şu linki kopyalayıp tarayıcına yapıştır:
        </p>
        <p style="color: #2563eb; font-size: 12px; word-break: break-all; margin: 0 0 24px;">
          ${resetUrl}
        </p>
        
        <p style="color: #94a3b8; font-size: 13px; margin: 0;">
          Bu link 1 saat geçerlidir. Bu emaili sen istemediysen görmezden gelebilirsin.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="color: #cbd5e1; font-size: 12px; text-align: center; margin: 0;">
          © ${new Date().getFullYear()} Kartivizitim — <a href="${SITE}" style="color: #94a3b8;">${SITE}</a>
        </p>
      </div>
    `,
  })
}
