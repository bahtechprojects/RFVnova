import { motion } from 'framer-motion'
import { Crown, TrendUp } from '@phosphor-icons/react'

export default function TopClients({ clientes }) {
  const top = (clientes || []).slice(0, 20)

  if (top.length === 0) {
    return <p style={{ color: '#64748b', fontSize: 14 }}>Nenhum dado disponível.</p>
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Crown size={20} weight="fill" color="#f59e0b" />
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>
          Top 20 Clientes por Valor
        </h3>
      </div>
      <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(255,255,255,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['#', 'Cliente', 'Última Compra', 'Pedidos', 'Valor Total', 'RFV', 'Segmento'].map(h => (
                <th key={h} style={{
                  background: 'rgba(15, 22, 40, 0.8)',
                  color: '#64748b', padding: '12px 16px', textAlign: 'left',
                  fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: 0.8, borderBottom: '1px solid rgba(255,255,255,0.04)'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {top.map((c, i) => (
              <motion.tr
                key={c.id || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{ transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: '#475569', fontWeight: 700 }}>
                  {i < 3 ? (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 26, height: 26, borderRadius: 8,
                      background: i === 0 ? 'rgba(245, 158, 11, 0.15)' : i === 1 ? 'rgba(148, 163, 184, 0.15)' : 'rgba(180, 83, 9, 0.15)',
                      color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#b45309',
                      fontSize: 12, fontWeight: 800
                    }}>
                      {i + 1}
                    </span>
                  ) : i + 1}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontWeight: 700, color: '#e2e8f0', maxWidth: 260 }}>
                  {c.nome}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: '#94a3b8' }}>
                  {c.data_ult_compra || '-'}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>
                  {c.frequencia}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontWeight: 800, color: '#22c55e' }}>
                  R$ {(c.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', textAlign: 'center' }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                    color: '#fff', padding: '4px 14px', borderRadius: 20,
                    fontWeight: 800, fontSize: 12,
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
                  }}>
                    {c.rfv_code}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{
                    background: `${c.seg_color || '#475569'}20`,
                    color: c.seg_color || '#fff',
                    border: `1px solid ${c.seg_color || '#475569'}40`,
                    padding: '4px 14px', borderRadius: 20,
                    fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap'
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
