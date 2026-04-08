import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChartBar, Lightning, Crown, Warning, UsersThree, Info } from '@phosphor-icons/react'
import KPICards from '../components/KPICards'
import SegmentCards from '../components/SegmentCards'
import Charts from '../components/Charts'
import TopClients from '../components/TopClients'
import RiskClients from '../components/RiskClients'
import AllClients from '../components/AllClients'

export default function Dashboard() {
  const { empresaId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('top')

  useEffect(() => {
    fetch(`/api/empresa/${empresaId}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [empresaId])

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', gap: 16
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{
          width: 44, height: 44, borderRadius: '50%',
          border: '3px solid rgba(139, 92, 246, 0.15)',
          borderTopColor: '#8b5cf6'
        }}
      />
      <span style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>Carregando dados...</span>
    </div>
  )

  if (!data) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
      Empresa não encontrada
    </div>
  )

  const tabs = [
    { id: 'top', label: 'Top Clientes', icon: Crown },
    { id: 'risco', label: 'Em Risco', icon: Warning },
    { id: 'todos', label: 'Todos os Clientes', icon: UsersThree },
  ]

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          background: 'rgba(12, 17, 32, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '12px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#64748b', fontSize: 13, fontWeight: 600,
            padding: '6px 12px', borderRadius: 8,
            transition: 'all 0.2s',
            border: '1px solid transparent'
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#8b5cf6'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'transparent' }}
          >
            <ArrowLeft size={16} weight="bold" /> Voltar
          </Link>
          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.25)'
            }}>
              <ChartBar size={16} weight="bold" color="#fff" />
            </div>
            <div>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>
                <span style={{ color: '#8b5cf6' }}>RFV</span> — {data.empresa_nome}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(34, 197, 94, 0.08)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#22c55e'
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
              boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)',
              animation: 'pulse 2s infinite'
            }} />
            Sincronizado
          </div>
          <span style={{ color: '#475569', fontSize: 12, fontWeight: 500 }}>
            {data.generated_at ? new Date(data.generated_at).toLocaleString('pt-BR') : ''}
          </span>
        </div>
      </motion.header>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '28px 28px' }}>
        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          style={{ marginBottom: 28 }}
        >
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: -0.8 }}>
            Dashboard RFV
          </h1>
          <p style={{ color: '#475569', fontSize: 14, marginTop: 4, fontWeight: 500 }}>
            Segmentação inteligente por Recência, Frequência e Valor
          </p>
        </motion.div>

        {/* KPIs */}
        <KPICards resumo={data.resumo} />

        {/* Segmentos */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'linear-gradient(145deg, rgba(15, 22, 40, 0.9), rgba(12, 17, 32, 0.9))',
            backdropFilter: 'blur(20px)',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.06)',
            padding: 28, marginBottom: 28,
            position: 'relative', overflow: 'hidden'
          }}>
          <div style={{
            position: 'absolute', top: -1, left: '10%', right: '10%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), transparent)'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>
              Segmentação de Clientes
            </h2>
            <span style={{
              fontSize: 12, color: '#8b5cf6', fontWeight: 600,
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              padding: '4px 12px', borderRadius: 20
            }}>
              {data.segmentos?.length || 0} segmentos
            </span>
          </div>
          <SegmentCards segmentos={data.segmentos || []} />
        </motion.div>

        {/* Charts */}
        <Charts segmentos={data.segmentos || []} />

        {/* Tabs + Tables */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{
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
                    background: active
                      ? 'linear-gradient(135deg, #8b5cf6, #6366f1)'
                      : 'rgba(15, 22, 40, 0.6)',
                    color: active ? '#fff' : '#64748b',
                    border: '1px solid',
                    borderColor: active ? 'transparent' : 'rgba(255,255,255,0.06)',
                    padding: '10px 22px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
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
        </motion.div>

        {/* Metodologia */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            background: 'linear-gradient(145deg, rgba(15, 22, 40, 0.6), rgba(12, 17, 32, 0.6))',
            backdropFilter: 'blur(20px)',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.04)',
            padding: 28, marginTop: 28, fontSize: 13, color: '#64748b'
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Info size={18} weight="bold" color="#8b5cf6" />
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#94a3b8', letterSpacing: -0.2 }}>
              Metodologia RFV
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { letter: 'R', name: 'Recência', desc: 'Dias desde a última compra. Quanto menor, melhor (score 5).', color: '#f97316' },
              { letter: 'F', name: 'Frequência', desc: 'Quantidade de pedidos realizados. Quanto maior, melhor (score 5).', color: '#3b82f6' },
              { letter: 'V', name: 'Valor', desc: 'Valor total de compras acumulado. Quanto maior, melhor (score 5).', color: '#22c55e' }
            ].map(item => (
              <div key={item.letter} style={{
                padding: 20, background: 'rgba(6, 9, 18, 0.5)', borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 32, height: 32, borderRadius: 10,
                    background: `${item.color}15`, color: item.color,
                    fontWeight: 900, fontSize: 16
                  }}>{item.letter}</span>
                  <span style={{ fontWeight: 700, color: item.color }}>{item.name}</span>
                </div>
                <span style={{ lineHeight: 1.6 }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
