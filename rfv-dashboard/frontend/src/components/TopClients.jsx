import { motion } from 'framer-motion'
import { Crown } from '@phosphor-icons/react'

const getPrioridade = (c) => {
  const priority = (c.v_score || 0) * 2 + (5 - (c.r_score || 0))
  if (priority >= 8) return { label: 'Alta', color: '#dc2626', bg: '#fef2f2' }
  if (priority >= 5) return { label: 'Média', color: '#ca8a04', bg: '#fefce8' }
  return { label: 'Baixa', color: '#16a34a', bg: '#f0fdf4' }
}

export default function TopClients({ clientes }) {
  const top = (clientes || []).slice(0, 20)
  if (top.length === 0) return <p style={{ color: '#94a3b8', fontSize: 14 }}>Nenhum dado disponível.</p>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <Crown size={20} weight="fill" color="#ca8a04" />
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Top 20 Clientes por Valor</h3>
      </div>
      <div style={{ borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['#', 'Cliente', 'Última Compra', 'Pedidos', 'Valor Total', 'RFV', 'Prioridade', 'Segmento'].map(h => (
                <th key={h} style={{ background: '#f8fafc', color: '#94a3b8', padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {top.map((c, i) => {
              const prio = getPrioridade(c)
              return (
                <motion.tr key={c.id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  style={{ transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontWeight: 700 }}>
                    {i < 3 ? <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 6, background: i === 0 ? '#fefce8' : i === 1 ? '#f1f5f9' : '#fff7ed', color: i === 0 ? '#ca8a04' : i === 1 ? '#94a3b8' : '#ea580c', fontSize: 11, fontWeight: 700 }}>{i + 1}</span> : i + 1}
                  </td>
                  <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', fontWeight: 600, color: '#1e293b' }}>{c.nome}</td>
                  <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', color: '#64748b' }}>{c.data_ult_compra || '-'}</td>
                  <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', textAlign: 'center', color: '#64748b' }}>{c.frequencia}</td>
                  <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, color: '#16a34a' }}>R$ {(c.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                    <span style={{ background: '#1e3a5f', color: '#fff', padding: '3px 12px', borderRadius: 16, fontWeight: 700, fontSize: 11 }}>{c.rfv_code}</span>
                  </td>
                  <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                    <span style={{ background: prio.bg, color: prio.color, padding: '3px 10px', borderRadius: 16, fontSize: 10, fontWeight: 700 }}>{prio.label}</span>
                  </td>
                  <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ background: `${c.seg_color || '#64748b'}12`, color: c.seg_color || '#64748b', padding: '3px 10px', borderRadius: 16, fontSize: 10, fontWeight: 700 }}>{c.segmento}</span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
