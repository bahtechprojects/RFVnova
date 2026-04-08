import { motion } from 'framer-motion'
import AnimatedCounter from './AnimatedCounter'

export default function SegmentCards({ segmentos }) {
  if (!segmentos || segmentos.length === 0) return null

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 14
    }}>
      {segmentos.map((seg, i) => (
        <motion.div
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 + i * 0.06 }}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          style={{
            background: 'rgba(6, 9, 18, 0.6)',
            borderRadius: 16,
            padding: '18px 20px',
            borderLeft: `3px solid ${seg.color}`,
            border: '1px solid rgba(255,255,255,0.04)',
            borderLeftWidth: 3,
            borderLeftColor: seg.color,
            position: 'relative',
            overflow: 'hidden',
            cursor: 'default'
          }}
        >
          {/* Subtle gradient */}
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 100,
            background: `linear-gradient(90deg, ${seg.color}08, transparent)`,
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 22 }}>{seg.icon}</span>
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
      ))}
    </div>
  )
}
