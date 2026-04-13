import { motion } from 'framer-motion'
import { Heartbeat, TrendUp, TrendDown } from '@phosphor-icons/react'
import AnimatedCounter from './AnimatedCounter'

export default function HealthScore({ resumo, segmentos }) {
  if (!resumo || !segmentos) return null

  const total = resumo.clientes_ativos || 1
  const campeoes = segmentos.find(s => s.nome === 'Campeões')?.count || 0
  const leais = segmentos.find(s => s.nome === 'Leais')?.count || 0
  const risco = segmentos.find(s => s.nome === 'Em Risco')?.count || 0
  const naoPodePerder = segmentos.find(s => s.nome === 'Não Pode Perder')?.count || 0
  const hibernando = segmentos.find(s => s.nome === 'Hibernando')?.count || 0

  const saudaveis = campeoes + leais
  const emPerigo = risco + naoPodePerder + hibernando
  const healthPct = Math.round((saudaveis / total) * 100)
  const riskPct = Math.round((emPerigo / total) * 100)

  const score = Math.min(100, Math.max(0,
    (campeoes * 5 + leais * 3) / total * 100 - (hibernando * 1 + risco * 3 + naoPodePerder * 4) / total * 30
  ))
  const roundedScore = Math.round(Math.max(score, 5))

  const getScoreColor = (s) => {
    if (s >= 70) return '#16a34a'
    if (s >= 50) return '#ca8a04'
    if (s >= 30) return '#ea580c'
    return '#dc2626'
  }
  const scoreColor = getScoreColor(roundedScore)
  const ticketMedio = resumo.total_pedidos > 0 ? resumo.total_valor / resumo.total_pedidos : 0
  const ltv = resumo.clientes_ativos > 0 ? resumo.total_valor / resumo.clientes_ativos : 0

  const metrics = [
    { label: 'Saúde da Base', value: roundedScore, suffix: '/100', color: scoreColor, desc: roundedScore >= 50 ? 'Base em bom estado' : 'Base precisa de atenção' },
    { label: 'Taxa de Retenção', value: Math.round(((total - hibernando) / total) * 100), suffix: '%', color: '#2563eb', desc: `${total - hibernando} clientes ativos` },
    { label: 'Ticket Médio', value: ticketMedio, prefix: 'R$ ', decimals: 2, color: '#16a34a', desc: 'Valor médio por pedido' },
    { label: 'LTV Médio', value: ltv, prefix: 'R$ ', decimals: 2, color: '#1e3a5f', desc: 'Lifetime value por cliente' }
  ]

  return (
    <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
      style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <Heartbeat size={22} weight="bold" color="#dc2626" />
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b' }}>Indicadores de Saúde da Base</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {metrics.map((m, i) => (
          <motion.div key={i} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06 }}
            style={{ background: '#f8fafc', borderRadius: 14, padding: '20px 18px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>{m.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: m.color, lineHeight: 1 }}>
              <AnimatedCounter value={m.value} prefix={m.prefix || ''} suffix={m.suffix || ''} decimals={m.decimals || 0} duration={1500} />
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>{m.desc}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>
              <TrendUp size={14} weight="bold" style={{ verticalAlign: 'middle', marginRight: 4 }} />Clientes Saudáveis
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>{saudaveis} ({healthPct}%)</span>
          </div>
          <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${healthPct}%` }}
              transition={{ delay: 0.4, duration: 1 }}
              style={{ height: '100%', background: '#16a34a', borderRadius: 4 }} />
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}>
              <TrendDown size={14} weight="bold" style={{ verticalAlign: 'middle', marginRight: 4 }} />Clientes em Perigo
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}>{emPerigo} ({riskPct}%)</span>
          </div>
          <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${riskPct}%` }}
              transition={{ delay: 0.4, duration: 1 }}
              style={{ height: '100%', background: '#dc2626', borderRadius: 4 }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
