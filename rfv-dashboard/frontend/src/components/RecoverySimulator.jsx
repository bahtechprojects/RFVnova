import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendUp, Recycle, UserPlus } from '@phosphor-icons/react'

export default function RecoverySimulator({ segmentos }) {
  if (!segmentos) return null

  const hibernando = segmentos.find(s => s.nome === 'Hibernando')
  const novos = segmentos.find(s => s.nome === 'Novos')

  const [pctReativar, setPctReativar] = useState(20)
  const [pctConverter, setPctConverter] = useState(15)

  const valorReativado = ((hibernando?.valor || 0) * pctReativar) / 100
  const clientesReativados = Math.round(((hibernando?.count || 0) * pctReativar) / 100)
  const valorConvertido = ((novos?.valor || 0) * pctConverter) / 100
  const clientesConvertidos = Math.round(((novos?.count || 0) * pctConverter) / 100)
  const totalRecuperado = valorReativado + valorConvertido

  const sliderStyle = {
    width: '100%', height: 6, appearance: 'none', WebkitAppearance: 'none',
    background: '#e2e8f0', borderRadius: 3, outline: 'none', cursor: 'pointer'
  }

  return (
    <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28, marginBottom: 24 }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <TrendUp size={22} weight="bold" color="#16a34a" />
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Simulador de Recuperação</h3>
      </div>
      <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 24 }}>
        Ajuste os percentuais e veja o impacto em receita
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Reativar Hibernando */}
        <div style={{ background: '#f8fafc', borderRadius: 14, padding: 22, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Recycle size={18} weight="bold" color="#ea580c" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Reativar Hibernando</span>
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>
            {hibernando?.count || 0} clientes com R$ {((hibernando?.valor || 0) / 1000).toFixed(0)}k parados
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>Reativar</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#ea580c' }}>{pctReativar}%</span>
          </div>
          <input type="range" min={5} max={50} value={pctReativar}
            onChange={e => setPctReativar(Number(e.target.value))}
            style={sliderStyle} />
          <style>{`input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #1e3a5f; cursor: pointer; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }`}</style>

          <div style={{ marginTop: 16, padding: '14px 16px', background: '#fff7ed', borderRadius: 10, border: '1px solid #fed7aa' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#ea580c', lineHeight: 1 }}>
              R$ {valorReativado.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
              {clientesReativados} clientes de volta
            </div>
          </div>
        </div>

        {/* Converter Novos */}
        <div style={{ background: '#f8fafc', borderRadius: 14, padding: 22, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <UserPlus size={18} weight="bold" color="#2563eb" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Converter Novos</span>
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>
            {novos?.count || 0} clientes com R$ {((novos?.valor || 0) / 1000).toFixed(0)}k em potencial
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>Converter</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#2563eb' }}>{pctConverter}%</span>
          </div>
          <input type="range" min={5} max={50} value={pctConverter}
            onChange={e => setPctConverter(Number(e.target.value))}
            style={sliderStyle} />

          <div style={{ marginTop: 16, padding: '14px 16px', background: '#eff6ff', borderRadius: 10, border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#2563eb', lineHeight: 1 }}>
              R$ {valorConvertido.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
              {clientesConvertidos} clientes recorrentes
            </div>
          </div>
        </div>
      </div>

      {/* Total */}
      <div style={{
        background: '#f0fdf4', borderRadius: 14, padding: '20px 24px',
        border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
            Receita potencial recuperável
          </div>
          <div style={{ fontSize: 11, color: '#475569' }}>
            Combinando reativação + conversão de novos clientes
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#16a34a', lineHeight: 1 }}>
            R$ {totalRecuperado.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
            {clientesReativados + clientesConvertidos} clientes impactados
          </div>
        </div>
      </div>
    </motion.div>
  )
}
