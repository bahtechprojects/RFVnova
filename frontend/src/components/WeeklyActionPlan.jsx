import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, MapPin, EnvelopeSimple, CheckCircle, Circle, Printer } from '@phosphor-icons/react'

export default function WeeklyActionPlan({ clientes, segmentos, resumo }) {
  if (!clientes || !segmentos) return null
  const [checked, setChecked] = useState({})

  const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }))

  const ticketMedio = resumo?.total_pedidos > 0 ? resumo.total_valor / resumo.total_pedidos : 0

  // PRIORIDADE 1: Clientes em risco / não pode perder (maior valor primeiro)
  const urgentes = clientes
    .filter(c => ['Em Risco', 'Não Pode Perder'].includes(c.segmento))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 10)

  // PRIORIDADE 2: Precisam atenção com ticket acima da média
  const atencao = clientes
    .filter(c => c.segmento === 'Precisam Atenção' && c.valor > ticketMedio)
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 10)

  // PRIORIDADE 3: Novos com maior valor (potencial de conversão)
  const novosTop = clientes
    .filter(c => c.segmento === 'Novos')
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 10)

  const groups = [
    {
      title: 'Ligar Hoje',
      subtitle: 'Clientes de alto valor sumindo — cada dia conta',
      icon: Phone, color: '#dc2626', bg: '#fef2f2', border: '#fecaca',
      items: urgentes, action: 'Ligar'
    },
    {
      title: 'Agendar Visita Esta Semana',
      subtitle: 'Clientes esfriando que respondem bem a contato pessoal',
      icon: MapPin, color: '#ca8a04', bg: '#fefce8', border: '#fde68a',
      items: atencao, action: 'Visitar'
    },
    {
      title: 'Enviar Proposta / Follow-up',
      subtitle: 'Novos clientes com maior potencial de se tornarem recorrentes',
      icon: EnvelopeSimple, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe',
      items: novosTop, action: 'Enviar'
    }
  ]

  const totalAcoes = urgentes.length + atencao.length + novosTop.length
  const completadas = Object.values(checked).filter(Boolean).length

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>
            {completadas} de {totalAcoes} ações concluídas
          </div>
          <div style={{ height: 4, width: 200, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(completadas / Math.max(totalAcoes, 1)) * 100}%`, background: '#16a34a', borderRadius: 2, transition: 'width 0.3s' }} />
          </div>
        </div>
        <button onClick={() => window.print()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 16px', color: '#475569', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'Inter' }}>
          <Printer size={14} weight="bold" /> Imprimir
        </button>
      </div>

      {/* Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {groups.map((g, gi) => {
          if (g.items.length === 0) return null
          const Icon = g.icon
          const valorTotal = g.items.reduce((a, c) => a + (c.valor || 0), 0)
          return (
            <motion.div key={gi} initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + gi * 0.1 }}
              style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>

              {/* Group Header */}
              <div style={{ background: g.bg, padding: '16px 22px', borderBottom: `1px solid ${g.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: '#fff', border: `1px solid ${g.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} weight="bold" color={g.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
                      Prioridade {gi + 1} — {g.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{g.subtitle}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: g.color }}>
                    R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>{g.items.length} clientes</div>
                </div>
              </div>

              {/* Items */}
              <div>
                {g.items.map((c, ci) => {
                  const key = `${gi}-${ci}`
                  const done = checked[key]
                  return (
                    <div key={ci}
                      onClick={() => toggle(key)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '12px 22px', borderBottom: ci < g.items.length - 1 ? '1px solid #f1f5f9' : 'none',
                        cursor: 'pointer', transition: 'background 0.15s',
                        background: done ? '#f8fafc' : '#fff',
                        opacity: done ? 0.6 : 1
                      }}
                    >
                      {done
                        ? <CheckCircle size={20} weight="fill" color="#16a34a" />
                        : <Circle size={20} weight="regular" color="#cbd5e1" />
                      }
                      <div style={{ flex: 1, textDecoration: done ? 'line-through' : 'none' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{c.nome}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                        {c.data_ult_compra || '-'}
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap', minWidth: 70 }}>
                        {c.recencia_dias < 9999 ? `${c.recencia_dias}d` : '-'}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#16a34a', whiteSpace: 'nowrap', minWidth: 100, textAlign: 'right' }}>
                        R$ {(c.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
