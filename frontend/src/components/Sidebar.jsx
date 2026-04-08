import { motion } from 'framer-motion'
import { ChartBar, ChartPie, Lightbulb, UsersThree, GridFour, Heartbeat } from '@phosphor-icons/react'

const menuItems = [
  { id: 'visao', label: 'Visão Geral', icon: ChartBar },
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
      background: 'linear-gradient(180deg, #0a0e1a, #0c1120)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 60
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10
        }}>
          <img
            src="/logo-nova.png"
            alt="Nova Automação"
            style={{ height: 36, objectFit: 'contain' }}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.parentElement.innerHTML = '<span style="font-weight:900;color:#1e293b;font-size:14px;">NOVA AUTOMAÇÃO</span>'
            }}
          />
        </div>
        <div style={{ fontSize: 11, color: '#475569', textAlign: 'center', fontWeight: 500 }}>
          Análise RFV de Clientes
        </div>
      </div>

      {/* Menu */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'Inter',
                color: isActive ? '#fff' : '#64748b',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.1))'
                  : 'transparent',
                transition: 'all 0.2s',
                width: '100%',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3,
                    borderRadius: 2,
                    background: '#8b5cf6'
                  }}
                />
              )}
              <Icon size={20} weight={isActive ? 'fill' : 'regular'} color={isActive ? '#8b5cf6' : '#64748b'} />
              {item.label}
            </motion.button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 10
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 10px rgba(139, 92, 246, 0.2)'
        }}>
          <ChartBar size={14} weight="bold" color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>
            <span style={{ color: '#8b5cf6' }}>bah</span>tech
          </div>
          <div style={{ fontSize: 9, color: '#475569', fontWeight: 500 }}>RFV Analytics</div>
        </div>
      </div>
    </div>
  )
}
