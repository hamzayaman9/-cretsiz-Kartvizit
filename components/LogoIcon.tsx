interface Props {
  size?: number
}

export default function LogoIcon({ size = 36 }: Props) {
  const r = size / 36
  return (
    <div style={{
      width: size, height: size,
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      borderRadius: size * 0.278,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 20 20" fill="none">
        <circle cx="3" cy="10" r="2.5" fill="white" />
        <rect x="7" y="7.8" width="11" height="4.4" rx="2.2" fill="white" />
      </svg>
    </div>
  )
}
