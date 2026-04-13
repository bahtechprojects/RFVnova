import { motion } from 'framer-motion'
import { ShieldCheck, Clock, Warning, Snowflake } from '@phosphor-icons/react'
import AnimatedCounter from './AnimatedCounter'

export default function RevenueThermometer({ segmentos, resumo }) {
  if (!segmentos || !resumo) return null

  const campeoes = segmentos.find(s => s.nome === 'Campeões')
  const leais = segmentos.find(s => s.nome === 'Leais')
  const precisam = segmentos.find(s => s.nome === 'Precisam Atenção')
  const risco = segmentos.find(s => s.nome === 'Em Risco')
  const naoPodePerder = segmentos.find(s => s.nome === 'Não Pode Perder')
  const hibernando = segmentos.find(s => s.nome === 'Hibernando')

  const segura = (campeoes?.valor || 0) + (leais?.valor || 0)
  const emJogo = precisam?.valor || 0
  const emRisco = (risco?.valor || 0) + (naoPodePerder?.valor || 0)
  const perdida = hibernando?.valor || 0
  const total = segura + emJogo + emRisco + perdida || 1

  const bars = [
    { label: 'Receita Segura', value: segura, pct: (segura / total * 100), color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: ShieldCheck, desc: 'Campeões + Leais' },
    { label: 'Em Jogo', value: emJogo, pct: (emJogo / total * 100), color: '#ca8a04', bg: '#fefce8', border: '#fde68a', icon: Clock, desc: 'Precisam Atenção' },
    { label: 'Em Risco', value: emRisco, pct: (emRisco / total * 100), color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: Warning, desc: 'Em Risco + Não Pode Perder' },
    { label: 'Receita Perdida', value: perdida, pct: (perdida / total * 100), color: '#64748b', bg: '#f8fafc', border: '#e2e8f0', icon: Snowflake, desc: 'Hibernando' },
  ]

  // Custo da inação: valor em risco + em jogo dividido por semanas de recência média
  const semanas = Math.max(1, Math.round(resumo.recencia_media / 7))
  const custoSemanal = Math.round((emRisco + emJogo) / semanas)

  return (
    <motion.div
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28, marginBottom: 24 }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
        Termômetro de Receita
      </h3>
      <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>
        Onde está o dinheiro da sua base de clientes
      </p>

      {/* Barra horizontal empilhada */}
      <div style={{ display: 'flex', height: 40, borderRadius: 10, overflow: 'hidden', marginBottom: 20, border: '1px solid #e2e8f0' }}>
        {bars.map((b, i) => (
          <motion.div
            key={i}
            initial={{ width: 0 }}
            animate={{ width: `${b.pct}%` }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
            style={{
              background: b.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff',
              minWidth: b.pct > 3 ? 0 : 0,
              overflow: 'hidden', whiteSpace: 'nowrap'
            }}
            title={`${b.label}: R$ ${b.value.toLocaleString('pt-BR')}`}
          >
            {b.pct > 12 && `${b.pct.toFixed(0)}%`}
          </motion.div>
        ))}
      </div>

      {/* Cards de cada faixa */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {bars.map((b, i) => {
          const Icon = b.icon
          return (
            <motion.div
              key={i}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              style={{
                background: b.bg, borderRadius: 12, padding: '16px 14px',
                border: `1px solid ${b.border}`, textAlign: 'center'
              }}
            >
              <Icon size={20} weight="bold" color={b.color} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                {b.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: b.color, lineHeight: 1 }}>
                R$ <AnimatedCounter value={b.value / 1000} decimals={0} />k
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{b.desc}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Custo da Inação */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          background: '#fef2f2', borderRadius: 12, padding: '18px 22px',
          border: '1px solid #fecaca',
          display: 'flex', alignItems: 'center', gap: 20
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <Warning size={24} weight="bold" color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>
            Custo da Inação
          </div>
          <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
            Cada semana sem agir nos clientes em risco, você potencialmente perde{' '}
            <strong style={{ color: '#dc2626' }}>R$ {custoSemanal.toLocaleString('pt-BR')}/semana</strong>.
            {' '}Já são <strong style={{ color: '#dc2626' }}>R$ {perdida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> em receita de clientes que hibernaram.
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
