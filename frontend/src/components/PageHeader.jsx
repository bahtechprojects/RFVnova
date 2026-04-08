import { motion } from 'framer-motion'
import { Printer, CalendarBlank } from '@phosphor-icons/react'

export default function PageHeader({ title, subtitle, data }) {
  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
        paddingBottom: 20,
        borderBottom: '1px solid rgba(255,255,255,0.04)'
      }}
    >
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: -0.8 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: '#475569', fontSize: 13, marginTop: 4, fontWeight: 500 }}>
            {subtitle}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.print()}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '8px 16px',
            color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter'
          }}
        >
          <Printer size={14} weight="bold" /> PDF
        </motion.button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(34, 197, 94, 0.08)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#22c55e'
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
            boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)',
            animation: 'pulse 2s infinite'
          }} />
          Ao vivo
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, color: '#475569', fontWeight: 500
        }}>
          <CalendarBlank size={14} />
          {data?.generated_at ? new Date(data.generated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
        </div>
      </div>
    </motion.div>
  )
}
