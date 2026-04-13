import { motion } from 'framer-motion'
import { TrendUp, TrendDown, Equals, Target, Lightning } from '@phosphor-icons/react'
import KPICards from '../KPICards'
import QuickActionPanel from '../QuickActionPanel'
import RevenueThermometer from '../RevenueThermometer'
import RiskConcentration from '../RiskConcentration'
import AnimatedCounter from '../AnimatedCounter'

export default function VisaoGeral({ data, onNavigate }) {
  if (!data) return null
  const { resumo, segmentos } = data

  const campeoes = segmentos?.find(s => s.nome === 'Campeões')
  const leais = segmentos?.find(s => s.nome === 'Leais')
  const hibernando = segmentos?.find(s => s.nome === 'Hibernando')

  const ticketMedio = resumo.total_pedidos > 0 ? resumo.total_valor / resumo.total_pedidos : 0
  const ltv = resumo.clientes_ativos > 0 ? resumo.total_valor / resumo.clientes_ativos : 0
  const taxaAtivacao = Math.round((resumo.clientes_ativos / resumo.total_cadastrados) * 100)

  const risco = segmentos?.find(s => s.nome === 'Em Risco')
  const naoPodePerder = segmentos?.find(s => s.nome === 'Não Pode Perder')
  const novos = segmentos?.find(s => s.nome === 'Novos')
  const precisam = segmentos?.find(s => s.nome === 'Precisam Atenção')
  const riscoTotal = (risco?.count || 0) + (naoPodePerder?.count || 0)
  const riscoValor = (risco?.valor || 0) + (naoPodePerder?.valor || 0)

  const recommendations = []
  if (riscoTotal > 0) {
    recommendations.push({
      icon: Lightning, color: '#dc2626', urgency: 'URGENTE', bg: '#fef2f2',
      text: `${riscoTotal} clientes de alto valor em risco — R$ ${riscoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} podem ser perdidos.`
    })
  }
  if ((novos?.count || 0) > 0) {
    recommendations.push({
      icon: Target, color: '#2563eb', urgency: 'OPORTUNIDADE', bg: '#eff6ff',
      text: `${novos.count} clientes novos podem virar recorrentes. Follow-up em 15 dias.`
    })
  }
  if ((precisam?.count || 0) > 0) {
    recommendations.push({
      icon: TrendDown, color: '#ca8a04', urgency: 'ATENÇÃO', bg: '#fefce8',
      text: `${precisam.count} clientes esfriando — comunicação personalizada antes que virem inativos.`
    })
  }

  const quickStats = [
    {
      label: 'Receita Campeões + Leais',
      value: ((campeoes?.valor || 0) + (leais?.valor || 0)),
      prefix: 'R$ ', decimals: 2,
      pct: ((campeoes?.pct_valor || 0) + (leais?.pct_valor || 0)).toFixed(1),
      color: '#16a34a'
    },
    { label: 'Ticket Médio', value: ticketMedio, prefix: 'R$ ', decimals: 2, color: '#2563eb' },
    { label: 'LTV Médio', value: ltv, prefix: 'R$ ', decimals: 2, color: '#1e3a5f' },
    { label: 'Taxa de Ativação', value: taxaAtivacao, suffix: '%', color: taxaAtivacao >= 60 ? '#16a34a' : '#ca8a04' }
  ]

  return (
    <div>
      <KPICards resumo={resumo} segmentos={segmentos} />
      <RevenueThermometer segmentos={segmentos} resumo={resumo} />
      <QuickActionPanel segmentos={segmentos} onNavigate={onNavigate} />
      <RiskConcentration segmentos={segmentos} resumo={resumo} />

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {quickStats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.06 }}
            style={{
              background: '#fff', borderRadius: 12, padding: '18px 20px',
              border: '1px solid #e2e8f0'
            }}
          >
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 8 }}>
              {s.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>
                <AnimatedCounter value={s.value} prefix={s.prefix || ''} suffix={s.suffix || ''} decimals={s.decimals || 0} />
              </span>
              {s.pct && (
                <span style={{
                  fontSize: 11, fontWeight: 700, color: '#16a34a',
                  background: '#f0fdf4', padding: '2px 8px', borderRadius: 6
                }}>
                  {s.pct}%
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resumo Executivo */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          background: '#fff', borderRadius: 16, padding: 28,
          border: '1px solid #e2e8f0'
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>
          Resumo Executivo
        </h3>
        <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>
          Diagnóstico automático baseado nos dados atuais
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ background: '#f0fdf4', borderRadius: 12, padding: 18, border: '1px solid #bbf7d0' }}>
            <TrendUp size={22} weight="bold" color="#16a34a" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: '#16a34a', marginBottom: 6 }}>Pontos Fortes</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>
              {campeoes?.count || 0} campeões gerando {campeoes?.pct_valor || 0}% da receita.
              {(leais?.count || 0) > 0 && ` ${leais.count} leais com ${leais.pct_valor}%.`}
            </div>
          </div>
          <div style={{ background: '#fefce8', borderRadius: 12, padding: 18, border: '1px solid #fde68a' }}>
            <Equals size={22} weight="bold" color="#ca8a04" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: '#ca8a04', marginBottom: 6 }}>Oportunidades</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>
              {novos?.count || 0} novos podem virar recorrentes.
              {' '}{precisam?.count || 0} precisam de atenção.
            </div>
          </div>
          <div style={{ background: '#fef2f2', borderRadius: 12, padding: 18, border: '1px solid #fecaca' }}>
            <TrendDown size={22} weight="bold" color="#dc2626" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', marginBottom: 6 }}>Alertas</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>
              Recência média de {resumo.recencia_media} dias.
              {' '}{hibernando?.count || 0} hibernando com R$ {(hibernando?.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} parado.
            </div>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 18, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>
              Recomendações para esta semana
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recommendations.map((r, i) => {
                const Icon = r.icon
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 10,
                    background: r.bg, borderLeft: `3px solid ${r.color}`
                  }}>
                    <Icon size={16} weight="bold" color={r.color} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: r.color, flexShrink: 0 }}>{r.urgency}</span>
                    <span style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{r.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
