import { motion } from 'framer-motion'
import { Users, CurrencyDollar, ShoppingCart, Clock, UserMinus } from '@phosphor-icons/react'
import AnimatedCounter from './AnimatedCounter'

export default function KPICards({ resumo }) {
  if (!resumo) return null

  const kpis = [
    {
      label: 'Clientes Ativos',
      value: resumo.clientes_ativos,
      sub: `de ${resumo.total_cadastrados?.toLocaleString('pt-BR')} cadastrados`,
      color: '#8b5cf6',
      glow: 'rgba(139, 92, 246, 0.12)',
      icon: Users,
      prefix: '',
      suffix: '',
      decimals: 0
    },
    {
      label: 'Faturamento Total',
      value: resumo.total_valor || 0,
      color: '#22c55e',
      glow: 'rgba(34, 197, 94, 0.12)',
      icon: CurrencyDollar,
      prefix: 'R$ ',
      suffix: '',
      decimals: 2
    },
    {
      label: 'Total de Pedidos',
      value: resumo.total_pedidos || 0,
      color: '#3b82f6',
      glow: 'rgba(59, 130, 246, 0.12)',
      icon: ShoppingCart,
      prefix: '',
      suffix: '',
      decimals: 0
    },
    {
      label: 'Recência Média',
      value: resumo.recencia_media || 0,
      color: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.12)',
      icon: Clock,
      prefix: '',
      suffix: ' dias',
      decimals: 0
    },
    {
      label: 'Clientes Inativos',
      value: resumo.clientes_inativos || 0,
      sub: 'sem compras registradas',
      color: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.12)',
      icon: UserMinus,
      prefix: '',
      suffix: '',
      decimals: 0
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 16,
      marginBottom: 28
    }}>
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon
        return (
          <motion.div
            key={i}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 100 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            style={{
              background: 'linear-gradient(145deg, rgba(15, 22, 40, 0.9), rgba(12, 17, 32, 0.9))',
              backdropFilter: 'blur(20px)',
              borderRadius: 20,
              padding: '24px 22px',
              border: '1px solid rgba(255,255,255,0.06)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default'
            }}
          >
            {/* Top glow */}
            <div style={{
              position: 'absolute', top: -1, left: '20%', right: '20%', height: 1,
              background: `linear-gradient(90deg, transparent, ${kpi.color}40, transparent)`
            }} />

            {/* Corner glow */}
            <div style={{
              position: 'absolute', top: -30, right: -30, width: 80, height: 80,
              borderRadius: '50%', background: kpi.glow, filter: 'blur(20px)'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{
                fontSize: 11, color: '#64748b', textTransform: 'uppercase',
                letterSpacing: 1, fontWeight: 700
              }}>
                {kpi.label}
              </div>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: `${kpi.color}12`,
                border: `1px solid ${kpi.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={18} weight="bold" color={kpi.color} />
              </div>
            </div>

            <div style={{
              fontSize: 28, fontWeight: 900, color: kpi.color,
              letterSpacing: -0.5, lineHeight: 1, marginBottom: 6
            }}>
              <AnimatedCounter
                value={kpi.value}
                prefix={kpi.prefix}
                suffix={kpi.suffix}
                decimals={kpi.decimals}
              />
            </div>

            {kpi.sub && (
              <div style={{ fontSize: 11, color: '#475569', fontWeight: 500 }}>{kpi.sub}</div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
