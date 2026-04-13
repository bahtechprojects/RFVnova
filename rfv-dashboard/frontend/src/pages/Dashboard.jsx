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
import PlanoAcao from '../components/pages/PlanoAcao'

const pageTitles = {
  visao: { title: 'Visão Geral', subtitle: 'Panorama completo da base de clientes' },
  plano: { title: 'Plano de Ação', subtitle: 'Ações priorizadas para o time comercial esta semana' },
  segmentacao: { title: 'Segmentação', subtitle: 'Classificação dos clientes por comportamento de compra' },
  analise: { title: 'Análise RFV', subtitle: 'Matriz e concentração de receita por score' },
  saude: { title: 'Saúde da Base', subtitle: 'Indicadores de retenção, ativação e valor' },
  insights: { title: 'Insights', subtitle: 'Recomendações e simulador de recuperação' },
  clientes: { title: 'Clientes', subtitle: 'Detalhamento individual de todos os clientes' },
}

export default function Dashboard({ onLogout }) {
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
      justifyContent: 'center', flexDirection: 'column', gap: 16,
      background: '#f8f9fb'
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid #e2e8f0',
          borderTopColor: '#1e3a5f'
        }}
      />
      <span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>Carregando dados...</span>
    </div>
  )

  if (!data) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
      Empresa não encontrada
    </div>
  )

  const currentPage = pageTitles[activePage]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8f9fb' }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media print {
          body { background: #fff !important; color: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <Sidebar
        active={activePage}
        onChange={setActivePage}
        empresaNome={data.empresa_nome}
        onLogout={onLogout}
      />

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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {activePage === 'visao' && <VisaoGeral data={data} onNavigate={(page) => setActivePage(page)} />}
            {activePage === 'plano' && <PlanoAcao data={data} />}
            {activePage === 'segmentacao' && <Segmentacao data={data} />}
            {activePage === 'analise' && <Analise data={data} />}
            {activePage === 'saude' && <Saude data={data} />}
            {activePage === 'insights' && <InsightsPage data={data} />}
            {activePage === 'clientes' && <ClientesPage data={data} />}
          </motion.div>
        </AnimatePresence>

        <div style={{
          marginTop: 40, paddingTop: 20,
          borderTop: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingBottom: 20
        }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            Powered by <span style={{ color: '#1e3a5f', fontWeight: 600 }}>Bahtech</span> — Nova Automação RFV Analytics
          </span>
          <span style={{ fontSize: 11, color: '#cbd5e1' }}>
            Dados atualizados automaticamente
          </span>
        </div>
      </main>
    </div>
  )
}
