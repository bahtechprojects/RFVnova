import { Users, DollarSign, ShoppingCart, Clock, UserX } from 'lucide-react'

const kpiStyle = {
  background: '#0f1629',
  borderRadius: 16,
  border: '1px solid #1e2740',
  padding: '20px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start'
}

export default function KPICards({ resumo }) {
  if (!resumo) return null

  const kpis = [
    {
      label: 'Clientes Ativos',
      value: resumo.clientes_ativos?.toLocaleString('pt-BR'),
      sub: `de ${resumo.total_cadastrados?.toLocaleString('pt-BR')} cadastrados`,
      color: '#8b5cf6',
      icon: Users
    },
    {
      label: 'Faturamento Total',
      value: `R$ ${(resumo.total_valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      color: '#22c55e',
      icon: DollarSign
    },
    {
      label: 'Total de Pedidos',
      value: (resumo.total_pedidos || 0).toLocaleString('pt-BR'),
      color: '#3b82f6',
      icon: ShoppingCart
    },
    {
      label: 'Recência Média',
      value: `${resumo.recencia_media || 0} dias`,
      color: '#f59e0b',
      icon: Clock
    },
    {
      label: 'Clientes Inativos',
      value: (resumo.clientes_inativos || 0).toLocaleString('pt-BR'),
      sub: 'sem compras registradas',
      color: '#ef4444',
      icon: UserX
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 16,
      marginBottom: 24
    }}>
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon
        return (
          <div key={i} style={kpiStyle}>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, marginBottom: 8 }}>
                {kpi.label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: kpi.color }}>
                {kpi.value}
              </div>
              {kpi.sub && (
                <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{kpi.sub}</div>
              )}
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: kpi.color + '15',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Icon size={20} color={kpi.color} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
