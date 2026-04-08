import { tableStyles } from './tableStyles'

export default function TopClients({ clientes }) {
  const top = (clientes || []).slice(0, 20)

  if (top.length === 0) {
    return <p style={{ color: '#64748b', fontSize: 14 }}>Nenhum dado disponível.</p>
  }

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
        Top 20 Clientes por Valor
      </h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyles.table}>
          <thead>
            <tr>
              {['#', 'Cliente', 'Última Compra', 'Pedidos', 'Valor Total', 'RFV', 'Segmento'].map(h => (
                <th key={h} style={tableStyles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {top.map((c, i) => (
              <tr key={c.id || i} style={tableStyles.tr}>
                <td style={tableStyles.td}>{i + 1}</td>
                <td style={{ ...tableStyles.td, fontWeight: 600, color: '#e2e8f0', maxWidth: 250 }}>{c.nome}</td>
                <td style={tableStyles.td}>{c.data_ult_compra || '-'}</td>
                <td style={{ ...tableStyles.td, textAlign: 'center' }}>{c.frequencia}</td>
                <td style={{ ...tableStyles.td, fontWeight: 600, color: '#22c55e' }}>
                  R$ {(c.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ ...tableStyles.td, textAlign: 'center' }}>
                  <span style={{
                    background: '#8b5cf6', color: '#fff',
                    padding: '3px 12px', borderRadius: 12,
                    fontWeight: 700, fontSize: 12
                  }}>
                    {c.rfv_code}
                  </span>
                </td>
                <td style={tableStyles.td}>
                  <span style={{
                    background: c.seg_color || '#475569', color: '#fff',
                    padding: '3px 12px', borderRadius: 12,
                    fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap'
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
