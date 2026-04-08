import { motion } from 'framer-motion'
import { Lightbulb, Target, Warning, Rocket, HandCoins, Megaphone, ArrowRight } from '@phosphor-icons/react'

export default function Insights({ resumo, segmentos, clientes }) {
  if (!resumo || !segmentos) return null

  const total = resumo.clientes_ativos || 1
  const campeoes = segmentos.find(s => s.nome === 'Campeões')
  const novos = segmentos.find(s => s.nome === 'Novos')
  const risco = segmentos.find(s => s.nome === 'Em Risco')
  const naoPodePerder = segmentos.find(s => s.nome === 'Não Pode Perder')
  const hibernando = segmentos.find(s => s.nome === 'Hibernando')
  const precisam = segmentos.find(s => s.nome === 'Precisam Atenção')

  const insights = []

  if (campeoes && campeoes.count > 0) {
    insights.push({
      icon: Rocket, color: '#22c55e',
      title: `${campeoes.count} Campeoes geram ${campeoes.pct_valor}% do faturamento`,
      desc: `Representam apenas ${campeoes.pct_count}% da base mas contribuem com R$ ${(campeoes.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em vendas.`,
      action: 'Criar programa VIP, oferecer condicoes exclusivas e priorizar atendimento.'
    })
  }

  if (novos && novos.count > 0 && novos.pct_count > 30) {
    insights.push({
      icon: Target, color: '#a855f7',
      title: `${novos.count} clientes Novos (${novos.pct_count}% da base)`,
      desc: `Grande volume de clientes com poucas compras. Oportunidade de converter em recorrentes.`,
      action: 'Fluxo de boas-vindas, desconto na 2a compra e follow-up em 15 dias.'
    })
  }

  if (hibernando && hibernando.count > 0) {
    insights.push({
      icon: Warning, color: '#f97316',
      title: `${hibernando.count} clientes Hibernando (R$ ${(hibernando.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} parados)`,
      desc: `${hibernando.pct_count}% da base sem comprar ha muito tempo. Receita potencial perdida.`,
      action: 'Campanha de reativacao com oferta especial ou visita tecnica.'
    })
  }

  const emRiscoTotal = (risco?.count || 0) + (naoPodePerder?.count || 0)
  const emRiscoValor = (risco?.valor || 0) + (naoPodePerder?.valor || 0)
  if (emRiscoTotal > 0) {
    insights.push({
      icon: HandCoins, color: '#ef4444',
      title: `${emRiscoTotal} clientes de alto valor em risco (R$ ${emRiscoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`,
      desc: `Clientes que compravam frequentemente e pararam. Cada dia sem acao aumenta a chance de perder.`,
      action: 'ACAO IMEDIATA: Contato direto pelo gerente comercial.'
    })
  }

  if (precisam && precisam.count > 0) {
    insights.push({
      icon: Megaphone, color: '#eab308',
      title: `${precisam.count} clientes Precisam de Atencao`,
      desc: `Clientes no limite entre ficar ativos ou cair para hibernacao.`,
      action: 'Comunicacao personalizada, novos produtos e visita comercial.'
    })
  }

  if (resumo.recencia_media > 365) {
    insights.push({
      icon: Lightbulb, color: '#06b6d4',
      title: `Recencia media de ${resumo.recencia_media} dias — acima do ideal`,
      desc: `Para B2B saudavel, o ideal e manter abaixo de 180 dias.`,
      action: 'Revisar ciclo de compra, lembretes automaticos e ofertas periodicas.'
    })
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15 }}
      style={{
        background: 'linear-gradient(145deg, rgba(15, 22, 40, 0.9), rgba(12, 17, 32, 0.9))',
        backdropFilter: 'blur(20px)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.06)',
        padding: 28, position: 'relative', overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute', top: -1, left: '10%', right: '10%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(234, 179, 8, 0.3), transparent)'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'rgba(234, 179, 8, 0.1)',
          border: '1px solid rgba(234, 179, 8, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Lightbulb size={18} weight="bold" color="#eab308" />
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>
          Insights e Recomendacoes
        </h2>
        <span style={{
          fontSize: 11, fontWeight: 700, color: '#eab308',
          background: 'rgba(234, 179, 8, 0.1)',
          border: '1px solid rgba(234, 179, 8, 0.2)',
          padding: '3px 10px', borderRadius: 20, marginLeft: 'auto'
        }}>
          {insights.length} acoes
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {insights.map((insight, i) => {
          const Icon = insight.icon
          return (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              style={{
                background: 'rgba(6, 9, 18, 0.5)',
                borderRadius: 16,
                padding: '20px 24px',
                border: '1px solid rgba(255,255,255,0.04)',
                borderLeft: `3px solid ${insight.color}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: `${insight.color}10`,
                  border: `1px solid ${insight.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={18} weight="bold" color={insight.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: -0.2 }}>
                    {insight.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 10 }}>
                    {insight.desc}
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    fontSize: 12, fontWeight: 600, color: insight.color,
                    background: `${insight.color}08`,
                    padding: '8px 14px', borderRadius: 8,
                    border: `1px solid ${insight.color}12`
                  }}>
                    <ArrowRight size={12} weight="bold" />
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
