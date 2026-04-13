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
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                background: active ? '#1e3a5f' : '#f8fafc',
                color: active ? '#fff' : '#64748b',
                border: `1px solid ${active ? '#1e3a5f' : '#e2e8f0'}`,
                padding: '8px 20px', borderRadius: 10,
                cursor: 'pointer', fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter'
              }}>
              <Icon size={15} weight={active ? 'fill' : 'bold'} />
              {tab.label}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
          {activeTab === 'top' && <TopClients clientes={data.top_clientes || []} />}
          {activeTab === 'risco' && <RiskClients clientes={data.clientes_risco || []} />}
          {activeTab === 'todos' && <AllClients clientes={data.clientes || []} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
