import { motion } from 'framer-motion'
import { Trophy, Diamond, Sparkle, Star, Eye, Warning, Siren, Moon } from '@phosphor-icons/react'
import AnimatedCounter from './AnimatedCounter'

const segIcons = {
  'Campeões': Trophy,
  'Leais': Diamond,
  'Novos': Sparkle,
  'Potenciais Leais': Star,
  'Precisam Atenção': Eye,
  'Em Risco': Warning,
  'Não Pode Perder': Siren,
  'Hibernando': Moon,
  'Outros': Star,
}

export default function SegmentCards({ segmentos }) {
  if (!segmentos || segmentos.length === 0) return null

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 14
    }}>
      {segmentos.map((seg, i) => {
        const Icon = segIcons[seg.nome] || Star
        return (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 + i * 0.06 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            style={{
              background: 'rgba(6, 9, 18, 0.6)',
              borderRadius: 16,
              padding: '18px 20px',
              border: '1px solid rgba(255,255,255,0.04)',
              borderLeft: `3px solid ${seg.color}`,
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default'
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0, width: 80,
              background: `linear-gradient(90deg, ${seg.color}06, transparent)`,
              pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: `${seg.color}15`,
                  border: `1px solid ${seg.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={16} weight="bold" color={seg.color} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#e2e8f0', letterSpacing: -0.2 }}>
                  {seg.nome}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 28 }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                    <AnimatedCounter value={seg.count} duration={1000} />
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 500 }}>
                    clientes <span style={{ color: seg.color, fontWeight: 700 }}>({seg.pct_count}%)</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.4 }}>
                    R$ <AnimatedCounter value={seg.valor} decimals={2} duration={1200} />
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, fontWeight: 500 }}>
                    faturamento <span style={{ color: seg.color, fontWeight: 700 }}>({seg.pct_valor}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
