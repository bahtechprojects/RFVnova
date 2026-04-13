import { motion } from 'framer-motion'
import { Warning } from '@phosphor-icons/react'

export default function RiskClients({ clientes }) {
  if (!clientes || clientes.length === 0) return (
    <div style={{ textAlign: 'center', padding: 50, color: '#94a3b8' }}>
      <Warning size={36} color="#cbd5e1" style={{ marginBottom: 12 }} />
      <p style={{ fontSize: 14, fontWeight: 600 }}>Nenhum cliente em risco identificado</p>
      <p style={{ fontSize: 12, marginTop: 6, color: '#cbd5e1' }}>Todos os clientes de alto valor estão ativos</p>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Warning size={20} weight="fill" color="#ea580c" />
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Clientes em Risco</h3>
      </div>
      <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>Clientes com alto valor que não compram há muito tempo</p>
      <div style={{ borderRadius: 12, border: '1px solid #fecaca', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Cliente', 'Última Compra', 'Recência', 'Pedidos', 'Valor Total', 'Segmento'].map(h => (
                <th key={h} style={{ background: '#fef2f2', color: '#94a3b8', padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #fecaca' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientes.map((c, i) => (
              <motion.tr key={c.id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                style={{ transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', fontWeight: 600, color: '#1e293b' }}>{c.nome}</td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', color: '#64748b' }}>{c.data_ult_compra || '-'}</td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#dc2626', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Warning size={12} weight="fill" /> {c.recencia_dias < 9999 ? `${c.recencia_dias} dias` : '-'}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', textAlign: 'center', color: '#64748b' }}>{c.frequencia}</td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, color: '#16a34a' }}>R$ {(c.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ background: `${c.seg_color || '#dc2626'}12`, color: c.seg_color || '#dc2626', padding: '3px 10px', borderRadius: 16, fontSize: 10, fontWeight: 700 }}>{c.segmento}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
