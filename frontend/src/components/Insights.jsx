import { motion } from 'framer-motion'
import { Lightbulb, Target, Warning, Rocket, HandCoins, Megaphone, ArrowRight } from '@phosphor-icons/react'

export default function Insights({ resumo, segmentos, clientes }) {
  if (!resumo || !segmentos) return null

  const total = resumo.clientes_ativos || 1
  const campeoes = segmentos.find(s => s.nome === 'Campeões')
  const leais = segmentos.find(s => s.nome === 'Leais')
  const novos = segmentos.find(s => s.nome === 'Novos')
  const risco = segmentos.find(s => s.nome === 'Em Risco')
  const naoPodePerder = segmentos.find(s => s.nome === 'Não Pode Perder')
  const hibernando = segmentos.find(s => s.nome === 'Hibernando')
  const precisam = segmentos.find(s => s.nome === 'Precisam Atenção')

  const insights = []

  // Insight: Campeões
  if (campeoes && campeoes.count > 0) {
    insights.push({
      type: 'success',
      icon: Rocket,
      color: '#22c55e',
      title: `${campeoes.count} Campeões geram ${campeoes.pct_valor}% do faturamento`,
      desc: `Esses clientes são o motor do negócio. Representam apenas ${campeoes.pct_count}% da base mas contribuem com R$ ${(campeoes.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em vendas.`,
      action: 'Criar programa de fidelidade VIP, oferecer condições exclusivas e priorizar o atendimento.'
    })
  }

  // Insight: Novos
  if (novos && novos.count > 0 && novos.pct_count > 30) {
    insights.push({
      type: 'opportunity',
      icon: Target,
      color: '#a855f7',
      title: `${novos.count} clientes Novos (${novos.pct_count}% da base)`,
      desc: `Grande volume de clientes com poucas compras. Há uma oportunidade enorme de converter esses novos em recorrentes.`,
      action: 'Implementar fluxo de boas-vindas, oferecer desconto na 2a compra e fazer follow-up em 15 dias.'
    })
  }

  // Insight: Hibernando
  if (hibernando && hibernando.count > 0) {
    insights.push({
      type: 'warning',
      icon: Warning,
      color: '#f97316',
      title: `${hibernando.count} clientes Hibernando (R$ ${(hibernando.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} parados)`,
      desc: `${hibernando.pct_count}% da base não compra há muito tempo. Esse valor representa receita potencial perdida que pode ser recuperada.`,
      action: 'Campanha de reativação com oferta especial, ligação comercial ou visita técnica para entender o motivo da inatividade.'
    })
  }

  // Insight: Em Risco + Não Pode Perder
  const emRiscoTotal = (risco?.count || 0) + (naoPodePerder?.count || 0)
  const emRiscoValor = (risco?.valor || 0) + (naoPodePerder?.valor || 0)
  if (emRiscoTotal > 0) {
    insights.push({
      type: 'danger',
      icon: HandCoins,
      color: '#ef4444',
      title: `${emRiscoTotal} clientes de alto valor em risco (R$ ${emRiscoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`,
      desc: `Clientes que compravam frequentemente e em alto valor mas pararam. Cada dia sem ação aumenta a chance de perder definitivamente.`,
      action: 'AÇÃO IMEDIATA: Contato direto pelo gerente comercial, entender insatisfação e oferecer condições de retorno.'
    })
  }

  // Insight: Precisam Atenção
  if (precisam && precisam.count > 0) {
    insights.push({
      type: 'attention',
      icon: Megaphone,
      color: '#eab308',
      title: `${precisam.count} clientes Precisam de Atenção`,
      desc: `Clientes com recência mediana que estão no limite entre ficar ativos ou cair para hibernação. Intervenção agora previne perda futura.`,
      action: 'Enviar comunicação personalizada, apresentar novos produtos/serviços e agendar visita comercial.'
    })
  }

  // Insight: Recência Alta
  if (resumo.recencia_media > 365) {
    insights.push({
      type: 'warning',
      icon: Lightbulb,
      color: '#06b6d4',
      title: `Recência média de ${resumo.recencia_media} dias — acima do ideal`,
      desc: `A média de dias desde a última compra está muito alta. Para um negócio B2B saudável, o ideal é manter abaixo de 180 dias.`,
      action: 'Revisar o ciclo de compra do segmento, implementar lembretes automáticos e criar ofertas periódicas.'
    })
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.25 }}
      style={{
        background: 'linear-gradient(145deg, rgba(15, 22, 40, 0.9), rgba(12, 17, 32, 0.9))',
        backdropFilter: 'blur(20px)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.06)',
        padding: 28, marginBottom: 28,
        position: 'relative', overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute', top: -1, left: '10%', right: '10%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(234, 179, 8, 0.3), transparent)'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <Lightbulb size={22} weight="fill" color="#eab308" />
        <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>
          Insights e Recomendações
        </h2>
        <span style={{
          fontSize: 11, fontWeight: 700, color: '#eab308',
          background: 'rgba(234, 179, 8, 0.1)',
          border: '1px solid rgba(234, 179, 8, 0.2)',
          padding: '3px 10px', borderRadius: 20
        }}>
          {insights.length} ações sugeridas
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {insights.map((insight, i) => {
          const Icon = insight.icon
          return (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              style={{
                background: 'rgba(6, 9, 18, 0.5)',
                borderRadius: 16,
                padding: '20px 24px',
                borderLeft: `3px solid ${insight.color}`,
                border: '1px solid rgba(255,255,255,0.04)',
                borderLeftWidth: 3,
                borderLeftColor: insight.color,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                  background: `${insight.color}12`,
                  border: `1px solid ${insight.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={20} weight="bold" color={insight.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: -0.2 }}>
                    {insight.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 10 }}>
                    {insight.desc}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontSize: 12, fontWeight: 700, color: insight.color,
                    background: `${insight.color}08`,
                    padding: '8px 14px', borderRadius: 10,
                    border: `1px solid ${insight.color}15`
                  }}>
                    <ArrowRight size={14} weight="bold" />
                    {insight.action}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
