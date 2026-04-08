import { motion } from 'framer-motion'
import { ChartBar, ChartPie, Lightbulb, UsersThree, GridFour, Heartbeat, ArrowLeft } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

const menuItems = [
  { id: 'visao', label: 'Visao Geral', icon: ChartBar },
  { id: 'segmentacao', label: 'Segmentacao', icon: ChartPie },
  { id: 'analise', label: 'Analise RFV', icon: GridFour },
  { id: 'saude', label: 'Saude da Base', icon: Heartbeat },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'clientes', label: 'Clientes', icon: UsersThree },
]

export default function Sidebar({ active, onChange, empresaNome, logoUrl }) {
  return (
    <div style={{
      width: 240,
      height: '100vh',
      position: 'fixed',
      left: 0, top: 0,
      background: '#080b14',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 60
    }}>
      {/* Back + Brand */}
      <div style={{
        padding: '18px 18px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 14,
          transition: 'color 0.2s'
        }}>
          <ArrowLeft size={12} weight="bold" /> Voltar ao inicio
        </Link>

        {/* Logo area */}
        <div style={{
          background: '#fff',
          borderRadius: 10,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src="/logo-nova.png"
            alt={empresaNome}
            style={{ height: 32, objectFit: 'contain' }}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.parentElement.innerHTML = `<span style="font-weight:800;color:#1e293b;font-size:13px;">${empresaNome || 'CLIENTE'}</span>`
            }}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: '#334155',
          textTransform: 'uppercase', letterSpacing: 1.5,
          padding: '8px 14px 10px', userSelect: 'none'
        }}>
          Menu
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '11px 14px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                fontFamily: 'Inter',
                color: isActive ? '#fff' : '#64748b',
                background: isActive ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
                transition: 'all 0.15s',
                width: '100%',
                textAlign: 'left',
                position: 'relative'
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent'
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  style={{
                    position: 'absolute', left: 0, top: '25%', bottom: '25%', width: 3,
                    borderRadius: 2, background: '#8b5cf6'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={18} weight={isActive ? 'fill' : 'regular'} color={isActive ? '#8b5cf6' : '#64748b'} />
              {item.label}
            </motion.button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '14px 18px',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img
            src="/logo-bahtech.png"
            alt="Bahtech"
            style={{ height: 24, objectFit: 'contain' }}
          />
          <div style={{ fontSize: 9, color: '#334155', fontWeight: 500 }}>RFV Analytics v1.0</div>
        </div>
      </div>
    </div>
  )
}
