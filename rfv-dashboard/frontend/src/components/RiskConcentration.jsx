import { motion } from 'framer-motion'
import { ShieldWarning } from '@phosphor-icons/react'

export default function RiskConcentration({ segmentos, resumo }) {
  if (!segmentos || !resumo) return null

  const campeoes = segmentos.find(s => s.nome === 'Campeões')
  if (!campeoes || campeoes.count === 0) return null

  const totalReceita = resumo.total_valor || 1
  const pctReceita = campeoes.pct_valor || 0
  const mediaPorCampeao = campeoes.valor / campeoes.count
  const pctBase = campeoes.pct_count || 0

  // Índice de concentração: se <5% da base gera >30% da receita = alto risco
  const indice = Math.min(100, Math.round((pctReceita / Math.max(pctBase, 1)) * 10))
  const nivel = indice >= 70 ? { label: 'ALTO', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' }
    : indice >= 40 ? { label: 'MODERADO', color: '#ca8a04', bg: '#fefce8', border: '#fde68a' }
    : { label: 'BAIXO', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' }

  return (
    <motion.div
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28, marginBottom: 24 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <ShieldWarning size={22} weight="bold" color="#1e3a5f" />
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Concentração de Risco</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Gauge visual */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 180, height: 100 }}>
            {/* Background arc */}
            <svg width="180" height="100" viewBox="0 0 180 100">
              <path d="M 10 95 A 80 80 0 0 1 170 95" fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round" />
              <motion.path
                d="M 10 95 A 80 80 0 0 1 170 95"
                fill="none" stroke={nivel.color} strokeWidth="14" strokeLinecap="round"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * indice / 100) }}
                transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: nivel.color, lineHeight: 1 }}>{indice}</div>
              <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>de 100</div>
            </div>
          </div>
          <div style={{
            marginTop: 12, padding: '4px 16px', borderRadius: 20,
            background: nivel.bg, border: `1px solid ${nivel.border}`,
            fontSize: 12, fontWeight: 700, color: nivel.color
          }}>
            Dependência {nivel.label}
          </div>
        </div>

        {/* Dados */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>
              Seus {campeoes.count} campeões ({pctBase}% da base)
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
              Geram {pctReceita}% da receita
            </div>
          </div>

          <div style={{ background: nivel.bg, borderRadius: 10, padding: '14px 16px', border: `1px solid ${nivel.border}` }}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>
              Se perder apenas 1 campeão
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: nivel.color }}>
              Perde R$ {mediaPorCampeao.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>

          <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
            {indice >= 70
              ? 'Receita muito concentrada em poucos clientes. Priorize diversificar a base e proteger os campeões.'
              : indice >= 40
              ? 'Concentração moderada. Mantenha os campeões engajados e trabalhe para ampliar a base de leais.'
              : 'Boa distribuição de receita. Continue fortalecendo os diferentes segmentos.'}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
