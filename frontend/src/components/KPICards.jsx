import { motion } from 'framer-motion'
import { Users, CurrencyDollar, ShoppingCart, Warning, Recycle } from '@phosphor-icons/react'
import AnimatedCounter from './AnimatedCounter'

export default function KPICards({ resumo, segmentos }) {
  if (!resumo) return null

  const ticketMedio = resumo.total_pedidos > 0 ? resumo.total_valor / resumo.total_pedidos : 0
  const risco = segmentos?.find(s => s.nome === 'Em Risco')
  const naoPodePerder = segmentos?.find(s => s.nome === 'Não Pode Perder')
  const hibernando = segmentos?.find(s => s.nome === 'Hibernando')
  const receitaRisco = (risco?.valor || 0) + (naoPodePerder?.valor || 0)
  const potencialReativacao = hibernando?.valor || 0

  const kpis = [
    {
      label: 'Clientes Ativos',
      value: resumo.clientes_ativos,
      sub: `de ${resumo.total_cadastrados?.toLocaleString('pt-BR')} cadastrados`,
      color: '#1e3a5f',
      icon: Users,
      prefix: '', suffix: '', decimals: 0
    },
    {
      label: 'Faturamento Total',
      value: resumo.total_valor || 0,
      color: '#16a34a',
      icon: CurrencyDollar,
      prefix: 'R$ ', suffix: '', decimals: 2
    },
    {
      label: 'Ticket Médio',
      value: ticketMedio,
      color: '#2563eb',
      icon: ShoppingCart,
      prefix: 'R$ ', suffix: '', decimals: 2
    },
    {
      label: 'Receita em Risco',
      value: receitaRisco,
      sub: `${(risco?.count || 0) + (naoPodePerder?.count || 0)} clientes`,
      color: '#dc2626',
      icon: Warning,
      prefix: 'R$ ', suffix: '', decimals: 2
    },
    {
      label: 'Potencial Reativação',
      value: potencialReativacao,
      sub: `${hibernando?.count || 0} hibernando`,
      color: '#ea580c',
      icon: Recycle,
      prefix: 'R$ ', suffix: '', decimals: 2
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 16,
      marginBottom: 24
    }}>
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon
        return (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 + i * 0.06 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            style={{
              padding: '22px 20px',
              borderRadius: 14,
              background: '#fff',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: kpi.color, borderRadius: '14px 14px 0 0'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{
                fontSize: 11, color: '#64748b', textTransform: 'uppercase',
                letterSpacing: 0.8, fontWeight: 600
              }}>
                {kpi.label}
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${kpi.color}0d`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={18} weight="bold" color={kpi.color} />
              </div>
            </div>

            <div style={{
              fontSize: 26, fontWeight: 700, color: '#1e293b',
              letterSpacing: -0.5, lineHeight: 1, marginBottom: 4
            }}>
              <AnimatedCounter
                value={kpi.value}
                prefix={kpi.prefix}
                suffix={kpi.suffix}
                decimals={kpi.decimals}
              />
            </div>

            {kpi.sub && (
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{kpi.sub}</div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
