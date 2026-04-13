import { motion } from 'framer-motion'
import { Handshake, Warning, UserPlus, ArrowRight } from '@phosphor-icons/react'
import AnimatedCounter from './AnimatedCounter'

export default function QuickActionPanel({ segmentos, onNavigate }) {
  if (!segmentos) return null

  const campeoes = segmentos.find(s => s.nome === 'Campeões')
  const leais = segmentos.find(s => s.nome === 'Leais')
  const risco = segmentos.find(s => s.nome === 'Em Risco')
  const naoPodePerder = segmentos.find(s => s.nome === 'Não Pode Perder')
  const novos = segmentos.find(s => s.nome === 'Novos')

  const vendasFaceis = (campeoes?.count || 0) + (leais?.count || 0)
  const vendasFaceisValor = (campeoes?.valor || 0) + (leais?.valor || 0)
  const clientesRisco = (risco?.count || 0) + (naoPodePerder?.count || 0)
  const riscoValor = (risco?.valor || 0) + (naoPodePerder?.valor || 0)
  const novosCount = novos?.count || 0

  const actions = [
    {
      icon: Handshake,
      label: 'Vendas Fáceis',
      desc: 'Campeões + Leais prontos para upsell',
      count: vendasFaceis,
      valor: vendasFaceisValor,
      color: '#16a34a',
      bgCard: '#f0fdf4',
      borderColor: '#bbf7d0'
    },
    {
      icon: Warning,
      label: 'Receita em Risco',
      desc: 'Clientes de alto valor sumindo',
      count: clientesRisco,
      valor: riscoValor,
      color: '#dc2626',
      bgCard: '#fef2f2',
      borderColor: '#fecaca',
      pulse: true
    },
    {
      icon: UserPlus,
      label: 'Oportunidade Novos',
      desc: 'Converter em recorrentes',
      count: novosCount,
      valor: null,
      color: '#2563eb',
      bgCard: '#eff6ff',
      borderColor: '#bfdbfe'
    }
  ]

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16, marginBottom: 24
    }}>
      {actions.map((a, i) => {
        const Icon = a.icon
        return (
          <motion.div
            key={i}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08 + i * 0.06 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            onClick={() => onNavigate && onNavigate('clientes')}
            style={{
              background: a.bgCard,
              borderRadius: 14, padding: '22px 20px',
              border: `1px solid ${a.borderColor}`,
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            {a.pulse && (
              <div style={{
                position: 'absolute', top: 14, right: 14,
                width: 8, height: 8, borderRadius: '50%',
                background: a.color,
                animation: 'pulse 2s infinite'
              }} />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: '#fff',
                border: `1px solid ${a.borderColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={18} weight="bold" color={a.color} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
                  {a.label}
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  {a.desc}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: a.color, lineHeight: 1 }}>
                <AnimatedCounter value={a.count} />
              </span>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>clientes</span>
            </div>

            {a.valor !== null && (
              <div style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>
                R$ <AnimatedCounter value={a.valor} decimals={2} /> em jogo
              </div>
            )}

            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              marginTop: 12, fontSize: 12, fontWeight: 600, color: a.color
            }}>
              <ArrowRight size={12} weight="bold" />
              Ver clientes
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
