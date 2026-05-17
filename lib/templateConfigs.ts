export type LayoutType =
  | 'left-standard' | 'centered' | 'left-sidebar'
  | 'top-header' | 'split-half' | 'minimal'
  | 'dark-card' | 'gradient-full'

export interface TemplateConfig {
  id: string
  label: string
  category: string
  layout: LayoutType
  bg: string
  bgGradient?: string
  headerBg?: string
  sidebarBg?: string
  textColor: string
  accentColor: string
  mutedColor: string
  fontFamily: 'sans' | 'serif' | 'mono'
  borderRadius: number
  divider?: boolean
  sidebarWidth?: string
}

export interface TemplateCategory {
  id: string
  label: string
  configs: TemplateConfig[]
}

type O = {
  bg: string; bgGradient?: string; headerBg?: string; sidebarBg?: string
  text: string; accent: string; muted: string
  font: 'sans' | 'serif' | 'mono'; radius: number
  divider?: boolean; sidebarWidth?: string
}

function make(id: string, label: string, category: string, layout: LayoutType, o: O): TemplateConfig {
  return {
    id, label, category, layout,
    bg: o.bg, bgGradient: o.bgGradient, headerBg: o.headerBg, sidebarBg: o.sidebarBg,
    textColor: o.text, accentColor: o.accent, mutedColor: o.muted,
    fontFamily: o.font, borderRadius: o.radius,
    divider: o.divider, sidebarWidth: o.sidebarWidth,
  }
}

export const templateCategories: TemplateCategory[] = [
  {
    id: 'canli', label: '🔥 Canlı & Enerjik',
    configs: [
      make('c-mercan',   'Mercan',      'canli', 'top-header',    { bg: '#fffbf9', headerBg: '#ff6b35', text: '#1a0a00', accent: '#ff6b35', muted: '#9a7060', font: 'sans', radius: 16 }),
      make('c-elektrik', 'Elektrik',    'canli', 'left-sidebar',  { bg: '#f0f7ff', sidebarBg: '#0ea5e9', text: '#0c2340', accent: '#0ea5e9', muted: '#5a7da0', font: 'sans', radius: 12 }),
      make('c-ates',     'Ateş',        'canli', 'gradient-full', { bg: '#ff4500', bgGradient: 'linear-gradient(135deg,#ff4500 0%,#ff8c00 100%)', text: '#fff', accent: '#ffd700', muted: 'rgba(255,255,255,0.75)', font: 'sans', radius: 10 }),
      make('c-fuze',     'Füze',        'canli', 'centered',      { bg: '#ff1f5a', text: '#fff', accent: '#ffd700', muted: 'rgba(255,255,255,0.75)', font: 'sans', radius: 20 }),
      make('c-gunes',    'Güneş',       'canli', 'gradient-full', { bg: '#f59e0b', bgGradient: 'linear-gradient(135deg,#fbbf24 0%,#f59e0b 50%,#d97706 100%)', text: '#1a0a00', accent: '#92400e', muted: '#78350f', font: 'sans', radius: 8 }),
      make('c-pembe',    'Şeker Pembe', 'canli', 'split-half',    { bg: '#fff', sidebarBg: '#ec4899', text: '#1a1a1a', accent: '#ec4899', muted: '#777', font: 'sans', radius: 12 }),
      make('c-yesim',    'Yeşim',       'canli', 'top-header',    { bg: '#f0fdf4', headerBg: '#10b981', text: '#022c22', accent: '#10b981', muted: '#166534', font: 'sans', radius: 14 }),
      make('c-nane',     'Nane',        'canli', 'centered',      { bg: '#ecfdf5', text: '#064e3b', accent: '#34d399', muted: '#6b7280', font: 'sans', radius: 20 }),
      make('c-titan',    'Titan',       'canli', 'left-sidebar',  { bg: '#fff', sidebarBg: '#dc2626', text: '#111', accent: '#dc2626', muted: '#666', font: 'sans', radius: 0 }),
      make('c-firtina',  'Fırtına',     'canli', 'gradient-full', { bg: '#1e40af', bgGradient: 'linear-gradient(135deg,#1d4ed8 0%,#7c3aed 100%)', text: '#fff', accent: '#60a5fa', muted: 'rgba(255,255,255,0.7)', font: 'sans', radius: 16 }),
      make('c-alev',     'Alev',        'canli', 'split-half',    { bg: '#fff7ed', sidebarBg: '#ea580c', text: '#431407', accent: '#ea580c', muted: '#78350f', font: 'sans', radius: 8 }),
      make('c-kristal',  'Kristal',     'canli', 'centered',      { bg: '#fff', text: '#1e1b4b', accent: '#6366f1', muted: '#6b7280', font: 'sans', radius: 24 }),
      make('c-volkan',   'Volkan',      'canli', 'gradient-full', { bg: '#7f1d1d', bgGradient: 'linear-gradient(135deg,#991b1b 0%,#c2410c 100%)', text: '#fef2f2', accent: '#fca5a5', muted: 'rgba(254,242,242,0.7)', font: 'sans', radius: 6 }),
      make('c-neon-g',   'Neon Yeşil',  'canli', 'dark-card',     { bg: '#052e16', text: '#f0fdf4', accent: '#4ade80', muted: 'rgba(240,253,244,0.6)', font: 'sans', radius: 12 }),
      make('c-okyanus',  'Okyanus',     'canli', 'left-standard', { bg: '#eff6ff', text: '#1e3a8a', accent: '#3b82f6', muted: '#64748b', font: 'sans', radius: 14, divider: true }),
    ],
  },
  {
    id: 'profesyonel', label: '💼 Profesyonel',
    configs: [
      make('p-lacivert',      'Lacivert',    'profesyonel', 'top-header',    { bg: '#f8fafc', headerBg: '#1e3a8a', text: '#0f172a', accent: '#1e3a8a', muted: '#475569', font: 'serif', radius: 0 }),
      make('p-kursun',        'Kurşun',      'profesyonel', 'left-standard', { bg: '#fff', text: '#111827', accent: '#374151', muted: '#6b7280', font: 'sans', radius: 4, divider: true }),
      make('p-okyanus',       'Okyanus',     'profesyonel', 'split-half',    { bg: '#fff', sidebarBg: '#0c4a6e', text: '#0c2340', accent: '#0369a1', muted: '#64748b', font: 'sans', radius: 0 }),
      make('p-gece-mavi',     'Gece Mavisi', 'profesyonel', 'left-sidebar',  { bg: '#f8fafc', sidebarBg: '#1e40af', text: '#1e3a8a', accent: '#1d4ed8', muted: '#475569', font: 'sans', radius: 8 }),
      make('p-orman',         'Orman',       'profesyonel', 'minimal',       { bg: '#fff', text: '#14532d', accent: '#166534', muted: '#6b7280', font: 'serif', radius: 0 }),
      make('p-bordo',         'Bordo',       'profesyonel', 'top-header',    { bg: '#fff5f5', headerBg: '#881337', text: '#1a0a0a', accent: '#881337', muted: '#6b7280', font: 'serif', radius: 0 }),
      make('p-celik',         'Çelik',       'profesyonel', 'centered',      { bg: '#f1f5f9', text: '#0f172a', accent: '#334155', muted: '#64748b', font: 'sans', radius: 8 }),
      make('p-koyu-teal',     'Derin Teal',  'profesyonel', 'left-standard', { bg: '#fff', text: '#134e4a', accent: '#0d9488', muted: '#6b7280', font: 'sans', radius: 6, divider: true }),
      make('p-antik',         'Antik',       'profesyonel', 'split-half',    { bg: '#fffbeb', sidebarBg: '#1c1917', text: '#1c1917', accent: '#d97706', muted: '#6b7280', font: 'serif', radius: 4 }),
      make('p-navy-beyaz',    'Denizci',     'profesyonel', 'minimal',       { bg: '#fff', text: '#1e3a8a', accent: '#1e3a8a', muted: '#94a3b8', font: 'sans', radius: 0 }),
      make('p-zeytin',        'Zeytin',      'profesyonel', 'left-sidebar',  { bg: '#fefce8', sidebarBg: '#3f6212', text: '#1a2e05', accent: '#4d7c0f', muted: '#6b7280', font: 'serif', radius: 8 }),
      make('p-kurumsal-mavi', 'Kurumsal',    'profesyonel', 'top-header',    { bg: '#eff6ff', headerBg: '#1d4ed8', text: '#1e3a8a', accent: '#2563eb', muted: '#6b7280', font: 'sans', radius: 0 }),
      make('p-asil-mor',      'Asil Mor',    'profesyonel', 'left-standard', { bg: '#faf5ff', text: '#3b0764', accent: '#7c3aed', muted: '#6b7280', font: 'sans', radius: 8, divider: true }),
      make('p-gece-koyu',     'Gece Pro',    'profesyonel', 'dark-card',     { bg: '#0f172a', text: '#e2e8f0', accent: '#60a5fa', muted: '#94a3b8', font: 'sans', radius: 8 }),
      make('p-gumus',         'Gümüş',       'profesyonel', 'centered',      { bg: '#f8fafc', text: '#1e293b', accent: '#475569', muted: '#94a3b8', font: 'sans', radius: 12 }),
    ],
  },
  {
    id: 'teknoloji', label: '⚡ Teknoloji',
    configs: [
      make('t-siberpunk',   'Siberpunk',     'teknoloji', 'dark-card',     { bg: '#0f0f23', text: '#e2e8ff', accent: '#818cf8', muted: '#6b7280', font: 'mono', radius: 4 }),
      make('t-matrix',      'Matrix',        'teknoloji', 'dark-card',     { bg: '#0a0f0a', text: '#4ade80', accent: '#22c55e', muted: '#166534', font: 'mono', radius: 0 }),
      make('t-uzay',        'Uzay',          'teknoloji', 'gradient-full', { bg: '#020617', bgGradient: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)', text: '#e0e7ff', accent: '#818cf8', muted: 'rgba(224,231,255,0.6)', font: 'sans', radius: 8 }),
      make('t-neon-mavi',   'Neon Mavi',     'teknoloji', 'left-sidebar',  { bg: '#0f172a', sidebarBg: '#1d4ed8', text: '#e2e8f0', accent: '#38bdf8', muted: '#64748b', font: 'mono', radius: 4 }),
      make('t-teal-koyu',   'Koyu Teal',     'teknoloji', 'gradient-full', { bg: '#042f2e', bgGradient: 'linear-gradient(135deg,#042f2e 0%,#134e4a 100%)', text: '#f0fdfa', accent: '#2dd4bf', muted: 'rgba(240,253,250,0.6)', font: 'sans', radius: 8 }),
      make('t-hacker',      'Hacker',        'teknoloji', 'split-half',    { bg: '#0a0a0a', sidebarBg: '#052e16', text: '#4ade80', accent: '#22c55e', muted: '#166534', font: 'mono', radius: 0 }),
      make('t-siyan',       'Siyan',         'teknoloji', 'top-header',    { bg: '#0c1a2e', headerBg: '#0891b2', text: '#e0f7fa', accent: '#22d3ee', muted: '#64748b', font: 'mono', radius: 6 }),
      make('t-galaksi',     'Galaksi',       'teknoloji', 'gradient-full', { bg: '#1e1b4b', bgGradient: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)', text: '#e0e7ff', accent: '#a5b4fc', muted: 'rgba(224,231,255,0.6)', font: 'sans', radius: 12 }),
      make('t-derin-mavi',  'Derin Mavi',    'teknoloji', 'dark-card',     { bg: '#172554', text: '#bfdbfe', accent: '#60a5fa', muted: '#3b82f6', font: 'sans', radius: 8 }),
      make('t-fosfor',      'Fosfor',        'teknoloji', 'dark-card',     { bg: '#0a0a0a', text: '#a3e635', accent: '#84cc16', muted: '#3f6212', font: 'mono', radius: 4 }),
      make('t-lazer-k',     'Lazer Kırmızı', 'teknoloji', 'left-sidebar',  { bg: '#0f0f0f', sidebarBg: '#dc2626', text: '#fef2f2', accent: '#f87171', muted: '#4b5563', font: 'mono', radius: 0 }),
      make('t-violet',      'Siber Mor',     'teknoloji', 'gradient-full', { bg: '#2e1065', bgGradient: 'linear-gradient(135deg,#2e1065 0%,#4c1d95 100%)', text: '#ede9fe', accent: '#c4b5fd', muted: 'rgba(237,233,254,0.6)', font: 'mono', radius: 8 }),
      make('t-gumus-koyu',  'Gümüş Karanlık','teknoloji', 'split-half',    { bg: '#111827', sidebarBg: '#1f2937', text: '#9ca3af', accent: '#6b7280', muted: '#4b5563', font: 'sans', radius: 4 }),
      make('t-elek-turuncu','Elektrik Turuncu','teknoloji','dark-card',    { bg: '#1c0a00', text: '#fff7ed', accent: '#f97316', muted: '#9a3412', font: 'mono', radius: 6 }),
      make('t-minimal-koyu','Minimal Koyu',  'teknoloji', 'minimal',       { bg: '#111827', text: '#f9fafb', accent: '#60a5fa', muted: '#6b7280', font: 'mono', radius: 0 }),
    ],
  },
  {
    id: 'dogal', label: '🌿 Doğal & Organik',
    configs: [
      make('d-adacayi', 'Adaçayı',  'dogal', 'left-standard', { bg: '#f0fdf4', text: '#14532d', accent: '#16a34a', muted: '#6b7280', font: 'serif', radius: 8, divider: true }),
      make('d-toprak',  'Toprak',   'dogal', 'split-half',    { bg: '#fef3c7', sidebarBg: '#78350f', text: '#1c1917', accent: '#92400e', muted: '#78716c', font: 'serif', radius: 4 }),
      make('d-orman',   'Orman',    'dogal', 'centered',      { bg: '#f0fdf4', text: '#052e16', accent: '#166534', muted: '#6b7280', font: 'serif', radius: 16 }),
      make('d-kiremit', 'Kiremit',  'dogal', 'top-header',    { bg: '#fff7ed', headerBg: '#c2410c', text: '#431407', accent: '#ea580c', muted: '#78350f', font: 'sans', radius: 8 }),
      make('d-zeytin',  'Zeytin',   'dogal', 'left-sidebar',  { bg: '#f7fee7', sidebarBg: '#3f6212', text: '#1a2e05', accent: '#65a30d', muted: '#6b7280', font: 'serif', radius: 6 }),
      make('d-kum',     'Kum',      'dogal', 'minimal',       { bg: '#fef9c3', text: '#713f12', accent: '#d97706', muted: '#9a7060', font: 'serif', radius: 0 }),
      make('d-yosun',   'Yosun',    'dogal', 'dark-card',     { bg: '#14532d', text: '#dcfce7', accent: '#4ade80', muted: '#86efac', font: 'sans', radius: 10 }),
      make('d-kil',     'Kil',      'dogal', 'centered',      { bg: '#fdf4ef', text: '#431407', accent: '#c2410c', muted: '#9a7060', font: 'sans', radius: 12 }),
      make('d-coknar',  'Çoknur',   'dogal', 'split-half',    { bg: '#f0fdf4', sidebarBg: '#166634', text: '#052e16', accent: '#16a34a', muted: '#6b7280', font: 'serif', radius: 0 }),
      make('d-tas',     'Taş',      'dogal', 'minimal',       { bg: '#f8fafc', text: '#374151', accent: '#6b7280', muted: '#9ca3af', font: 'sans', radius: 0 }),
      make('d-bambu',   'Bambu',    'dogal', 'left-standard', { bg: '#fefce8', text: '#3f3a00', accent: '#a16207', muted: '#6b7280', font: 'sans', radius: 6, divider: true }),
      make('d-okyanus', 'Okyanus',  'dogal', 'top-header',    { bg: '#f0f9ff', headerBg: '#0369a1', text: '#0c4a6e', accent: '#0284c7', muted: '#64748b', font: 'sans', radius: 12 }),
      make('d-gunes',   'Çöl Güneşi','dogal','gradient-full', { bg: '#fef3c7', bgGradient: 'linear-gradient(135deg,#fef3c7 0%,#fcd34d 100%)', text: '#78350f', accent: '#d97706', muted: '#92400e', font: 'serif', radius: 8 }),
      make('d-mercan',  'Mercan',   'dogal', 'left-sidebar',  { bg: '#fff1f2', sidebarBg: '#f43f5e', text: '#881337', accent: '#e11d48', muted: '#9d174d', font: 'sans', radius: 12 }),
    ],
  },
  {
    id: 'luks', label: '💎 Lüks & Premium',
    configs: [
      make('l-siyah-altin', 'Siyah Altın',  'luks', 'top-header',    { bg: '#0a0a0a', headerBg: '#0a0a0a', text: '#f5f0e0', accent: '#d4af37', muted: '#9a8060', font: 'serif', radius: 0 }),
      make('l-obsidyan',    'Obsidyen',      'luks', 'centered',      { bg: '#0f0f0f', text: '#f5f5f0', accent: '#d4af37', muted: '#9a9080', font: 'serif', radius: 8 }),
      make('l-antrasit',    'Antrasit',      'luks', 'split-half',    { bg: '#f5f5f0', sidebarBg: '#1c1c1c', text: '#1c1c1c', accent: '#c0a060', muted: '#6b6b6b', font: 'serif', radius: 0 }),
      make('l-gece-altin',  'Gece Altın',    'luks', 'gradient-full', { bg: '#0a0a0a', bgGradient: 'linear-gradient(135deg,#0a0a0a 0%,#1c1c1c 100%)', text: '#f0e6c0', accent: '#d4af37', muted: '#a08040', font: 'serif', radius: 4 }),
      make('l-mor-altin',   'Kraliyet',      'luks', 'left-sidebar',  { bg: '#1a0a2e', sidebarBg: '#2d1654', text: '#ede9fe', accent: '#d4af37', muted: '#7c6090', font: 'serif', radius: 8 }),
      make('l-sarap',       'Şarap',         'luks', 'minimal',       { bg: '#fff', text: '#4a0020', accent: '#881337', muted: '#6b7280', font: 'serif', radius: 0 }),
      make('l-platin',      'Platin',        'luks', 'dark-card',     { bg: '#1a1a1a', text: '#e8e8e8', accent: '#c0c0c0', muted: '#808080', font: 'sans', radius: 6 }),
      make('l-zumrut',      'Zümrüt',        'luks', 'split-half',    { bg: '#f0fdf9', sidebarBg: '#0f2a2a', text: '#0f2a2a', accent: '#d4af37', muted: '#6b7280', font: 'serif', radius: 4 }),
      make('l-bakir',       'Bakır',         'luks', 'top-header',    { bg: '#1c0a00', headerBg: '#7c2d12', text: '#fef3c7', accent: '#d97706', muted: '#9a7060', font: 'serif', radius: 0 }),
      make('l-siyah-mat',   'Mat Siyah',     'luks', 'left-standard', { bg: '#111', text: '#f9fafb', accent: '#f9fafb', muted: '#6b7280', font: 'sans', radius: 0, divider: true }),
      make('l-navy-altin',  'Navy Altın',    'luks', 'top-header',    { bg: '#0a1628', headerBg: '#0a1628', text: '#e2e8f0', accent: '#d4af37', muted: '#64748b', font: 'serif', radius: 0 }),
      make('l-gri-altin',   'Gri Altın',     'luks', 'centered',      { bg: '#f8f8f8', text: '#1a1a1a', accent: '#c0a030', muted: '#6b7280', font: 'serif', radius: 12 }),
      make('l-koyu-gul',    'Koyu Gül',      'luks', 'gradient-full', { bg: '#1a0010', bgGradient: 'linear-gradient(135deg,#1a0010 0%,#3d0020 100%)', text: '#fce7f3', accent: '#f9a8d4', muted: 'rgba(252,231,243,0.6)', font: 'serif', radius: 8 }),
      make('l-altin-beyaz', 'Altın Beyaz',   'luks', 'left-sidebar',  { bg: '#fffdf0', sidebarBg: '#1a1a1a', text: '#1a1a1a', accent: '#c0a030', muted: '#9a8040', font: 'serif', radius: 4 }),
    ],
  },
  {
    id: 'yaratici', label: '🎨 Yaratıcı & Sanatsal',
    configs: [
      make('y-gokkusagi',    'Gökkuşağı',    'yaratici', 'gradient-full', { bg: '#7c3aed', bgGradient: 'linear-gradient(135deg,#7c3aed 0%,#ec4899 50%,#f97316 100%)', text: '#fff', accent: '#fcd34d', muted: 'rgba(255,255,255,0.7)', font: 'sans', radius: 20 }),
      make('y-lavanta',      'Lavanta',      'yaratici', 'left-standard', { bg: '#faf5ff', text: '#3b0764', accent: '#7c3aed', muted: '#9061c0', font: 'sans', radius: 16, divider: true }),
      make('y-sakura',       'Sakura',       'yaratici', 'centered',      { bg: '#fdf2f8', text: '#831843', accent: '#db2777', muted: '#9d174d', font: 'sans', radius: 24 }),
      make('y-gunbatimi',    'Günbatımı',    'yaratici', 'gradient-full', { bg: '#f97316', bgGradient: 'linear-gradient(135deg,#f97316 0%,#ec4899 100%)', text: '#fff', accent: '#fcd34d', muted: 'rgba(255,255,255,0.8)', font: 'sans', radius: 16 }),
      make('y-ruya',         'Rüya',         'yaratici', 'split-half',    { bg: '#f0fdf4', sidebarBg: '#7c3aed', text: '#1a1a1a', accent: '#7c3aed', muted: '#6b7280', font: 'sans', radius: 16 }),
      make('y-seker-pembe',  'Şeker',        'yaratici', 'top-header',    { bg: '#fdf2f8', headerBg: '#ec4899', text: '#500724', accent: '#db2777', muted: '#9d174d', font: 'sans', radius: 16 }),
      make('y-opal',         'Opal',         'yaratici', 'gradient-full', { bg: '#0ea5e9', bgGradient: 'linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)', text: '#fff', accent: '#e0f2fe', muted: 'rgba(255,255,255,0.7)', font: 'sans', radius: 20 }),
      make('y-altin-gunes',  'Altın Güneş',  'yaratici', 'centered',      { bg: '#fffbeb', text: '#78350f', accent: '#f59e0b', muted: '#d97706', font: 'sans', radius: 20 }),
      make('y-gul-altin',    'Gül Altın',    'yaratici', 'minimal',       { bg: '#fff7f0', text: '#881337', accent: '#e11d48', muted: '#9f8090', font: 'sans', radius: 8 }),
      make('y-indigo-s',     'İndigo Şeftali','yaratici','gradient-full', { bg: '#4338ca', bgGradient: 'linear-gradient(135deg,#4338ca 0%,#f97316 100%)', text: '#fff', accent: '#fcd34d', muted: 'rgba(255,255,255,0.7)', font: 'sans', radius: 12 }),
      make('y-periwinkel',   'Periwinkle',   'yaratici', 'left-sidebar',  { bg: '#eef2ff', sidebarBg: '#6366f1', text: '#1e1b4b', accent: '#4f46e5', muted: '#6b7280', font: 'sans', radius: 14 }),
      make('y-leylak',       'Leylak',       'yaratici', 'left-standard', { bg: '#f5f3ff', text: '#2e1065', accent: '#7c3aed', muted: '#6b7280', font: 'sans', radius: 12, divider: true }),
      make('y-buz-koyu',     'Buz Mavisi',   'yaratici', 'top-header',    { bg: '#f0f9ff', headerBg: '#0284c7', text: '#0c4a6e', accent: '#0ea5e9', muted: '#64748b', font: 'sans', radius: 16 }),
      make('y-pastel-yesil', 'Pastel Yeşil', 'yaratici', 'centered',      { bg: '#f0fdf4', text: '#14532d', accent: '#4ade80', muted: '#86efac', font: 'sans', radius: 20 }),
    ],
  },
  {
    id: 'retro', label: '🕰️ Retro & Vintage',
    configs: [
      make('r-parsomen',   'Parşömen',       'retro', 'left-standard', { bg: '#fef9e7', text: '#2c1810', accent: '#8b4513', muted: '#a0826d', font: 'serif', radius: 4, divider: true }),
      make('r-sepya',      'Sepya',          'retro', 'top-header',    { bg: '#fef9e7', headerBg: '#8b4513', text: '#2c1810', accent: '#a0522d', muted: '#9a7060', font: 'serif', radius: 0 }),
      make('r-vin-yesil',  'Vintage Yeşil',  'retro', 'centered',      { bg: '#f0f7e6', text: '#1a2e1a', accent: '#4a7c59', muted: '#6b7a6b', font: 'serif', radius: 8 }),
      make('r-pas',        'Pas',            'retro', 'split-half',    { bg: '#fef3c7', sidebarBg: '#92400e', text: '#431407', accent: '#b45309', muted: '#78350f', font: 'serif', radius: 0 }),
      make('r-hardal',     'Hardal',         'retro', 'left-sidebar',  { bg: '#fffbeb', sidebarBg: '#ca8a04', text: '#1c1917', accent: '#a16207', muted: '#78716c', font: 'serif', radius: 4 }),
      make('r-soluk-teal', 'Soluk Teal',     'retro', 'minimal',       { bg: '#f0fdfa', text: '#134e4a', accent: '#5eead4', muted: '#9ca3af', font: 'serif', radius: 0 }),
      make('r-kahve',      'Kahve',          'retro', 'dark-card',     { bg: '#292011', text: '#fef9e7', accent: '#ca8a04', muted: '#9a8060', font: 'serif', radius: 4 }),
      make('r-yakik',      'Yakık Turuncu',  'retro', 'centered',      { bg: '#fff7ed', text: '#431407', accent: '#c2410c', muted: '#78350f', font: 'serif', radius: 12 }),
      make('r-pudra',      'Pudra',          'retro', 'left-standard', { bg: '#fdf2f8', text: '#500724', accent: '#9d174d', muted: '#9ca3af', font: 'serif', radius: 4, divider: true }),
      make('r-eski-mod',   'Eski Mod',       'retro', 'top-header',    { bg: '#fffbeb', headerBg: '#44403c', text: '#1c1917', accent: '#78716c', muted: '#9ca3af', font: 'serif', radius: 0 }),
      make('r-jukebox',    'Jukebox',        'retro', 'split-half',    { bg: '#fef9e7', sidebarBg: '#b91c1c', text: '#1c1917', accent: '#dc2626', muted: '#78716c', font: 'serif', radius: 4 }),
      make('r-daktilo',    'Daktilo',        'retro', 'minimal',       { bg: '#f5f0e8', text: '#1c1917', accent: '#57534e', muted: '#78716c', font: 'mono', radius: 0 }),
    ],
  },
  {
    id: 'gece', label: '🌙 Koyu & Gece',
    configs: [
      make('g-mutlak-kara',  'Mutlak Kara',   'gece', 'centered',      { bg: '#000000', text: '#f5f5f5', accent: '#ffffff', muted: '#6b7280', font: 'sans', radius: 12 }),
      make('g-lacivert',     'Gece Lacivert',  'gece', 'left-standard', { bg: '#0f172a', text: '#e2e8f0', accent: '#60a5fa', muted: '#94a3b8', font: 'sans', radius: 8, divider: true }),
      make('g-koyu-mor',     'Gece Moru',      'gece', 'gradient-full', { bg: '#1e0a3c', bgGradient: 'linear-gradient(135deg,#1e0a3c 0%,#2d1b69 100%)', text: '#ede9fe', accent: '#a78bfa', muted: 'rgba(237,233,254,0.6)', font: 'sans', radius: 12 }),
      make('g-antrasit',     'Antrasit',       'gece', 'split-half',    { bg: '#1c1c1c', sidebarBg: '#111111', text: '#e5e7eb', accent: '#9ca3af', muted: '#4b5563', font: 'sans', radius: 4 }),
      make('g-gece-mavisi',  'Gece Mavisi',    'gece', 'top-header',    { bg: '#172554', headerBg: '#0f172a', text: '#bfdbfe', accent: '#3b82f6', muted: '#4b5563', font: 'sans', radius: 8 }),
      make('g-okyanus-g',    'Okyanus Gecesi', 'gece', 'left-sidebar',  { bg: '#0f2a2a', sidebarBg: '#0a1f1f', text: '#ccfbf1', accent: '#2dd4bf', muted: '#4b5563', font: 'sans', radius: 6 }),
      make('g-siyah-min',    'Siyah Minimal',  'gece', 'minimal',       { bg: '#111827', text: '#f9fafb', accent: '#f9fafb', muted: '#4b5563', font: 'sans', radius: 0 }),
      make('g-indigo',       'Gece İndigo',    'gece', 'centered',      { bg: '#1e1b4b', text: '#e0e7ff', accent: '#818cf8', muted: '#4b5563', font: 'sans', radius: 16 }),
      make('g-bordo',        'Gece Bordo',     'gece', 'gradient-full', { bg: '#4a0020', bgGradient: 'linear-gradient(135deg,#3b0018 0%,#881337 100%)', text: '#fce7f3', accent: '#f9a8d4', muted: 'rgba(252,231,243,0.6)', font: 'sans', radius: 8 }),
      make('g-karbon',       'Karbon',         'gece', 'dark-card',     { bg: '#1a1a2e', text: '#e2e8f0', accent: '#7c3aed', muted: '#4b5563', font: 'sans', radius: 10 }),
      make('g-uzay',         'Uzay Siyahı',    'gece', 'split-half',    { bg: '#020617', sidebarBg: '#0f172a', text: '#e2e8f0', accent: '#818cf8', muted: '#4b5563', font: 'sans', radius: 8 }),
      make('g-gece-yesil',   'Gece Yeşil',     'gece', 'left-standard', { bg: '#052e16', text: '#dcfce7', accent: '#4ade80', muted: '#166534', font: 'sans', radius: 8, divider: true }),
      make('g-kuzey-yildizi','Kuzey Yıldızı',  'gece', 'gradient-full', { bg: '#020617', bgGradient: 'linear-gradient(135deg,#020617 0%,#0f172a 50%,#1e1b4b 100%)', text: '#e0e7ff', accent: '#818cf8', muted: 'rgba(224,231,255,0.6)', font: 'sans', radius: 12 }),
    ],
  },
  {
    id: 'minimal', label: '🤍 Minimal & Sade',
    configs: [
      make('m-beyaz',      'Saf Beyaz',    'minimal', 'minimal',       { bg: '#ffffff', text: '#111827', accent: '#111827', muted: '#9ca3af', font: 'sans', radius: 0 }),
      make('m-acik-gri',   'Açık Gri',     'minimal', 'minimal',       { bg: '#f9fafb', text: '#111827', accent: '#374151', muted: '#9ca3af', font: 'sans', radius: 4 }),
      make('m-krem',       'Krem',         'minimal', 'minimal',       { bg: '#fffbf2', text: '#1c1910', accent: '#6b5830', muted: '#9a8060', font: 'serif', radius: 0 }),
      make('m-bulut',      'Bulut',        'minimal', 'centered',      { bg: '#eff6ff', text: '#1e3a8a', accent: '#2563eb', muted: '#93c5fd', font: 'sans', radius: 16 }),
      make('m-soluk-mor',  'Soluk Mor',    'minimal', 'minimal',       { bg: '#faf5ff', text: '#3b0764', accent: '#7c3aed', muted: '#c4b5fd', font: 'sans', radius: 8 }),
      make('m-nane',       'Nane',         'minimal', 'centered',      { bg: '#f0fdfa', text: '#134e4a', accent: '#0d9488', muted: '#99f6e4', font: 'sans', radius: 12 }),
      make('m-blush',      'Blush',        'minimal', 'minimal',       { bg: '#fdf2f8', text: '#831843', accent: '#db2777', muted: '#f9a8d4', font: 'sans', radius: 8 }),
      make('m-cayir',      'Çayır',        'minimal', 'centered',      { bg: '#f0fdf4', text: '#14532d', accent: '#16a34a', muted: '#86efac', font: 'sans', radius: 12 }),
      make('m-sicak-beyaz','Sıcak Beyaz',  'minimal', 'left-standard', { bg: '#fffbf5', text: '#292524', accent: '#78716c', muted: '#a8a29e', font: 'sans', radius: 4, divider: true }),
      make('m-bulut-gri',  'Bulut Gri',    'minimal', 'minimal',       { bg: '#f1f5f9', text: '#334155', accent: '#475569', muted: '#94a3b8', font: 'sans', radius: 8 }),
      make('m-fildisi',    'Fildişi',      'minimal', 'centered',      { bg: '#fefce8', text: '#422006', accent: '#a16207', muted: '#d97706', font: 'serif', radius: 12 }),
      make('m-inci',       'İnci',         'minimal', 'minimal',       { bg: '#f8f8f8', text: '#1a1a1a', accent: '#6b7280', muted: '#d1d5db', font: 'sans', radius: 0 }),
      make('m-lacivert-ac','Açık Lacivert', 'minimal', 'left-standard', { bg: '#f8fafc', text: '#1e3a8a', accent: '#3b82f6', muted: '#94a3b8', font: 'sans', radius: 8, divider: true }),
    ],
  },
  {
    id: 'gradient', label: '🌈 Gradient & Renkli',
    configs: [
      make('gr-okyanus',  'Okyanus',    'gradient', 'gradient-full', { bg: '#0ea5e9', bgGradient: 'linear-gradient(135deg,#0284c7 0%,#0ea5e9 50%,#38bdf8 100%)', text: '#fff', accent: '#e0f2fe', muted: 'rgba(255,255,255,0.7)', font: 'sans', radius: 12 }),
      make('gr-sunset',   'Sunset',     'gradient', 'gradient-full', { bg: '#f97316', bgGradient: 'linear-gradient(135deg,#dc2626 0%,#f97316 50%,#fbbf24 100%)', text: '#fff', accent: '#fef3c7', muted: 'rgba(255,255,255,0.7)', font: 'sans', radius: 16 }),
      make('gr-orman',    'Orman',      'gradient', 'gradient-full', { bg: '#16a34a', bgGradient: 'linear-gradient(135deg,#15803d 0%,#16a34a 50%,#4ade80 100%)', text: '#fff', accent: '#dcfce7', muted: 'rgba(255,255,255,0.7)', font: 'sans', radius: 8 }),
      make('gr-seftali',  'Şeftali',    'gradient', 'gradient-full', { bg: '#ec4899', bgGradient: 'linear-gradient(135deg,#be185d 0%,#ec4899 50%,#fb7185 100%)', text: '#fff', accent: '#fce7f3', muted: 'rgba(255,255,255,0.7)', font: 'sans', radius: 20 }),
      make('gr-buz',      'Buz',        'gradient', 'gradient-full', { bg: '#06b6d4', bgGradient: 'linear-gradient(135deg,#0e7490 0%,#06b6d4 50%,#67e8f9 100%)', text: '#fff', accent: '#cffafe', muted: 'rgba(255,255,255,0.7)', font: 'sans', radius: 12 }),
      make('gr-lavanta',  'Lavanta',    'gradient', 'gradient-full', { bg: '#7c3aed', bgGradient: 'linear-gradient(135deg,#5b21b6 0%,#7c3aed 50%,#a78bfa 100%)', text: '#fff', accent: '#ede9fe', muted: 'rgba(255,255,255,0.7)', font: 'sans', radius: 16 }),
      make('gr-altin',    'Altın',      'gradient', 'gradient-full', { bg: '#d97706', bgGradient: 'linear-gradient(135deg,#b45309 0%,#d97706 50%,#fbbf24 100%)', text: '#fff', accent: '#fef3c7', muted: 'rgba(255,255,255,0.7)', font: 'sans', radius: 8 }),
      make('gr-gul',      'Gül',        'gradient', 'gradient-full', { bg: '#e11d48', bgGradient: 'linear-gradient(135deg,#9f1239 0%,#e11d48 50%,#fb7185 100%)', text: '#fff', accent: '#fecdd3', muted: 'rgba(255,255,255,0.7)', font: 'sans', radius: 16 }),
      make('gr-nane',     'Nane',       'gradient', 'gradient-full', { bg: '#0d9488', bgGradient: 'linear-gradient(135deg,#0f766e 0%,#0d9488 50%,#2dd4bf 100%)', text: '#fff', accent: '#ccfbf1', muted: 'rgba(255,255,255,0.7)', font: 'sans', radius: 12 }),
      make('gr-galaksi',  'Galaksi',    'gradient', 'gradient-full', { bg: '#1e1b4b', bgGradient: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#7c3aed 100%)', text: '#fff', accent: '#c4b5fd', muted: 'rgba(255,255,255,0.6)', font: 'sans', radius: 16 }),
      make('gr-degrade',  'Degrade',    'gradient', 'gradient-full', { bg: '#4f46e5', bgGradient: 'linear-gradient(135deg,#4f46e5 0%,#06b6d4 100%)', text: '#fff', accent: '#cffafe', muted: 'rgba(255,255,255,0.7)', font: 'sans', radius: 12 }),
      make('gr-seker',    'Şeker',      'gradient', 'gradient-full', { bg: '#ec4899', bgGradient: 'linear-gradient(135deg,#a855f7 0%,#ec4899 50%,#f97316 100%)', text: '#fff', accent: '#fde68a', muted: 'rgba(255,255,255,0.7)', font: 'sans', radius: 20 }),
      make('gr-okyanus2', 'Derin',      'gradient', 'split-half',    { bg: '#fff', sidebarBg: '#0ea5e9', bgGradient: undefined, text: '#0c4a6e', accent: '#0284c7', muted: '#64748b', font: 'sans', radius: 12 }),
      make('gr-kuzgun',   'Kuzgun',     'gradient', 'gradient-full', { bg: '#111827', bgGradient: 'linear-gradient(135deg,#111827 0%,#1f2937 50%,#374151 100%)', text: '#f9fafb', accent: '#fbbf24', muted: 'rgba(249,250,251,0.6)', font: 'sans', radius: 8 }),
    ],
  },
]

export const templateConfigMap: Record<string, TemplateConfig> = {}
for (const cat of templateCategories) {
  for (const cfg of cat.configs) {
    templateConfigMap[cfg.id] = cfg
  }
}

export const LEGACY_TEMPLATE_IDS = [
  'klasik', 'kapak', 'bolunmus', 'gece', 'yanpanel',
  'minimal', 'kurumsal', 'cembersel', 'sicakkart', 'mozaik',
  'bateman', 'gradient', 'neon', 'retro', 'cam', 'bold', 'ikirenk', 'serbest',
]

export const ALL_TEMPLATE_IDS: string[] = [
  ...LEGACY_TEMPLATE_IDS,
  ...templateCategories.flatMap(c => c.configs.map(t => t.id)),
]
