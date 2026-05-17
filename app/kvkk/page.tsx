import Footer from '@/components/Footer'

export const metadata = {
  title: 'KVKK Aydınlatma Metni — Kartvizitim',
  description: 'Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni',
}

export default function KvkkPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, maxWidth: 760, margin: '0 auto', padding: '60px 24px 80px', width: '100%' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
          KVKK Aydınlatma Metni
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 40 }}>
          6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında hazırlanmıştır.
        </p>

        <section style={sectionStyle}>
          <h2 style={h2Style}>1. Veri Sorumlusu</h2>
          <p style={pStyle}>
            Bu aydınlatma metni, <strong>kartivizitim.com.tr</strong> adresinde faaliyet gösteren
            dijital kartvizit hizmetinin veri sorumlusu sıfatıyla <strong>Hamza Yaman</strong>{' '}
            tarafından 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun ("KVKK") 10. maddesi
            uyarınca hazırlanmıştır.
          </p>
          <p style={pStyle}><strong>E-posta:</strong> hamzayaman923@gmail.com</p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>2. İşlenen Kişisel Veriler</h2>
          <p style={pStyle}>Platformumuz aracılığıyla aşağıdaki kişisel veriler işlenmektedir:</p>
          <ul style={ulStyle}>
            <li style={liStyle}><strong>Hesap bilgileri:</strong> E-posta adresi, şifrelenmiş parola</li>
            <li style={liStyle}><strong>Kartvizit içeriği:</strong> Ad soyad, unvan, şirket adı, telefon numarası, e-posta adresi, web sitesi, LinkedIn profili, adres bilgisi</li>
            <li style={liStyle}><strong>Görsel veriler:</strong> Profil fotoğrafı, arka plan görseli (yalnızca kullanıcı yüklerse)</li>
            <li style={liStyle}><strong>Teknik veriler:</strong> IP adresi, tarayıcı bilgisi, kullanım logları</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>3. Kişisel Verilerin İşlenme Amaçları</h2>
          <ul style={ulStyle}>
            <li style={liStyle}>Dijital kartvizit oluşturma ve paylaşma hizmetinin sunulması</li>
            <li style={liStyle}>Kullanıcı hesabının oluşturulması ve yönetilmesi</li>
            <li style={liStyle}>Platformun güvenliğinin ve teknik işleyişinin sağlanması</li>
            <li style={liStyle}>Yasal yükümlülüklerin yerine getirilmesi</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>4. Kişisel Verilerin İşlenme Hukuki Sebepleri</h2>
          <p style={pStyle}>Kişisel verileriniz KVKK'nın 5. maddesi kapsamında aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (hizmet sunumu)</li>
            <li style={liStyle}>Açık rızanız (profil fotoğrafı gibi özellikle seçimli veriler için)</li>
            <li style={liStyle}>Veri sorumlusunun meşru menfaatleri (platform güvenliği ve geliştirme)</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>5. Kişisel Verilerin Aktarımı</h2>
          <p style={pStyle}>
            Kişisel verileriniz; hizmetin sunulabilmesi amacıyla yurt içi ve/veya yurt dışında
            bulunan altyapı sağlayıcılarıyla (veritabanı, hosting, bulut depolama hizmetleri)
            KVKK'nın 8. ve 9. maddeleri çerçevesinde paylaşılabilmektedir. Verileriniz üçüncü
            kişilerle ticari amaçla paylaşılmamaktadır.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>6. Kişisel Verilerin Saklanma Süresi</h2>
          <p style={pStyle}>
            Kişisel verileriniz, hesabınız aktif olduğu süre boyunca ve hesap silme talebinden
            itibaren en geç <strong>30 gün</strong> içinde sistemlerimizden kalıcı olarak silinmektedir.
            Yasal yükümlülükler gerektirdiğinde ilgili mevzuatta öngörülen süreler esas alınır.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>7. İlgili Kişi Hakları</h2>
          <p style={pStyle}>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li style={liStyle}>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li style={liStyle}>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li style={liStyle}>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
            <li style={liStyle}>Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
            <li style={liStyle}>Kanun'un 7. maddesinde öngörülen şartlar çerçevesinde silinmesini isteme</li>
            <li style={liStyle}>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
            <li style={liStyle}>Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
          </ul>
          <p style={pStyle}>
            Bu haklarınızı kullanmak için{' '}
            <a href="mailto:hamzayaman923@gmail.com" style={{ color: '#2563eb' }}>
              hamzayaman923@gmail.com
            </a>{' '}
            adresine e-posta göndererek talepte bulunabilirsiniz.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>8. Çerezler (Cookies)</h2>
          <p style={pStyle}>
            Platformumuz yalnızca oturum yönetimi için zorunlu çerezler kullanmaktadır.
            Üçüncü taraf izleme veya reklam çerezi kullanılmamaktadır.
          </p>
        </section>

        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 48 }}>
          Son güncelleme: Mayıs 2025
        </p>
      </div>

      <Footer />
    </div>
  )
}

const sectionStyle: React.CSSProperties = {
  marginBottom: 36,
}

const h2Style: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 700,
  color: '#111827',
  marginBottom: 10,
  marginTop: 0,
}

const pStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#374151',
  lineHeight: 1.75,
  marginTop: 0,
  marginBottom: 10,
}

const ulStyle: React.CSSProperties = {
  paddingLeft: 20,
  marginTop: 0,
  marginBottom: 10,
}

const liStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#374151',
  lineHeight: 1.75,
  marginBottom: 4,
}
