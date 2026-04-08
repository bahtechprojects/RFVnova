import { Trophy, Diamond, Sparkle, Eye, Warning, Siren, Moon } from '@phosphor-icons/react'
import SegmentCards from '../SegmentCards'
import Charts from '../Charts'

const legendItems = [
  { Icon: Trophy, nome: 'Campeoes', desc: 'Compram recente, frequente e alto valor', color: '#22c55e' },
  { Icon: Diamond, nome: 'Leais', desc: 'Compram recente e com boa frequencia', color: '#3b82f6' },
  { Icon: Sparkle, nome: 'Novos', desc: 'Compraram recente mas poucas vezes', color: '#a855f7' },
  { Icon: Eye, nome: 'Precisam Atencao', desc: 'Recencia mediana, podem evadir', color: '#eab308' },
  { Icon: Warning, nome: 'Em Risco', desc: 'Bons clientes que sumiram', color: '#f97316' },
  { Icon: Siren, nome: 'Nao Pode Perder', desc: 'Alta frequencia, recencia ruim', color: '#ef4444' },
  { Icon: Moon, nome: 'Hibernando', desc: 'Sem compras ha muito tempo', color: '#6b7280' },
]

export default function Segmentacao({ data }) {
  if (!data) return null

  return (
    <div>
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

        {/* Legenda clean sem emojis */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 10, marginTop: 24, padding: 20,
          background: 'rgba(6, 9, 18, 0.4)', borderRadius: 14
        }}>
          {legendItems.map((item, i) => {
            const Icon = item.Icon
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                <Icon size={14} weight="bold" color={item.color} />
                <span style={{ fontWeight: 700, color: item.color }}>{item.nome}</span>
                <span style={{ color: '#475569' }}>— {item.desc}</span>
              </div>
            )
          })}
        </div>
      </div>

      <Charts segmentos={data.segmentos || []} />
    </div>
  )
}
