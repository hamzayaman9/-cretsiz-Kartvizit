export type TemplateId = 'klasik' | 'kapak' | 'bolunmus' | 'gece' | 'yanpanel' | 'minimal' | 'kurumsal' | 'cembersel' | 'sicakkart' | 'mozaik' | 'bateman'

export interface CardData {
  id?: string
  template: TemplateId
  // Kişisel
  fields: {
    isim: boolean
    unvan: boolean
    sirket: boolean
    profil: boolean
    telefon: boolean
    eposta: boolean
    adres: boolean
    linkedin: boolean
    twitter: boolean
    instagram: boolean
    website: boolean
    github: boolean
    youtube: boolean
  }
  values: {
    isim: string
    unvan: string
    sirket: string
    telefon: string
    eposta: string
    adres: string
    linkedin: string
    twitter: string
    instagram: string
    website: string
    github: string
    youtube: string
  }
  profilFoto: string | null
  arkaplanFoto: string | null
  accentColor?: string
}

export const defaultCardData: CardData = {
  template: 'klasik',
  fields: {
    isim: true,
    unvan: true,
    sirket: false,
    profil: false,
    telefon: true,
    eposta: true,
    adres: false,
    linkedin: false,
    twitter: false,
    instagram: false,
    website: false,
    github: false,
    youtube: false,
  },
  values: {
    isim: '',
    unvan: '',
    sirket: '',
    telefon: '',
    eposta: '',
    adres: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    website: '',
    github: '',
    youtube: '',
  },
  profilFoto: null,
  arkaplanFoto: null,
  accentColor: '',
}
