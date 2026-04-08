import Insights from '../Insights'

export default function InsightsPage({ data }) {
  if (!data) return null
  return <Insights resumo={data.resumo} segmentos={data.segmentos || []} clientes={data.clientes || []} />
}
