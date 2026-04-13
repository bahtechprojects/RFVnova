import { motion } from 'framer-motion'
import { ChartBar, ChartPie, Lightbulb, UsersThree, GridFour, Heartbeat, ClipboardText } from '@phosphor-icons/react'

const menuItems = [
  { id: 'visao', label: 'Visão Geral', icon: ChartBar },
  { id: 'plano', label: 'Plano de Ação', icon: ClipboardText },
  { id: 'segmentacao', label: 'Segmentação', icon: ChartPie },
  { id: 'analise', label: 'Análise RFV', icon: GridFour },
  { id: 'saude', label: 'Saúde da Base', icon: Heartbeat },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'clientes', label: 'Clientes', icon: UsersThree },
]

export default function Sidebar({ active, onChange, empresaNome }) {
  return (
    <div style={{
      width: 240,
      height: '100vh',
      position: 'fixed',
      left: 0, top: 0,
      background: '#fff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 60
    }}>
      {/* Brand */}
      <div style={{
        padding: '20px 18px 16px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{
          borderRadius: 10,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src="/logo-nova.png"
            alt={empresaNome}
            style={{ height: 38, objectFit: 'contain' }}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.parentElement.innerHTML = `<span style="font-weight:800;color:#1e3a5f;font-size:14px;">${empresaNome || 'NOVA'}</span>`
            }}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: '#94a3b8',
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
                color: isActive ? '#1e3a5f' : '#64748b',
                background: isActive ? '#f0f4f8' : 'transparent',
                transition: 'all 0.15s',
                width: '100%',
                textAlign: 'left',
                position: 'relative'
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = '#f8fafc'
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
                    borderRadius: 2, background: '#1e3a5f'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={18} weight={isActive ? 'fill' : 'regular'} color={isActive ? '#1e3a5f' : '#94a3b8'} />
              {item.label}
            </motion.button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '14px 18px',
        borderTop: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img
            src="/logo-bahtech.png"
            alt="Bahtech"
            style={{ height: 18, objectFit: 'contain', filter: 'brightness(0)', opacity: 0.3 }}
          />
          <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 500 }}>RFV Analytics v1.0</div>
        </div>
      </div>
    </div>
  )
}
