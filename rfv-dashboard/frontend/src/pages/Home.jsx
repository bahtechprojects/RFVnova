import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChartBar, Users, ArrowRight, CurrencyDollar, Lightning } from '@phosphor-icons/react'

export default function Home() {
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/empresas')
      .then(r => r.json())
      .then(data => { setEmpresas(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          background: 'rgba(12, 17, 32, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '16px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
          }}>
            <ChartBar size={22} weight="bold" color="#fff" />
          </div>
          <div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>
              <span style={{ color: '#8b5cf6' }}>bah</span>tech
            </span>
          </div>
        </div>
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          padding: '6px 16px', borderRadius: 20,
          fontSize: 13, fontWeight: 600, color: '#8b5cf6',
          display: 'flex', alignItems: 'center', gap: 6
        }}>
          <Lightning size={14} weight="fill" />
          RFV Analytics
        </div>
      </motion.header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 48, textAlign: 'center' }}
        >
          <h1 style={{
            fontSize: 48, fontWeight: 900, color: '#fff',
            letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16
          }}>
            Dashboard <span style={{
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>RFV</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: 17, maxWidth: 500, margin: '0 auto' }}>
            Segmentação inteligente de clientes por Recência, Frequência e Valor
          </p>
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                border: '3px solid rgba(139, 92, 246, 0.2)',
                borderTopColor: '#8b5cf6'
              }}
            />
          </div>
        ) : empresas.length === 0 ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              textAlign: 'center', padding: '80px 24px',
              background: 'rgba(15, 22, 40, 0.5)',
              backdropFilter: 'blur(20px)',
              borderRadius: 24,
              border: '1px dashed rgba(139, 92, 246, 0.2)'
            }}>
            <Users size={56} color="#334155" style={{ marginBottom: 20 }} />
            <h2 style={{ fontSize: 22, color: '#94a3b8', fontWeight: 700, marginBottom: 12 }}>
              Nenhuma empresa sincronizada
            </h2>
            <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.8 }}>
              Execute o script <code style={{
                background: 'rgba(139, 92, 246, 0.15)', padding: '3px 10px',
                borderRadius: 6, color: '#8b5cf6', fontWeight: 600
              }}>sync_rfv.py</code> na máquina do cliente
            </p>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {empresas.map((emp, idx) => (
              <motion.div
                key={emp.id}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + idx * 0.1 }}
              >
                <Link to={`/dashboard/${emp.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.995 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(15, 22, 40, 0.8), rgba(20, 29, 53, 0.8))',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 20,
                      padding: '32px 36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'border-color 0.3s, box-shadow 0.3s',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)'
                      e.currentTarget.style.boxShadow = '0 0 40px rgba(139, 92, 246, 0.08)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    {/* Gradient accent line */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                      background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.4), transparent)'
                    }} />

                    <div>
                      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: -0.3 }}>
                        {emp.nome}
                      </h3>
                      <div style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%', background: '#22c55e',
                          boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)'
                        }} />
                        Sincronizado em {emp.atualizado ? new Date(emp.atualizado).toLocaleString('pt-BR') : 'N/A'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                          <Users size={16} color="#8b5cf6" weight="bold" />
                          <span style={{ fontSize: 28, fontWeight: 900, color: '#8b5cf6' }}>
                            {emp.total_clientes}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>clientes ativos</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                          <CurrencyDollar size={16} color="#22c55e" weight="bold" />
                          <span style={{ fontSize: 28, fontWeight: 900, color: '#22c55e' }}>
                            {(emp.total_valor / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>faturamento</div>
                      </div>
                      <div style={{
                        width: 44, height: 44, borderRadius: 14,
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <ArrowRight size={20} color="#8b5cf6" weight="bold" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
