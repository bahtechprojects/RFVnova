import { motion } from 'framer-motion'
import { Heartbeat, TrendUp, TrendDown, Minus } from '@phosphor-icons/react'
import AnimatedCounter from './AnimatedCounter'

export default function HealthScore({ resumo, segmentos }) {
  if (!resumo || !segmentos) return null

  const total = resumo.clientes_ativos || 1
  const campeoes = segmentos.find(s => s.nome === 'Campeões')?.count || 0
  const leais = segmentos.find(s => s.nome === 'Leais')?.count || 0
  const risco = segmentos.find(s => s.nome === 'Em Risco')?.count || 0
  const naoPodePerder = segmentos.find(s => s.nome === 'Não Pode Perder')?.count || 0
  const hibernando = segmentos.find(s => s.nome === 'Hibernando')?.count || 0

  // Health score: % de clientes saudáveis (Campeões + Leais + Potenciais) vs total
  const saudaveis = campeoes + leais
  const emPerigo = risco + naoPodePerder + hibernando
  const healthPct = Math.round((saudaveis / total) * 100)
  const riskPct = Math.round((emPerigo / total) * 100)

  // Score geral 0-100
  const score = Math.min(100, Math.max(0,
    (campeoes * 5 + leais * 3) / total * 100 - (hibernando * 1 + risco * 3 + naoPodePerder * 4) / total * 30
  ))
  const roundedScore = Math.round(Math.max(score, 5))

  const getScoreColor = (s) => {
    if (s >= 70) return '#22c55e'
    if (s >= 50) return '#eab308'
    if (s >= 30) return '#f97316'
    return '#ef4444'
  }

  const scoreColor = getScoreColor(roundedScore)

  // Ticket médio
  const ticketMedio = resumo.total_pedidos > 0
    ? resumo.total_valor / resumo.total_pedidos : 0

  // Lifetime value médio
  const ltv = resumo.clientes_ativos > 0
    ? resumo.total_valor / resumo.clientes_ativos : 0

  const metrics = [
    {
      label: 'Saúde da Base',
      value: roundedScore,
      suffix: '/100',
      color: scoreColor,
      desc: roundedScore >= 50 ? 'Base em bom estado' : 'Base precisa de atenção'
    },
    {
      label: 'Taxa de Retenção',
      value: Math.round(((total - hibernando) / total) * 100),
      suffix: '%',
      color: '#3b82f6',
      desc: `${total - hibernando} clientes ativos recentes`
    },
    {
      label: 'Ticket Médio',
      value: ticketMedio,
      prefix: 'R$ ',
      decimals: 2,
      color: '#22c55e',
      desc: 'Valor médio por pedido'
    },
    {
      label: 'LTV Médio',
      value: ltv,
      prefix: 'R$ ',
      decimals: 2,
      color: '#8b5cf6',
      desc: 'Lifetime value por cliente'
    }
  ]

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15 }}
      style={{
        background: 'linear-gradient(145deg, rgba(15, 22, 40, 0.9), rgba(12, 17, 32, 0.9))',
        backdropFilter: 'blur(20px)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.06)',
        padding: 28, marginBottom: 28,
        position: 'relative', overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute', top: -1, left: '10%', right: '10%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.3), transparent)'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <Heartbeat size={22} weight="bold" color="#ef4444" />
        <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>
          Indicadores de Saúde da Base
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            style={{
              background: 'rgba(6, 9, 18, 0.6)',
              borderRadius: 16, padding: '22px 20px',
              border: '1px solid rgba(255,255,255,0.04)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>
              {m.label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: m.color, lineHeight: 1 }}>
              <AnimatedCounter value={m.value} prefix={m.prefix || ''} suffix={m.suffix || ''} decimals={m.decimals || 0} duration={1500} />
            </div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 8, fontWeight: 500 }}>
              {m.desc}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress bars */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#22c55e' }}>
              <TrendUp size={14} weight="bold" style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Clientes Saudáveis
            </span>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#22c55e' }}>{saudaveis} ({healthPct}%)</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${healthPct}%` }}
              transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #22c55e, #16a34a)', borderRadius: 4 }}
            />
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>
              <TrendDown size={14} weight="bold" style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Clientes em Perigo
            </span>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#ef4444' }}>{emPerigo} ({riskPct}%)</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${riskPct}%` }}
              transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #f97316, #ef4444)', borderRadius: 4 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
