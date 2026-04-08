import { ChartBar } from '@phosphor-icons/react'

export default function BahtechLogo({ size = 'md' }) {
  const sizes = {
    sm: { icon: 13, text: 14, box: 24, radius: 6 },
    md: { icon: 16, text: 18, box: 32, radius: 8 },
    lg: { icon: 22, text: 24, box: 40, radius: 10 },
  }
  const s = sizes[size] || sizes.md

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: s.box, height: s.box, borderRadius: s.radius,
        background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 16px rgba(139, 92, 246, 0.25)'
      }}>
        <ChartBar size={s.icon} weight="bold" color="#fff" />
      </div>
      <span style={{ fontSize: s.text, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>
        <span style={{ color: '#8b5cf6' }}>bah</span>tech
      </span>
    </div>
  )
}
