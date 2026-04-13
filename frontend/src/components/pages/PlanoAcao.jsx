import { ClipboardText } from '@phosphor-icons/react'
import WeeklyActionPlan from '../WeeklyActionPlan'

export default function PlanoAcao({ data }) {
  if (!data) return null

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <ClipboardText size={22} weight="bold" color="#1e3a5f" />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Plano de Ação da Semana</h2>
      </div>
      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>
        Ações priorizadas por valor e urgência — imprima e entregue ao comercial
      </p>
      <WeeklyActionPlan
        clientes={data.clientes || []}
        segmentos={data.segmentos || []}
        resumo={data.resumo}
      />
    </div>
  )
}
