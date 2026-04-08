import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChartBar, Crown, Warning, UsersThree, Info, Printer } from '@phosphor-icons/react'
import KPICards from '../components/KPICards'
import HealthScore from '../components/HealthScore'
import SegmentCards from '../components/SegmentCards'
import Charts from '../components/Charts'
import RFVMatrix from '../components/RFVMatrix'
import Insights from '../components/Insights'
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
      {/* Header com logo */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          background: 'rgba(12, 17, 32, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '10px 36px',
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
            transition: 'color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#8b5cf6'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
          >
            <ArrowLeft size={16} weight="bold" /> Voltar
          </Link>
          <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.06)' }} />

          {/* Logo do cliente */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              background: '#fff',
              borderRadius: 10,
              padding: '4px 10px',
              display: 'flex', alignItems: 'center',
              height: 38
            }}>
              <img
                src="/logo-nova.png"
                alt="Nova Automação"
                style={{ height: 28, objectFit: 'contain' }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: -0.3, lineHeight: 1.2 }}>
                {data.empresa_nome}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>
                Análise RFV de Clientes
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.print()}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, padding: '7px 14px',
              color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter'
            }}
          >
            <Printer size={14} weight="bold" /> Exportar PDF
          </motion.button>
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
            Atualizado
          </div>
          <span style={{ color: '#475569', fontSize: 12, fontWeight: 500 }}>
            {data.generated_at ? new Date(data.generated_at).toLocaleString('pt-BR') : ''}
          </span>
        </div>
      </motion.header>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media print {
          body { background: #fff !important; color: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          header { position: relative !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '28px 28px' }}>
        {/* Section: Visão Geral */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ marginBottom: 28 }}
        >
          <div style={{
            fontSize: 10, fontWeight: 800, color: '#64748b',
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8
          }}>
            Visão Geral
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: -0.8 }}>
            Dashboard de Segmentação
            <span style={{
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginLeft: 10
            }}>RFV</span>
          </h1>
          <p style={{ color: '#475569', fontSize: 14, marginTop: 6, fontWeight: 500, maxWidth: 600 }}>
            Análise completa da base de clientes segmentada por Recência, Frequência e Valor de compras
          </p>
        </motion.div>

        {/* KPIs */}
        <KPICards resumo={data.resumo} />

        {/* Saúde da Base */}
        <HealthScore resumo={data.resumo} segmentos={data.segmentos} />

        {/* Section: Segmentação */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          style={{
            fontSize: 10, fontWeight: 800, color: '#64748b',
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12, marginTop: 8
          }}
        >
          Segmentação
        </motion.div>

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

        {/* Section: Análise Avançada */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          style={{
            fontSize: 10, fontWeight: 800, color: '#64748b',
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12, marginTop: 8
          }}
        >
          Análise Avançada
        </motion.div>

        {/* Matriz RFV + Concentração */}
        <RFVMatrix clientes={data.clientes || []} />

        {/* Insights */}
        <Insights
          resumo={data.resumo}
          segmentos={data.segmentos || []}
          clientes={data.clientes || []}
        />

        {/* Section: Clientes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.33 }}
          style={{
            fontSize: 10, fontWeight: 800, color: '#64748b',
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12, marginTop: 8
          }}
        >
          Detalhamento de Clientes
        </motion.div>

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
              { letter: 'R', name: 'Recência', desc: 'Dias desde a última compra. Quanto menor, melhor (score 5). Identifica quem está ativo vs. inativo.', color: '#f97316' },
              { letter: 'F', name: 'Frequência', desc: 'Quantidade de pedidos realizados. Quanto maior, melhor (score 5). Mostra engajamento e recorrência.', color: '#3b82f6' },
              { letter: 'V', name: 'Valor', desc: 'Valor total acumulado em compras. Quanto maior, melhor (score 5). Reflete a relevância financeira.', color: '#22c55e' }
            ].map(item => (
              <div key={item.letter} style={{
                padding: 20, background: 'rgba(6, 9, 18, 0.5)', borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 36, height: 36, borderRadius: 10,
                    background: `${item.color}15`, color: item.color,
                    fontWeight: 900, fontSize: 18,
                    border: `1px solid ${item.color}25`
                  }}>{item.letter}</span>
                  <span style={{ fontWeight: 800, color: item.color, fontSize: 14 }}>{item.name}</span>
                </div>
                <span style={{ lineHeight: 1.7, fontSize: 12 }}>{item.desc}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 24, paddingTop: 20,
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 12px rgba(139, 92, 246, 0.2)'
              }}>
                <ChartBar size={16} weight="bold" color="#fff" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>
                Powered by <span style={{ color: '#8b5cf6' }}>Bahtech</span>
              </span>
            </div>
            <span style={{ fontSize: 11, color: '#475569' }}>
              Score total: 3 (pior) a 15 (melhor) | Dados atualizados automaticamente
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
