import RFVMatrix from '../RFVMatrix'
import { motion } from 'framer-motion'
import { Info } from '@phosphor-icons/react'

export default function Analise({ data }) {
  if (!data) return null

  return (
    <div>
      <RFVMatrix clientes={data.clientes || []} />

      {/* Metodologia */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          background: 'linear-gradient(145deg, rgba(15, 22, 40, 0.6), rgba(12, 17, 32, 0.6))',
          backdropFilter: 'blur(20px)',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.04)',
          padding: 28, fontSize: 13, color: '#64748b'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Info size={18} weight="bold" color="#8b5cf6" />
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#94a3b8' }}>Como funciona o RFV</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { letter: 'R', name: 'Recência', desc: 'Dias desde a última compra. Quanto menor, melhor (score 5). Identifica quem está ativo vs. inativo.', color: '#f97316' },
            { letter: 'F', name: 'Frequência', desc: 'Quantidade de pedidos realizados. Quanto maior, melhor (score 5). Mostra engajamento e recorrência.', color: '#3b82f6' },
            { letter: 'V', name: 'Valor', desc: 'Valor total acumulado em compras. Quanto maior, melhor (score 5). Reflete a relevância financeira.', color: '#22c55e' }
          ].map(item => (
            <div key={item.letter} style={{
              padding: 20, background: 'rgba(6, 9, 18, 0.5)', borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 36, height: 36, borderRadius: 10,
                  background: `${item.color}15`, color: item.color,
                  fontWeight: 900, fontSize: 18, border: `1px solid ${item.color}25`
                }}>{item.letter}</span>
                <span style={{ fontWeight: 800, color: item.color, fontSize: 14 }}>{item.name}</span>
              </div>
              <span style={{ lineHeight: 1.7, fontSize: 12 }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
