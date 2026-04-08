import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div style={{
      background: 'rgba(15, 22, 40, 0.95)', backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12, padding: '12px 16px', fontSize: 13,
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
    }}>
      <div style={{ fontWeight: 700, color: '#fff', marginBottom: 4, fontSize: 14 }}>
        {d.name || d.payload?.nome}
      </div>
      <div style={{ color: '#94a3b8' }}>
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
      fontSize={13} fontWeight={800} style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const sectionStyle = {
  background: 'linear-gradient(145deg, rgba(15, 22, 40, 0.9), rgba(12, 17, 32, 0.9))',
  backdropFilter: 'blur(20px)',
  borderRadius: 20,
  border: '1px solid rgba(255,255,255,0.06)',
  padding: 28,
  position: 'relative',
  overflow: 'hidden'
}

export default function Charts({ segmentos }) {
  if (!segmentos || segmentos.length === 0) return null

  const pieData = segmentos.map(s => ({ name: s.nome, value: s.count, color: s.color }))
  const barData = segmentos
    .filter(s => s.valor > 0)
    .sort((a, b) => b.valor - a.valor)
    .map(s => ({ nome: s.nome, valor: Math.round(s.valor), color: s.color }))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={sectionStyle}
      >
        <div style={{
          position: 'absolute', top: -1, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)'
        }} />
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 20, letterSpacing: -0.3 }}>
          Distribuição por Segmento
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%" cy="50%"
              innerRadius={70} outerRadius={120}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={renderLabel}
              animationBegin={400}
              animationDuration={1200}
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="rgba(6,9,18,0.8)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 500 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={sectionStyle}
      >
        <div style={{
          position: 'absolute', top: -1, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.3), transparent)'
        }} />
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 20, letterSpacing: -0.3 }}>
          Faturamento por Segmento
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
            <XAxis
              type="number"
              tickFormatter={v => v >= 1000000 ? `R$ ${(v/1000000).toFixed(1)}M` : `R$ ${(v/1000).toFixed(0)}k`}
              tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="nome"
              width={120}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={v => [`R$ ${v.toLocaleString('pt-BR')}`, 'Faturamento']}
              contentStyle={{
                background: 'rgba(15, 22, 40, 0.95)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 13
              }}
              labelStyle={{ color: '#fff', fontWeight: 700 }}
              cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }}
            />
            <Bar dataKey="valor" radius={[0, 8, 8, 0]} barSize={28} animationDuration={1500}>
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
