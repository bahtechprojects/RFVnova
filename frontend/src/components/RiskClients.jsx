import { motion } from 'framer-motion'
import { Warning } from '@phosphor-icons/react'

export default function RiskClients({ clientes }) {
  if (!clientes || clientes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ textAlign: 'center', padding: 50, color: '#64748b' }}
      >
        <Warning size={40} color="#334155" style={{ marginBottom: 14 }} />
        <p style={{ fontSize: 15, fontWeight: 600 }}>Nenhum cliente em risco identificado</p>
        <p style={{ fontSize: 13, marginTop: 6, color: '#475569' }}>Todos os clientes de alto valor estão ativos</p>
      </motion.div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <Warning size={20} weight="fill" color="#f97316" />
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>
          Clientes em Risco
        </h3>
      </div>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>
        Clientes com alto valor/frequência que não compram há muito tempo — ação urgente necessária
      </p>
      <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(239, 68, 68, 0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Cliente', 'Última Compra', 'Recência', 'Pedidos', 'Valor Total', 'Segmento'].map(h => (
                <th key={h} style={{
                  background: 'rgba(239, 68, 68, 0.05)',
                  color: '#64748b', padding: '12px 16px', textAlign: 'left',
                  fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: 0.8, borderBottom: '1px solid rgba(239, 68, 68, 0.1)'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientes.map((c, i) => (
              <motion.tr
                key={c.id || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontWeight: 700, color: '#e2e8f0' }}>
                  {c.nome}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: '#94a3b8' }}>
                  {c.data_ult_compra || '-'}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{
                    color: '#ef4444', fontWeight: 800,
                    display: 'inline-flex', alignItems: 'center', gap: 4
                  }}>
                    <Warning size={14} weight="fill" />
                    {c.recencia_dias < 9999 ? `${c.recencia_dias} dias` : '-'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>
                  {c.frequencia}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontWeight: 800, color: '#22c55e' }}>
                  R$ {(c.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{
                    background: `${c.seg_color || '#ef4444'}20`,
                    color: c.seg_color || '#ef4444',
                    border: `1px solid ${c.seg_color || '#ef4444'}40`,
                    padding: '4px 14px', borderRadius: 20,
                    fontSize: 11, fontWeight: 700
                  }}>
                    {c.segmento}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
