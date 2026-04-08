import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlass, CaretLeft, CaretRight, SortAscending, SortDescending } from '@phosphor-icons/react'

export default function AllClients({ clientes }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [sortCol, setSortCol] = useState('rfv_score')
  const [sortDir, setSortDir] = useState('desc')
  const perPage = 25

  const filtered = useMemo(() => {
    let data = clientes || []
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(c =>
        c.nome?.toLowerCase().includes(q) ||
        c.segmento?.toLowerCase().includes(q) ||
        c.rfv_code?.includes(q)
      )
    }
    data = [...data].sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol]
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return data
  }, [clientes, search, sortCol, sortDir])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice(page * perPage, (page + 1) * perPage)

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('desc') }
    setPage(0)
  }

  const columns = [
    { key: 'id', label: 'ID', w: 60 },
    { key: 'nome', label: 'Cliente', w: 240 },
    { key: 'data_ult_compra', label: 'Última Compra', w: 120 },
    { key: 'recencia_dias', label: 'Recência', w: 90, center: true },
    { key: 'frequencia', label: 'Pedidos', w: 80, center: true },
    { key: 'valor', label: 'Valor Total', w: 130 },
    { key: 'r_score', label: 'R', w: 45, center: true },
    { key: 'f_score', label: 'F', w: 45, center: true },
    { key: 'v_score', label: 'V', w: 45, center: true },
    { key: 'rfv_score', label: 'Score', w: 65, center: true },
    { key: 'rfv_code', label: 'RFV', w: 70, center: true },
    { key: 'segmento', label: 'Segmento', w: 140 }
  ]

  const scoreColor = (score) => {
    if (score >= 4) return '#22c55e'
    if (score === 3) return '#eab308'
    if (score === 2) return '#f97316'
    return '#ef4444'
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>
          Todos os Clientes
          <span style={{ fontSize: 13, fontWeight: 500, color: '#64748b', marginLeft: 10 }}>
            {filtered.length} encontrados
          </span>
        </h3>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(6, 9, 18, 0.8)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, padding: '8px 16px', transition: 'border-color 0.2s'
        }}>
          <MagnifyingGlass size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Buscar por nome, segmento ou código RFV..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: '#e2e8f0', fontSize: 13, width: 320, fontFamily: 'Inter'
            }}
          />
        </div>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(255,255,255,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{
                    background: 'rgba(15, 22, 40, 0.8)',
                    color: sortCol === col.key ? '#8b5cf6' : '#64748b',
                    padding: '12px 14px',
                    textAlign: col.center ? 'center' : 'left',
                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    cursor: 'pointer', userSelect: 'none',
                    minWidth: col.w, whiteSpace: 'nowrap',
                    transition: 'color 0.2s'
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    {sortCol === col.key && (
                      sortDir === 'asc' ?
                        <SortAscending size={12} weight="bold" /> :
                        <SortDescending size={12} weight="bold" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((c, i) => (
              <tr
                key={c.id || i}
                style={{ transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.02)', color: '#475569', fontWeight: 600, fontSize: 11 }}>
                  {c.id}
                </td>
                <td style={{
                  padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.02)',
                  fontWeight: 600, color: '#e2e8f0', maxWidth: 250,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  {c.nome}
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.02)', color: '#94a3b8' }}>
                  {c.data_ult_compra || '-'}
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.02)', textAlign: 'center', color: '#94a3b8' }}>
                  {c.recencia_dias < 9999 ? c.recencia_dias : '-'}
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.02)', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>
                  {c.frequencia}
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.02)', fontWeight: 700, color: '#22c55e' }}>
                  R$ {(c.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                {/* R F V scores with colored dots */}
                {['r_score', 'f_score', 'v_score'].map(key => (
                  <td key={key} style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.02)', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 26, height: 26, borderRadius: 8,
                      background: `${scoreColor(c[key])}15`,
                      color: scoreColor(c[key]),
                      fontWeight: 800, fontSize: 12
                    }}>
                      {c[key]}
                    </span>
                  </td>
                ))}
                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.02)', textAlign: 'center' }}>
                  <span style={{
                    fontWeight: 900, fontSize: 14,
                    color: c.rfv_score >= 12 ? '#22c55e' : c.rfv_score >= 9 ? '#eab308' : c.rfv_score >= 6 ? '#f97316' : '#ef4444'
                  }}>
                    {c.rfv_score}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.02)', textAlign: 'center' }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                    color: '#fff', padding: '3px 12px', borderRadius: 20,
                    fontWeight: 800, fontSize: 11,
                    boxShadow: '0 2px 6px rgba(139, 92, 246, 0.25)'
                  }}>{c.rfv_code}</span>
                </td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <span style={{
                    background: `${c.seg_color || '#475569'}15`,
                    color: c.seg_color || '#fff',
                    border: `1px solid ${c.seg_color || '#475569'}30`,
                    padding: '3px 12px', borderRadius: 20,
                    fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap'
                  }}>{c.segmento}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 20, fontSize: 13, color: '#64748b'
      }}>
        <span style={{ fontWeight: 500 }}>
          {page * perPage + 1} — {Math.min((page + 1) * perPage, filtered.length)} de {filtered.length}
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{
              background: 'rgba(15, 22, 40, 0.8)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10, padding: '8px 16px',
              color: page === 0 ? '#1e293b' : '#e2e8f0',
              cursor: page === 0 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 600, fontFamily: 'Inter'
            }}
          >
            <CaretLeft size={14} weight="bold" /> Anterior
          </motion.button>

          <div style={{
            padding: '8px 16px', background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#8b5cf6'
          }}>
            {page + 1} / {totalPages || 1}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            style={{
              background: 'rgba(15, 22, 40, 0.8)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10, padding: '8px 16px',
              color: page >= totalPages - 1 ? '#1e293b' : '#e2e8f0',
              cursor: page >= totalPages - 1 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 600, fontFamily: 'Inter'
            }}
          >
            Próximo <CaretRight size={14} weight="bold" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
