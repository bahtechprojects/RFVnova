import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: 10, padding: '10px 14px', fontSize: 13,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
    }}>
      <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
        {d.name || d.payload?.nome}
      </div>
      <div style={{ color: '#64748b' }}>
        {typeof d.value === 'number' ? d.value.toLocaleString('pt-BR') : d.value}
      </div>
    </div>
  )
}

const RADIAN = Math.PI / 180
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.04) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
      fontSize={13} fontWeight={800} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const sectionStyle = {
  background: '#fff',
  borderRadius: 16,
  border: '1px solid #e2e8f0',
  padding: 28
}

export default function Charts({ segmentos }) {
  if (!segmentos || segmentos.length === 0) return null

  const pieData = segmentos.map(s => ({ name: s.nome, value: s.count, color: s.color }))
  const barData = segmentos
    .filter(s => s.valor > 0)
    .sort((a, b) => b.valor - a.valor)
    .map(s => ({ nome: s.nome, valor: Math.round(s.valor), color: s.color }))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={sectionStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>
          Distribuição por Segmento
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={115}
              paddingAngle={3} dataKey="value" labelLine={false} label={renderLabel}>
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="#fff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" iconType="circle" iconSize={8}
              formatter={(value) => <span style={{ color: '#64748b', fontSize: 11, fontWeight: 500 }}>{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={sectionStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>
          Faturamento por Segmento
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
            <XAxis type="number"
              tickFormatter={v => v >= 1000000 ? `R$ ${(v/1000000).toFixed(1)}M` : `R$ ${(v/1000).toFixed(0)}k`}
              tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
            <YAxis type="category" dataKey="nome" width={120}
              tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={v => [`R$ ${v.toLocaleString('pt-BR')}`, 'Faturamento']}
              contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13 }}
              labelStyle={{ color: '#1e293b', fontWeight: 700 }}
              cursor={{ fill: 'rgba(30, 58, 95, 0.04)' }} />
            <Bar dataKey="valor" radius={[0, 6, 6, 0]} barSize={24}>
              {barData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
