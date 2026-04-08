import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Users, TrendingUp, ArrowRight } from 'lucide-react'

export default function Home() {
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/empresas')
      .then(r => r.json())
      .then(data => { setEmpresas(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #0f1629, #1a1f3a)',
        borderBottom: '1px solid #1e2740',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <BarChart3 size={20} color="#fff" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>
            <span style={{ color: '#8b5cf6' }}>bah</span>tech
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 14, color: '#64748b' }}>
          <span style={{ color: '#e2e8f0', fontWeight: 600, borderBottom: '2px solid #8b5cf6', paddingBottom: 4 }}>
            RFV
          </span>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
            Dashboard RFV
          </h1>
          <p style={{ color: '#64748b', fontSize: 15 }}>
            Segmentação de clientes por Recência, Frequência e Valor
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
            Carregando...
          </div>
        ) : empresas.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 24px',
            background: '#0f1629', borderRadius: 16,
            border: '1px dashed #1e2740'
          }}>
            <Users size={48} color="#334155" style={{ marginBottom: 16 }} />
            <h2 style={{ fontSize: 18, marginBottom: 12, color: '#94a3b8' }}>
              Nenhuma empresa sincronizada
            </h2>
            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.8 }}>
              Execute o script <code style={{
                background: '#1a1f3a', padding: '2px 8px',
                borderRadius: 4, color: '#8b5cf6'
              }}>sync_rfv.py</code> na máquina do cliente para enviar os dados.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {empresas.map(emp => (
              <Link key={emp.id} to={`/dashboard/${emp.id}`} style={{
                background: '#0f1629',
                border: '1px solid #1e2740',
                borderRadius: 16,
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.background = '#111833' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2740'; e.currentTarget.style.background = '#0f1629' }}
              >
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                    {emp.nome}
                  </h3>
                  <div style={{ fontSize: 13, color: '#64748b' }}>
                    Atualizado: {emp.atualizado ? new Date(emp.atualizado).toLocaleString('pt-BR') : 'N/A'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#8b5cf6' }}>
                      {emp.total_clientes}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>clientes</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#22c55e' }}>
                      R$ {(emp.total_valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>faturamento</div>
                  </div>
                  <ArrowRight size={20} color="#475569" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
