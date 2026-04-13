import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Diamond, Sparkle, Star, Eye, Warning, Siren, Moon, CaretDown, CaretUp, Target } from '@phosphor-icons/react'
import AnimatedCounter from './AnimatedCounter'

const segIcons = {
  'Campeões': Trophy, 'Leais': Diamond, 'Novos': Sparkle,
  'Potenciais Leais': Star, 'Precisam Atenção': Eye,
  'Em Risco': Warning, 'Não Pode Perder': Siren,
  'Hibernando': Moon, 'Outros': Star,
}

const strategies = {
  'Campeões': { strategy: 'Programa VIP com benefícios exclusivos', actions: ['Programa de fidelidade premium', 'Condições comerciais diferenciadas', 'Priorizar atendimento', 'Pedir indicações'], urgency: 'green' },
  'Leais': { strategy: 'Fortalecer relacionamento e aumentar ticket', actions: ['Apresentar novos produtos', 'Oferecer combos e pacotes', 'Convidar para eventos', 'Programa de pontos'], urgency: 'green' },
  'Novos': { strategy: 'Converter em clientes recorrentes', actions: ['Fluxo de boas-vindas', 'Desconto na 2ª compra', 'Follow-up em 15 dias', 'Apresentar portfólio'], urgency: 'blue' },
  'Precisam Atenção': { strategy: 'Reengajar antes que esfriem', actions: ['WhatsApp personalizado', 'Oferta com prazo limitado', 'Visita comercial', 'Pesquisa de satisfação'], urgency: 'yellow' },
  'Em Risco': { strategy: 'Ação imediata do time comercial', actions: ['Contato do gerente comercial', 'Oferta de reativação', 'Entender motivo da ausência', 'Condições especiais'], urgency: 'red' },
  'Não Pode Perder': { strategy: 'PRIORIDADE MÁXIMA — recuperar agora', actions: ['Visita presencial urgente', 'Desconto agressivo', 'Escalar para diretoria', 'Diagnóstico de insatisfação'], urgency: 'red' },
  'Hibernando': { strategy: 'Campanha de reativação em massa', actions: ['Campanha "sentimos sua falta"', 'Ligar para os de maior valor', 'Oferta especial de retorno', 'Limpar inativos > 2 anos'], urgency: 'orange' }
}

const urgencyBadge = {
  green: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', text: 'SAUDÁVEL' },
  blue: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', text: 'OPORTUNIDADE' },
  yellow: { bg: '#fefce8', color: '#ca8a04', border: '#fde68a', text: 'ATENÇÃO' },
  orange: { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa', text: 'MODERADO' },
  red: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', text: 'URGENTE' }
}

export default function SegmentCards({ segmentos, clientes }) {
  const [expandedSeg, setExpandedSeg] = useState(null)
  if (!segmentos || segmentos.length === 0) return null

  const getClientesBySegmento = (nome) =>
    (clientes || []).filter(c => c.segmento === nome).sort((a, b) => (b.valor || 0) - (a.valor || 0))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
      {segmentos.map((seg, i) => {
        const Icon = segIcons[seg.nome] || Star
        const strat = strategies[seg.nome]
        const isExpanded = expandedSeg === seg.nome
        const badge = strat ? urgencyBadge[strat.urgency] : null

        return (
          <motion.div key={i}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.03 + i * 0.04 }}>

            <div
              onClick={() => setExpandedSeg(isExpanded ? null : seg.nome)}
              style={{
                background: '#fff', borderRadius: isExpanded ? '12px 12px 0 0' : 12,
                padding: '16px 18px', border: '1px solid #e2e8f0',
                borderLeft: `3px solid ${seg.color}`, cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                boxShadow: isExpanded ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: `${seg.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={15} weight="bold" color={seg.color} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#1e293b', flex: 1 }}>{seg.nome}</span>
                {badge && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: badge.color,
                    background: badge.bg, padding: '2px 7px', borderRadius: 4
                  }}>{badge.text}</span>
                )}
                {isExpanded ? <CaretUp size={12} color="#94a3b8" weight="bold" /> : <CaretDown size={12} color="#94a3b8" weight="bold" />}
              </div>

              <div style={{ display: 'flex', gap: 24 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>
                    <AnimatedCounter value={seg.count} duration={1000} />
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>
                    clientes <span style={{ color: seg.color, fontWeight: 700 }}>({seg.pct_count}%)</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', lineHeight: 1.4 }}>
                    R$ <AnimatedCounter value={seg.valor} decimals={2} duration={1200} />
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                    faturamento <span style={{ color: seg.color, fontWeight: 700 }}>({seg.pct_valor}%)</span>
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && strat && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
                  <div style={{
                    background: '#f8fafc', borderRadius: '0 0 12px 12px', padding: '14px 18px',
                    borderLeft: `3px solid ${seg.color}`, borderRight: '1px solid #e2e8f0',
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: seg.color, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Target size={13} weight="bold" /> {strat.strategy}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                      {strat.actions.map((a, ai) => (
                        <div key={ai} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#475569' }}>
                          <div style={{ width: 4, height: 4, borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
                          {a}
                        </div>
                      ))}
                    </div>
                    {clientes && getClientesBySegmento(seg.nome).length > 0 && (
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                          Top clientes
                        </div>
                        {getClientesBySegmento(seg.nome).slice(0, 5).map((c, ci) => (
                          <div key={ci} style={{
                            display: 'flex', justifyContent: 'space-between', padding: '5px 0',
                            borderBottom: ci < 4 ? '1px solid #e2e8f0' : 'none', fontSize: 11
                          }}>
                            <span style={{ color: '#1e293b', fontWeight: 600, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nome}</span>
                            <span style={{ color: '#16a34a', fontWeight: 700 }}>R$ {(c.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
