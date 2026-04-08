import { motion } from 'framer-motion'
import { Users, CurrencyDollar, ShoppingCart, Clock, UserMinus } from '@phosphor-icons/react'
import AnimatedCounter from './AnimatedCounter'
import StarBorder from './StarBorder'

export default function KPICards({ resumo }) {
  if (!resumo) return null

  const kpis = [
    {
      label: 'Clientes Ativos',
      value: resumo.clientes_ativos,
      sub: `de ${resumo.total_cadastrados?.toLocaleString('pt-BR')} cadastrados`,
      color: '#8b5cf6',
      icon: Users,
      prefix: '', suffix: '', decimals: 0,
      star: true
    },
    {
      label: 'Faturamento Total',
      value: resumo.total_valor || 0,
      color: '#22c55e',
      icon: CurrencyDollar,
      prefix: 'R$ ', suffix: '', decimals: 2,
      star: true
    },
    {
      label: 'Total de Pedidos',
      value: resumo.total_pedidos || 0,
      color: '#3b82f6',
      icon: ShoppingCart,
      prefix: '', suffix: '', decimals: 0
    },
    {
      label: 'Recencia Media',
      value: resumo.recencia_media || 0,
      color: '#f59e0b',
      icon: Clock,
      prefix: '', suffix: ' dias', decimals: 0
    },
    {
      label: 'Clientes Inativos',
      value: resumo.clientes_inativos || 0,
      sub: 'sem compras registradas',
      color: '#ef4444',
      icon: UserMinus,
      prefix: '', suffix: '', decimals: 0
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
        const Wrapper = kpi.star ? StarBorder : 'div'
        const wrapperProps = kpi.star ? { color: kpi.color, speed: '8s' } : {}

        return (
          <motion.div
            key={i}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 100 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Wrapper
              {...wrapperProps}
              style={{ borderRadius: 20 }}
              className={kpi.star ? 'star-border-container' : ''}
            >
              <div style={{
                padding: '24px 22px',
                borderRadius: 20,
                background: kpi.star ? 'transparent' : 'linear-gradient(145deg, rgba(15, 22, 40, 0.9), rgba(12, 17, 32, 0.9))',
                border: kpi.star ? 'none' : '1px solid rgba(255,255,255,0.06)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Corner glow */}
                <div style={{
                  position: 'absolute', top: -30, right: -30, width: 80, height: 80,
                  borderRadius: '50%', background: `${kpi.color}08`, filter: 'blur(20px)',
                  pointerEvents: 'none'
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
                    background: `${kpi.color}10`,
                    border: `1px solid ${kpi.color}20`,
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
              </div>
            </Wrapper>
          </motion.div>
        )
      })}
    </div>
  )
}
