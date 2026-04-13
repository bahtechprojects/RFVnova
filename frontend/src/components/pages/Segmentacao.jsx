import { Trophy, Diamond, Sparkle, Eye, Warning, Siren, Moon } from '@phosphor-icons/react'
import SegmentCards from '../SegmentCards'
import Charts from '../Charts'

const legendItems = [
  { Icon: Trophy, nome: 'Campeões', desc: 'Compram recente, frequente e alto valor', color: '#16a34a' },
  { Icon: Diamond, nome: 'Leais', desc: 'Compram recente e com boa frequência', color: '#2563eb' },
  { Icon: Sparkle, nome: 'Novos', desc: 'Compraram recente mas poucas vezes', color: '#7c3aed' },
  { Icon: Eye, nome: 'Precisam Atenção', desc: 'Recência mediana, podem evadir', color: '#ca8a04' },
  { Icon: Warning, nome: 'Em Risco', desc: 'Bons clientes que sumiram', color: '#ea580c' },
  { Icon: Siren, nome: 'Não Pode Perder', desc: 'Alta frequência, recência ruim', color: '#dc2626' },
  { Icon: Moon, nome: 'Hibernando', desc: 'Sem compras há muito tempo', color: '#6b7280' },
]

export default function Segmentacao({ data }) {
  if (!data) return null

  return (
    <div>
      <div style={{
        background: '#fff', borderRadius: 16,
        border: '1px solid #e2e8f0',
        padding: 28, marginBottom: 24
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b' }}>
            Segmentos de Clientes
          </h2>
          <span style={{
            fontSize: 12, color: '#1e3a5f', fontWeight: 600,
            background: '#eff6ff', border: '1px solid #bfdbfe',
            padding: '4px 12px', borderRadius: 20
          }}>
            {data.segmentos?.length || 0} segmentos
          </span>
        </div>
        <SegmentCards segmentos={data.segmentos || []} clientes={data.clientes || []} />

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 8, marginTop: 20, padding: 18,
          background: '#f8fafc', borderRadius: 12
        }}>
          {legendItems.map((item, i) => {
            const Icon = item.Icon
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <Icon size={14} weight="bold" color={item.color} />
                <span style={{ fontWeight: 700, color: item.color }}>{item.nome}</span>
                <span style={{ color: '#94a3b8' }}>— {item.desc}</span>
              </div>
            )
          })}
        </div>
      </div>

      <Charts segmentos={data.segmentos || []} />
    </div>
  )
}
