import { motion } from 'framer-motion'
import { Wrench } from '@phosphor-icons/react'

export default function InsightsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0',
        padding: '80px 40px', textAlign: 'center'
      }}
    >
      <div style={{
        width: 64, height: 64, borderRadius: 16, background: '#eff6ff',
        border: '1px solid #bfdbfe', display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center', marginBottom: 20
      }}>
        <Wrench size={28} weight="bold" color="#1e3a5f" />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
        Em desenvolvimento
      </h2>
      <p style={{ fontSize: 14, color: '#64748b', maxWidth: 420, margin: '0 auto', lineHeight: 1.7 }}>
        Estamos preparando insights ainda mais inteligentes para você.
        <br />Esta funcionalidade será disponibilizada em breve.
      </p>
    </motion.div>
  )
}
