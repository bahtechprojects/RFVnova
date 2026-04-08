export default function SegmentCards({ segmentos }) {
  if (!segmentos || segmentos.length === 0) return null

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 12
    }}>
      {segmentos.map((seg, i) => (
        <div key={i} style={{
          background: '#0a0e1a',
          borderRadius: 12,
          padding: '16px 18px',
          borderLeft: `4px solid ${seg.color}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>{seg.icon}</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#e2e8f0' }}>{seg.nome}</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{seg.count}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>clientes ({seg.pct_count}%)</div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                R$ {(seg.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>faturamento ({seg.pct_valor}%)</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
