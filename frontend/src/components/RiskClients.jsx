import { AlertTriangle } from 'lucide-react'
import { tableStyles } from './tableStyles'

export default function RiskClients({ clientes }) {
  if (!clientes || clientes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
        <AlertTriangle size={32} color="#334155" style={{ marginBottom: 12 }} />
        <p>Nenhum cliente em risco identificado.</p>
      </div>
    )
  }

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
        Clientes em Risco
      </h3>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
        Clientes com alto valor/frequência mas que não compram há muito tempo
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyles.table}>
          <thead>
            <tr>
              {['Cliente', 'Última Compra', 'Recência', 'Pedidos', 'Valor Total', 'Segmento'].map(h => (
                <th key={h} style={tableStyles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientes.map((c, i) => (
              <tr key={c.id || i} style={tableStyles.tr}>
                <td style={{ ...tableStyles.td, fontWeight: 600, color: '#e2e8f0' }}>{c.nome}</td>
                <td style={tableStyles.td}>{c.data_ult_compra || '-'}</td>
                <td style={{ ...tableStyles.td, color: '#ef4444', fontWeight: 600 }}>
                  {c.recencia_dias < 9999 ? `${c.recencia_dias} dias` : '-'}
                </td>
                <td style={{ ...tableStyles.td, textAlign: 'center' }}>{c.frequencia}</td>
                <td style={{ ...tableStyles.td, fontWeight: 600, color: '#22c55e' }}>
                  R$ {(c.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td style={tableStyles.td}>
                  <span style={{
                    background: c.seg_color || '#ef4444', color: '#fff',
                    padding: '3px 12px', borderRadius: 12,
                    fontSize: 11, fontWeight: 600
                  }}>
                    {c.segmento}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
