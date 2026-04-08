import HealthScore from '../HealthScore'

export default function Saude({ data }) {
  if (!data) return null
  return <HealthScore resumo={data.resumo} segmentos={data.segmentos} />
}
