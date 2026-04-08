import { motion } from 'framer-motion'
import { TrendUp, TrendDown, Equals } from '@phosphor-icons/react'
import KPICards from '../KPICards'
import AnimatedCounter from '../AnimatedCounter'

export default function VisaoGeral({ data }) {
  if (!data) return null
  const { resumo, segmentos } = data

  const campeoes = segmentos?.find(s => s.nome === 'Campeões')
  const leais = segmentos?.find(s => s.nome === 'Leais')
  const hibernando = segmentos?.find(s => s.nome === 'Hibernando')

  const ticketMedio = resumo.total_pedidos > 0 ? resumo.total_valor / resumo.total_pedidos : 0
  const ltv = resumo.clientes_ativos > 0 ? resumo.total_valor / resumo.clientes_ativos : 0
  const taxaAtivacao = Math.round((resumo.clientes_ativos / resumo.total_cadastrados) * 100)

  const quickStats = [
    {
      label: 'Receita Campeões + Leais',
      value: ((campeoes?.valor || 0) + (leais?.valor || 0)),
      prefix: 'R$ ',
      decimals: 2,
      pct: ((campeoes?.pct_valor || 0) + (leais?.pct_valor || 0)).toFixed(1),
      color: '#22c55e',
      trend: 'up'
    },
    {
      label: 'Ticket Médio por Pedido',
      value: ticketMedio,
      prefix: 'R$ ',
      decimals: 2,
      color: '#3b82f6',
      trend: 'neutral'
    },
    {
      label: 'LTV Médio por Cliente',
      value: ltv,
      prefix: 'R$ ',
      decimals: 2,
      color: '#8b5cf6',
      trend: 'up'
    },
    {
      label: 'Taxa de Ativação',
      value: taxaAtivacao,
      suffix: '%',
      color: taxaAtivacao >= 60 ? '#22c55e' : '#eab308',
      trend: taxaAtivacao >= 60 ? 'up' : 'down'
    }
  ]

  return (
    <div>
      <KPICards resumo={resumo} />

      {/* Quick Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16, marginBottom: 28
      }}>
        {quickStats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            whileHover={{ y: -3 }}
            style={{
              background: 'linear-gradient(145deg, rgba(15, 22, 40, 0.9), rgba(12, 17, 32, 0.9))',
              backdropFilter: 'blur(20px)',
              borderRadius: 16, padding: '20px 22px',
              border: '1px solid rgba(255,255,255,0.06)',
              position: 'relative', overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute', top: -1, left: '20%', right: '20%', height: 1,
              background: `linear-gradient(90deg, transparent, ${s.color}40, transparent)`
            }} />
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 10 }}>
              {s.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: s.color }}>
                <AnimatedCounter value={s.value} prefix={s.prefix || ''} suffix={s.suffix || ''} decimals={s.decimals || 0} />
              </span>
              {s.pct && (
                <span style={{
                  fontSize: 11, fontWeight: 700, color: '#22c55e',
                  background: 'rgba(34, 197, 94, 0.1)',
                  padding: '2px 8px', borderRadius: 6
                }}>
                  {s.pct}% do total
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resumo rápido */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          background: 'linear-gradient(145deg, rgba(15, 22, 40, 0.9), rgba(12, 17, 32, 0.9))',
          backdropFilter: 'blur(20px)',
          borderRadius: 20, padding: 28,
          border: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 20 }}>
          Resumo Executivo
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          <div style={{
            background: 'rgba(34, 197, 94, 0.06)', borderRadius: 14, padding: 20,
            border: '1px solid rgba(34, 197, 94, 0.1)'
          }}>
            <TrendUp size={24} weight="bold" color="#22c55e" style={{ marginBottom: 10 }} />
            <div style={{ fontSize: 14, fontWeight: 800, color: '#22c55e', marginBottom: 6 }}>Pontos Fortes</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
              {campeoes?.count || 0} campeões gerando {campeoes?.pct_valor || 0}% da receita.
              {(leais?.count || 0) > 0 && ` ${leais.count} clientes leais com ${leais.pct_valor}% do faturamento.`}
              {' '}Ticket médio de R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
            </div>
          </div>
          <div style={{
            background: 'rgba(234, 179, 8, 0.06)', borderRadius: 14, padding: 20,
            border: '1px solid rgba(234, 179, 8, 0.1)'
          }}>
            <Equals size={24} weight="bold" color="#eab308" style={{ marginBottom: 10 }} />
            <div style={{ fontSize: 14, fontWeight: 800, color: '#eab308', marginBottom: 6 }}>Oportunidades</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
              {segmentos?.find(s => s.nome === 'Novos')?.count || 0} clientes novos podem se tornar recorrentes.
              {' '}{segmentos?.find(s => s.nome === 'Precisam Atenção')?.count || 0} clientes precisam de atenção antes de evadir.
            </div>
          </div>
          <div style={{
            background: 'rgba(239, 68, 68, 0.06)', borderRadius: 14, padding: 20,
            border: '1px solid rgba(239, 68, 68, 0.1)'
          }}>
            <TrendDown size={24} weight="bold" color="#ef4444" style={{ marginBottom: 10 }} />
            <div style={{ fontSize: 14, fontWeight: 800, color: '#ef4444', marginBottom: 6 }}>Alertas</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
              Recência média de {resumo.recencia_media} dias.
              {' '}{hibernando?.count || 0} clientes hibernando representam R$ {(hibernando?.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em receita parada.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
