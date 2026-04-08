import SegmentCards from '../SegmentCards'
import Charts from '../Charts'

export default function Segmentacao({ data }) {
  if (!data) return null

  return (
    <div>
      {/* Segment Cards */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(15, 22, 40, 0.9), rgba(12, 17, 32, 0.9))',
        backdropFilter: 'blur(20px)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.06)',
        padding: 28, marginBottom: 28,
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -1, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), transparent)'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>
            Segmentos de Clientes
          </h2>
          <span style={{
            fontSize: 12, color: '#8b5cf6', fontWeight: 600,
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            padding: '4px 12px', borderRadius: 20
          }}>
            {data.segmentos?.length || 0} segmentos
          </span>
        </div>
        <SegmentCards segmentos={data.segmentos || []} />

        {/* Legenda */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 8, marginTop: 24, padding: 18,
          background: 'rgba(6, 9, 18, 0.4)', borderRadius: 14
        }}>
          {[
            { icon: '🏆', nome: 'Campeões', desc: 'Compram recente, frequente e alto valor', color: '#22c55e' },
            { icon: '💎', nome: 'Leais', desc: 'Compram recente e com boa frequência', color: '#3b82f6' },
            { icon: '🆕', nome: 'Novos', desc: 'Compraram recente mas poucas vezes', color: '#a855f7' },
            { icon: '👀', nome: 'Precisam Atenção', desc: 'Recência mediana, podem evadir', color: '#eab308' },
            { icon: '⚠️', nome: 'Em Risco', desc: 'Bons clientes que sumiram', color: '#f97316' },
            { icon: '🚨', nome: 'Não Pode Perder', desc: 'Alta frequência, recência ruim', color: '#ef4444' },
            { icon: '😴', nome: 'Hibernando', desc: 'Sem compras há muito tempo', color: '#6b7280' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <span>{s.icon}</span>
              <span style={{ fontWeight: 700, color: s.color }}>{s.nome}</span>
              <span style={{ color: '#475569' }}>— {s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <Charts segmentos={data.segmentos || []} />
    </div>
  )
}
