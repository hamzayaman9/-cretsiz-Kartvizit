'use client'

interface Props {
  size?: number
  color?: string
  iColor?: string
}

export default function LogoText({ size = 18, color = 'var(--ink)', iColor = '#2563eb' }: Props) {
  return (
    <span style={{
      fontSize: size, fontWeight: 700, color,
      fontFamily: 'var(--font-display)',
      display: 'inline-flex', alignItems: 'center',
      letterSpacing: '-0.01em',
    }}>
      Kart
      <span style={{ display: 'inline-flex', alignItems: 'center', margin: '0 2px' }}>
        <svg width={size * 0.78} height={size} viewBox="0 0 14 18" fill="none" style={{ display: 'block' }}>
          <circle cx="2.5" cy="9" r="1.8" fill={iColor}/>
          <rect x="5.5" y="7.2" width="8" height="3.6" rx="1.8" fill={iColor}/>
        </svg>
      </span>
      vizitim
    </span>
  )
}
