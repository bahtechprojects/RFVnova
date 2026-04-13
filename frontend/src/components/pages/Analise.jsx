import RFVMatrix from '../RFVMatrix'
import { motion } from 'framer-motion'
import { Info } from '@phosphor-icons/react'

export default function Analise({ data }) {
  if (!data) return null

  return (
    <div>
      <RFVMatrix clientes={data.clientes || []} />

      <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28, fontSize: 13, color: '#64748b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Info size={18} weight="bold" color="#1e3a5f" />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#475569' }}>Como funciona o RFV</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { letter: 'R', name: 'Recência', desc: 'Dias desde a última compra. Quanto menor, melhor (score 5).', color: '#ea580c' },
            { letter: 'F', name: 'Frequência', desc: 'Quantidade de pedidos realizados. Quanto maior, melhor (score 5).', color: '#2563eb' },
            { letter: 'V', name: 'Valor', desc: 'Valor total acumulado em compras. Quanto maior, melhor (score 5).', color: '#16a34a' }
          ].map(item => (
            <div key={item.letter} style={{ padding: 18, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 8, background: `${item.color}12`, color: item.color, fontWeight: 700, fontSize: 16 }}>{item.letter}</span>
                <span style={{ fontWeight: 700, color: item.color, fontSize: 13 }}>{item.name}</span>
              </div>
              <span style={{ lineHeight: 1.7, fontSize: 12 }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
