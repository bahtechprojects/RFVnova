import { motion } from 'framer-motion'
import { GridFour } from '@phosphor-icons/react'

export default function RFVMatrix({ clientes }) {
  if (!clientes || clientes.length === 0) return null

  // Criar matriz 5x5 (R x F) com contagem
  const matrix = Array(5).fill(null).map(() => Array(5).fill(0))
  const matrixValue = Array(5).fill(null).map(() => Array(5).fill(0))

  clientes.forEach(c => {
    const r = Math.max(1, Math.min(5, c.r_score)) - 1
    const f = Math.max(1, Math.min(5, c.f_score)) - 1
    matrix[r][f]++
    matrixValue[r][f] += c.valor || 0
  })

  const maxCount = Math.max(...matrix.flat(), 1)

  const getColor = (count) => {
    if (count === 0) return 'rgba(255,255,255,0.02)'
    const intensity = count / maxCount
    if (intensity > 0.7) return 'rgba(139, 92, 246, 0.7)'
    if (intensity > 0.4) return 'rgba(139, 92, 246, 0.4)'
    if (intensity > 0.15) return 'rgba(139, 92, 246, 0.2)'
    return 'rgba(139, 92, 246, 0.08)'
  }

  // Distribuição de valor por score
  const valorPorScore = {}
  clientes.forEach(c => {
    const key = c.rfv_score
    valorPorScore[key] = (valorPorScore[key] || 0) + (c.valor || 0)
  })

  const scoreRanges = [
    { range: '13-15', label: 'Excelente', color: '#22c55e', scores: [13, 14, 15] },
    { range: '10-12', label: 'Bom', color: '#3b82f6', scores: [10, 11, 12] },
    { range: '7-9', label: 'Regular', color: '#eab308', scores: [7, 8, 9] },
    { range: '4-6', label: 'Baixo', color: '#f97316', scores: [4, 5, 6] },
    { range: '3', label: 'Crítico', color: '#ef4444', scores: [3] },
  ]

  const totalValor = clientes.reduce((a, c) => a + (c.valor || 0), 0) || 1

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28
      }}
    >
      {/* Matriz R x F */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(15, 22, 40, 0.9), rgba(12, 17, 32, 0.9))',
        backdropFilter: 'blur(20px)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.06)',
        padding: 28, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -1, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <GridFour size={20} weight="bold" color="#8b5cf6" />
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>
            Matriz RFV
          </h2>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>Recência x Frequência</span>
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          {/* Y axis label */}
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            fontSize: 10, color: '#64748b', fontWeight: 700, writingMode: 'vertical-rl',
            textOrientation: 'mixed', transform: 'rotate(180deg)', letterSpacing: 1
          }}>
            RECÊNCIA
          </div>

          <div style={{ flex: 1 }}>
            {/* Y labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[5, 4, 3, 2, 1].map((r, ri) => (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 20, textAlign: 'center', fontSize: 10, color: '#64748b', fontWeight: 700 }}>
                    {r}
                  </span>
                  <div style={{ display: 'flex', gap: 3, flex: 1 }}>
                    {[1, 2, 3, 4, 5].map((f, fi) => {
                      const count = matrix[r - 1][f - 1]
                      return (
                        <motion.div
                          key={f}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4 + (ri * 5 + fi) * 0.02 }}
                          style={{
                            flex: 1, aspectRatio: '1', borderRadius: 8,
                            background: getColor(count),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: count > 0 ? 11 : 0, fontWeight: 800,
                            color: count > 50 ? '#fff' : '#94a3b8',
                            border: '1px solid rgba(255,255,255,0.03)',
                            cursor: 'default',
                            position: 'relative'
                          }}
                          title={`R${r} x F${f}: ${count} clientes`}
                        >
                          {count > 0 ? count : ''}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* X labels */}
            <div style={{ display: 'flex', marginTop: 4, marginLeft: 24, gap: 3 }}>
              {[1, 2, 3, 4, 5].map(f => (
                <div key={f} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: '#64748b', fontWeight: 700 }}>
                  {f}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 4, fontSize: 10, color: '#64748b', fontWeight: 700, letterSpacing: 1 }}>
              FREQUÊNCIA
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16 }}>
          {[
            { label: 'Poucos', bg: 'rgba(139, 92, 246, 0.08)' },
            { label: 'Médio', bg: 'rgba(139, 92, 246, 0.2)' },
            { label: 'Muitos', bg: 'rgba(139, 92, 246, 0.4)' },
            { label: 'Maioria', bg: 'rgba(139, 92, 246, 0.7)' },
          ].map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#64748b' }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: l.bg }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* Distribuição de Valor por Score */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(15, 22, 40, 0.9), rgba(12, 17, 32, 0.9))',
        backdropFilter: 'blur(20px)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.06)',
        padding: 28, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -1, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.3), transparent)'
        }} />
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: -0.3 }}>
          Concentração de Receita por Score
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {scoreRanges.map((sr, i) => {
            const valor = sr.scores.reduce((a, s) => a + (valorPorScore[s] || 0), 0)
            const count = clientes.filter(c => sr.scores.includes(c.rfv_score)).length
            const pct = Math.round((valor / totalValor) * 100)

            return (
              <motion.div
                key={i}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      padding: '3px 10px', borderRadius: 8,
                      background: `${sr.color}15`, color: sr.color,
                      fontWeight: 800, fontSize: 12
                    }}>
                      {sr.range}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{sr.label}</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>({count} clientes)</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: sr.color }}>{pct}%</span>
                    <span style={{ fontSize: 11, color: '#64748b', marginLeft: 8 }}>
                      R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
                <div style={{ height: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 5, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                    style={{
                      height: '100%', borderRadius: 5,
                      background: `linear-gradient(90deg, ${sr.color}90, ${sr.color})`
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
