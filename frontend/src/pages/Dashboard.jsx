import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, RefreshCw } from 'lucide-react'
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
      <RefreshCw size={24} className="spin" /> <span style={{ marginLeft: 12 }}>Carregando dados...</span>
    </div>
  )

  if (!data) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
      Empresa não encontrada
    </div>
  )

  const tabs = [
    { id: 'top', label: 'Top Clientes' },
    { id: 'risco', label: 'Em Risco' },
    { id: 'todos', label: 'Todos os Clientes' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #0f1629, #1a1f3a)',
        borderBottom: '1px solid #1e2740',
        padding: '14px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 13 }}>
            <ArrowLeft size={16} /> Voltar
          </Link>
          <div style={{ width: 1, height: 24, background: '#1e2740' }} />
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
            <span style={{ color: '#8b5cf6' }}>RFV</span> — {data.empresa_nome}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#0f2a1a', color: '#22c55e',
            padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
            Sincronizado
          </div>
          <span style={{ color: '#64748b' }}>
            {data.generated_at ? new Date(data.generated_at).toLocaleString('pt-BR') : ''}
          </span>
        </div>
      </header>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 24px' }}>
        {/* Titulo */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>
            Dashboard RFV
          </h1>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
            Segmentação por Recência, Frequência e Valor
          </p>
        </div>

        {/* KPIs */}
        <KPICards resumo={data.resumo} />

        {/* Segmentos */}
        <div style={{
          background: '#0f1629', borderRadius: 16,
          border: '1px solid #1e2740', padding: 24, marginBottom: 24
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>
              Segmentação de Clientes
            </h2>
            <span style={{ fontSize: 12, color: '#64748b' }}>
              {data.segmentos?.length || 0} segmentos
            </span>
          </div>
          <SegmentCards segmentos={data.segmentos || []} />
        </div>

        {/* Charts */}
        <Charts segmentos={data.segmentos || []} />

        {/* Tabs + Tables */}
        <div style={{
          background: '#0f1629', borderRadius: 16,
          border: '1px solid #1e2740', padding: 24
        }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? '#8b5cf6' : '#1a1f3a',
                  color: activeTab === tab.id ? '#fff' : '#64748b',
                  border: '1px solid',
                  borderColor: activeTab === tab.id ? '#8b5cf6' : '#1e2740',
                  padding: '8px 20px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'top' && <TopClients clientes={data.top_clientes || []} />}
          {activeTab === 'risco' && <RiskClients clientes={data.clientes_risco || []} />}
          {activeTab === 'todos' && <AllClients clientes={data.clientes || []} />}
        </div>

        {/* Metodologia */}
        <div style={{
          background: '#0f1629', borderRadius: 16,
          border: '1px solid #1e2740', padding: 24, marginTop: 24,
          fontSize: 13, color: '#64748b'
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>
            Metodologia RFV
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8 }}>
              <div style={{ fontWeight: 700, color: '#f97316', marginBottom: 6 }}>R - Recência</div>
              Dias desde a última compra. Quanto menor, melhor (score 5).
            </div>
            <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8 }}>
              <div style={{ fontWeight: 700, color: '#3b82f6', marginBottom: 6 }}>F - Frequência</div>
              Quantidade de pedidos. Quanto maior, melhor (score 5).
            </div>
            <div style={{ padding: 16, background: '#0a0e1a', borderRadius: 8 }}>
              <div style={{ fontWeight: 700, color: '#22c55e', marginBottom: 6 }}>V - Valor</div>
              Valor total de compras. Quanto maior, melhor (score 5).
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
