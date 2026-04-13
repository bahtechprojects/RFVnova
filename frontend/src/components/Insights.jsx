import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, Target, Warning, Rocket, HandCoins, Megaphone, ArrowRight, CaretDown, CaretUp, Copy } from '@phosphor-icons/react'

export default function Insights({ resumo, segmentos, clientes }) {
  if (!resumo || !segmentos) return null
  const [expandedIndex, setExpandedIndex] = useState(null)

  const campeoes = segmentos.find(s => s.nome === 'Campeões')
  const novos = segmentos.find(s => s.nome === 'Novos')
  const risco = segmentos.find(s => s.nome === 'Em Risco')
  const naoPodePerder = segmentos.find(s => s.nome === 'Não Pode Perder')
  const hibernando = segmentos.find(s => s.nome === 'Hibernando')
  const precisam = segmentos.find(s => s.nome === 'Precisam Atenção')

  const getClientesBySegmento = (...nomes) =>
    (clientes || []).filter(c => nomes.includes(c.segmento)).sort((a, b) => (b.valor || 0) - (a.valor || 0))

  const insights = []

  if (campeoes && campeoes.count > 0) {
    insights.push({ icon: Rocket, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0',
      title: `${campeoes.count} Campeões geram ${campeoes.pct_valor}% do faturamento`,
      desc: `Representam ${campeoes.pct_count}% da base com R$ ${(campeoes.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
      action: 'Programa VIP, condições exclusivas e priorizar atendimento.',
      clientes: getClientesBySegmento('Campeões'), valorTotal: campeoes.valor || 0 })
  }
  if (novos && novos.count > 0 && novos.pct_count > 30) {
    insights.push({ icon: Target, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe',
      title: `${novos.count} clientes Novos (${novos.pct_count}% da base)`,
      desc: 'Oportunidade de converter em recorrentes.',
      action: 'Boas-vindas, desconto na 2ª compra, follow-up em 15 dias.',
      clientes: getClientesBySegmento('Novos'), valorTotal: novos.valor || 0 })
  }
  if (hibernando && hibernando.count > 0) {
    insights.push({ icon: Warning, color: '#ea580c', bg: '#fff7ed', border: '#fed7aa',
      title: `${hibernando.count} Hibernando (R$ ${(hibernando.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} parados)`,
      desc: `${hibernando.pct_count}% da base sem comprar há muito tempo.`,
      action: 'Campanha de reativação com oferta especial.',
      clientes: getClientesBySegmento('Hibernando'), valorTotal: hibernando.valor || 0 })
  }
  const emRiscoTotal = (risco?.count || 0) + (naoPodePerder?.count || 0)
  const emRiscoValor = (risco?.valor || 0) + (naoPodePerder?.valor || 0)
  if (emRiscoTotal > 0) {
    insights.push({ icon: HandCoins, color: '#dc2626', bg: '#fef2f2', border: '#fecaca',
      title: `${emRiscoTotal} clientes de alto valor em risco (R$ ${emRiscoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`,
      desc: 'Compravam frequentemente e pararam. Cada dia sem ação aumenta o risco.',
      action: 'AÇÃO IMEDIATA: Contato direto pelo comercial.',
      clientes: getClientesBySegmento('Em Risco', 'Não Pode Perder'), valorTotal: emRiscoValor })
  }
  if (precisam && precisam.count > 0) {
    insights.push({ icon: Megaphone, color: '#ca8a04', bg: '#fefce8', border: '#fde68a',
      title: `${precisam.count} clientes Precisam de Atenção`,
      desc: 'No limite entre ficar ativos ou cair para hibernação.',
      action: 'Comunicação personalizada e visita comercial.',
      clientes: getClientesBySegmento('Precisam Atenção'), valorTotal: precisam.valor || 0 })
  }

  const upsellCandidates = (clientes || []).filter(c => c.f_score >= 4 && c.v_score <= 2).sort((a, b) => b.frequencia - a.frequencia).slice(0, 15)
  if (upsellCandidates.length >= 3) {
    insights.push({ icon: Rocket, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe',
      title: `${upsellCandidates.length} oportunidades de upsell`,
      desc: 'Alta frequência mas ticket baixo — potencial para aumentar valor.',
      action: 'Produtos premium, combos ou condições para pedidos maiores.',
      clientes: upsellCandidates, valorTotal: upsellCandidates.reduce((a, c) => a + (c.valor || 0), 0) })
  }

  const copyClientList = (list) => {
    const text = list.map(c => `${c.nome}\t${c.data_ult_compra || '-'}\t${c.frequencia}\tR$ ${(c.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`).join('\n')
    navigator.clipboard.writeText(`Nome\tÚltima Compra\tPedidos\tValor\n${text}`)
  }

  const totalClientes = insights.reduce((a, ins) => a + (ins.clientes?.length || 0), 0)
  const valorOportunidades = insights.filter(i => ['#16a34a', '#2563eb'].includes(i.color)).reduce((a, i) => a + (i.valorTotal || 0), 0)
  const valorEmRisco = insights.filter(i => ['#dc2626', '#ea580c', '#ca8a04'].includes(i.color)).reduce((a, i) => a + (i.valorTotal || 0), 0)

  return (
    <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28 }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Lightbulb size={20} weight="bold" color="#ca8a04" />
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b' }}>Insights e Recomendações</h2>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#ca8a04', background: '#fefce8', border: '1px solid #fde68a', padding: '3px 10px', borderRadius: 20, marginLeft: 'auto' }}>
          {insights.length} ações
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Clientes envolvidos</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>{totalClientes}</div>
        </div>
        <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '12px 14px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#16a34a', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Oportunidades</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#16a34a' }}>R$ {valorOportunidades.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
        </div>
        <div style={{ background: '#fef2f2', borderRadius: 10, padding: '12px 14px', border: '1px solid #fecaca', textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#dc2626', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Valor em risco</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#dc2626' }}>R$ {valorEmRisco.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
        </div>
      </div>

      <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 14 }}>Clique em cada insight para ver os clientes envolvidos</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {insights.map((ins, i) => {
          const Icon = ins.icon
          const isExpanded = expandedIndex === i
          return (
            <motion.div key={i} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.06 }}>
              <div onClick={() => setExpandedIndex(isExpanded ? null : i)}
                style={{ background: ins.bg, borderRadius: isExpanded ? '12px 12px 0 0' : 12, padding: '18px 20px', border: `1px solid ${ins.border}`, borderLeft: `3px solid ${ins.color}`, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: `1px solid ${ins.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} weight="bold" color={ins.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{ins.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 11 }}>
                        {ins.clientes.length > 0 && <span>{ins.clientes.length} clientes</span>}
                        {isExpanded ? <CaretUp size={12} weight="bold" /> : <CaretDown size={12} weight="bold" />}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, marginBottom: 8 }}>{ins.desc}</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: ins.color, background: '#fff', padding: '6px 12px', borderRadius: 6, border: `1px solid ${ins.border}` }}>
                      <ArrowRight size={11} weight="bold" /> {ins.action}
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && ins.clientes.length > 0 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
                    <div style={{ background: '#fff', borderRadius: '0 0 12px 12px', padding: '14px 20px 18px', borderLeft: `3px solid ${ins.color}`, borderRight: `1px solid ${ins.border}`, borderBottom: `1px solid ${ins.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Clientes ({ins.clientes.length})</span>
                        <button onClick={(e) => { e.stopPropagation(); copyClientList(ins.clientes) }}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 10px', color: '#64748b', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'Inter' }}>
                          <Copy size={11} weight="bold" /> Copiar
                        </button>
                      </div>
                      <div style={{ borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                          <thead>
                            <tr>
                              {['Cliente', 'Última Compra', 'Pedidos', 'Valor', 'Segmento'].map(h => (
                                <th key={h} style={{ background: '#f8fafc', color: '#94a3b8', padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {ins.clientes.slice(0, 20).map((c, ci) => (
                              <tr key={c.id || ci} style={{ transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', fontWeight: 600, color: '#1e293b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nome}</td>
                                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', color: '#64748b' }}>{c.data_ult_compra || '-'}</td>
                                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', textAlign: 'center', color: '#64748b' }}>{c.frequencia}</td>
                                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, color: '#16a34a' }}>R$ {(c.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9' }}>
                                  <span style={{ background: `${c.seg_color || '#64748b'}12`, color: c.seg_color || '#64748b', padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 700 }}>{c.segmento}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {ins.clientes.length > 20 && <div style={{ textAlign: 'center', padding: 8, fontSize: 11, color: '#94a3b8' }}>... e mais {ins.clientes.length - 20}</div>}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
