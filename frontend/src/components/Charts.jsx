import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div style={{
      background: '#1a1f3a', border: '1px solid #2d3555',
      borderRadius: 8, padding: '10px 14px', fontSize: 13
    }}>
      <div style={{ fontWeight: 700, color: '#fff', marginBottom: 4 }}>{d.name || d.payload?.nome}</div>
      <div style={{ color: '#94a3b8' }}>{d.value?.toLocaleString('pt-BR')}</div>
    </div>
  )
}

const RADIAN = Math.PI / 180
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function Charts({ segmentos }) {
  if (!segmentos || segmentos.length === 0) return null

  const pieData = segmentos.map(s => ({ name: s.nome, value: s.count, color: s.color }))
  const barData = segmentos
    .filter(s => s.valor > 0)
    .sort((a, b) => b.valor - a.valor)
    .map(s => ({ nome: s.nome, valor: Math.round(s.valor), color: s.color }))

  const sectionStyle = {
    background: '#0f1629', borderRadius: 16,
    border: '1px solid #1e2740', padding: 24
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24,
      marginBottom: 24
    }}>
      {/* Pie */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
          Distribuição por Segmento
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%" cy="50%"
              innerRadius={60} outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
              label={renderLabel}
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="#0f1629" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 11 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
          Faturamento por Segmento
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis
              type="number"
              tickFormatter={v => `R$ ${(v / 1000).toFixed(0)}k`}
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: '#1e2740' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="nome"
              width={120}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={v => [`R$ ${v.toLocaleString('pt-BR')}`, 'Faturamento']}
              contentStyle={{ background: '#1a1f3a', border: '1px solid #2d3555', borderRadius: 8, fontSize: 13 }}
              labelStyle={{ color: '#fff', fontWeight: 700 }}
            />
            <Bar dataKey="valor" radius={[0, 6, 6, 0]} barSize={24}>
              {barData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
