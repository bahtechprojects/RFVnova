import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import PageHeader from '../components/PageHeader'
import VisaoGeral from '../components/pages/VisaoGeral'
import Segmentacao from '../components/pages/Segmentacao'
import Analise from '../components/pages/Analise'
import Saude from '../components/pages/Saude'
import InsightsPage from '../components/pages/InsightsPage'
import ClientesPage from '../components/pages/ClientesPage'

const pageTitles = {
  visao: { title: 'Visão Geral', subtitle: 'Panorama completo da base de clientes' },
  segmentacao: { title: 'Segmentação', subtitle: 'Classificação dos clientes por comportamento de compra' },
  analise: { title: 'Análise RFV', subtitle: 'Matriz e concentração de receita por score' },
  saude: { title: 'Saúde da Base', subtitle: 'Indicadores de retenção, ativação e valor' },
  insights: { title: 'Insights', subtitle: 'Recomendações e ações sugeridas baseadas nos dados' },
  clientes: { title: 'Clientes', subtitle: 'Detalhamento individual de todos os clientes' },
}

export default function Dashboard() {
  const { empresaId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activePage, setActivePage] = useState('visao')

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

  const currentPage = pageTitles[activePage]

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media print {
          body { background: #fff !important; color: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* Sidebar */}
      <Sidebar
        active={activePage}
        onChange={setActivePage}
        empresaNome={data.empresa_nome}
      />

      {/* Main Content */}
      <main style={{
        marginLeft: 240,
        flex: 1,
        padding: '28px 36px',
        minHeight: '100vh'
      }}>
        <PageHeader
          title={currentPage.title}
          subtitle={currentPage.subtitle}
          data={data}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {activePage === 'visao' && <VisaoGeral data={data} />}
            {activePage === 'segmentacao' && <Segmentacao data={data} />}
            {activePage === 'analise' && <Analise data={data} />}
            {activePage === 'saude' && <Saude data={data} />}
            {activePage === 'insights' && <InsightsPage data={data} />}
            {activePage === 'clientes' && <ClientesPage data={data} />}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div style={{
          marginTop: 40, paddingTop: 20,
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingBottom: 20
        }}>
          <span style={{ fontSize: 12, color: '#475569' }}>
            Powered by <span style={{ color: '#8b5cf6', fontWeight: 700 }}>Bahtech</span> — RFV Analytics
          </span>
          <span style={{ fontSize: 11, color: '#334155' }}>
            Dados atualizados automaticamente
          </span>
        </div>
      </main>
    </div>
  )
}
