import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Warning, UsersThree } from '@phosphor-icons/react'
import TopClients from '../TopClients'
import RiskClients from '../RiskClients'
import AllClients from '../AllClients'

export default function ClientesPage({ data }) {
  const [activeTab, setActiveTab] = useState('top')

  if (!data) return null

  const tabs = [
    { id: 'top', label: 'Top Clientes', icon: Crown },
    { id: 'risco', label: 'Em Risco', icon: Warning },
    { id: 'todos', label: 'Todos', icon: UsersThree },
  ]

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(15, 22, 40, 0.9), rgba(12, 17, 32, 0.9))',
      backdropFilter: 'blur(20px)',
      borderRadius: 20,
      border: '1px solid rgba(255,255,255,0.06)',
      padding: 28, position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: -1, left: '10%', right: '10%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.15), transparent)'
      }} />

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: active ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : 'rgba(15, 22, 40, 0.6)',
                color: active ? '#fff' : '#64748b',
                border: '1px solid',
                borderColor: active ? 'transparent' : 'rgba(255,255,255,0.06)',
                padding: '10px 22px', borderRadius: 12,
                cursor: 'pointer', fontSize: 13, fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'Inter',
                boxShadow: active ? '0 4px 15px rgba(139, 92, 246, 0.3)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={16} weight={active ? 'fill' : 'bold'} />
              {tab.label}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'top' && <TopClients clientes={data.top_clientes || []} />}
          {activeTab === 'risco' && <RiskClients clientes={data.clientes_risco || []} />}
          {activeTab === 'todos' && <AllClients clientes={data.clientes || []} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
