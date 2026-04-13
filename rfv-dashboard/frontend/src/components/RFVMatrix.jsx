import { motion } from 'framer-motion'
import { GridFour } from '@phosphor-icons/react'

export default function RFVMatrix({ clientes }) {
  if (!clientes || clientes.length === 0) return null

  const matrix = Array(5).fill(null).map(() => Array(5).fill(0))
  clientes.forEach(c => {
    const r = Math.max(1, Math.min(5, c.r_score)) - 1
    const f = Math.max(1, Math.min(5, c.f_score)) - 1
    matrix[r][f]++
  })

  const maxCount = Math.max(...matrix.flat(), 1)
  const getColor = (count) => {
    if (count === 0) return '#f8fafc'
    const intensity = count / maxCount
    if (intensity > 0.7) return '#1e3a5f'
    if (intensity > 0.4) return '#3b7dd8'
    if (intensity > 0.15) return '#93c5fd'
    return '#dbeafe'
  }
  const getTextColor = (count) => {
    const intensity = count / maxCount
    return intensity > 0.4 ? '#fff' : '#475569'
  }

  const valorPorScore = {}
  clientes.forEach(c => { valorPorScore[c.rfv_score] = (valorPorScore[c.rfv_score] || 0) + (c.valor || 0) })
  const totalValor = clientes.reduce((a, c) => a + (c.valor || 0), 0) || 1

  const scoreRanges = [
    { range: '13-15', label: 'Excelente', color: '#16a34a', scores: [13, 14, 15] },
    { range: '10-12', label: 'Bom', color: '#2563eb', scores: [10, 11, 12] },
    { range: '7-9', label: 'Regular', color: '#ca8a04', scores: [7, 8, 9] },
    { range: '4-6', label: 'Baixo', color: '#ea580c', scores: [4, 5, 6] },
    { range: '3', label: 'Crítico', color: '#dc2626', scores: [3] },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <GridFour size={20} weight="bold" color="#1e3a5f" />
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Matriz RFV</h2>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>Recência x Frequência</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: 10, color: '#94a3b8', fontWeight: 700, writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', letterSpacing: 1 }}>RECÊNCIA</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[5, 4, 3, 2, 1].map((r) => (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 20, textAlign: 'center', fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>{r}</span>
                  <div style={{ display: 'flex', gap: 3, flex: 1 }}>
                    {[1, 2, 3, 4, 5].map((f) => {
                      const count = matrix[r - 1][f - 1]
                      return (
                        <div key={f} style={{
                          flex: 1, aspectRatio: '1', borderRadius: 6,
                          background: getColor(count),
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: count > 0 ? 11 : 0, fontWeight: 700,
                          color: getTextColor(count), border: '1px solid #e2e8f0'
                        }} title={`R${r} x F${f}: ${count} clientes`}>
                          {count > 0 ? count : ''}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', marginTop: 4, marginLeft: 24, gap: 3 }}>
              {[1, 2, 3, 4, 5].map(f => (
                <div key={f} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>{f}</div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 4, fontSize: 10, color: '#94a3b8', fontWeight: 700, letterSpacing: 1 }}>FREQUÊNCIA</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 16 }}>
          {[
            { label: 'Poucos', bg: '#dbeafe' },
            { label: 'Médio', bg: '#93c5fd' },
            { label: 'Muitos', bg: '#3b7dd8' },
            { label: 'Maioria', bg: '#1e3a5f' },
          ].map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#94a3b8' }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: l.bg }} /> {l.label}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>
          Concentração de Receita por Score
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {scoreRanges.map((sr, i) => {
            const valor = sr.scores.reduce((a, s) => a + (valorPorScore[s] || 0), 0)
            const count = clientes.filter(c => sr.scores.includes(c.rfv_score)).length
            const pct = Math.round((valor / totalValor) * 100)
            return (
              <motion.div key={i} initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.08 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 6, background: `${sr.color}12`, color: sr.color, fontWeight: 700, fontSize: 12 }}>{sr.range}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{sr.label}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>({count})</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: sr.color }}>{pct}%</span>
                    <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 8 }}>R$ {valor.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
                <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.8 }}
                    style={{ height: '100%', borderRadius: 4, background: sr.color }} />
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
