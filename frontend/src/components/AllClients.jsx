import { useState, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { tableStyles } from './tableStyles'

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
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('desc')
    }
    setPage(0)
  }

  const columns = [
    { key: 'id', label: 'ID', w: 60 },
    { key: 'nome', label: 'Cliente', w: 240 },
    { key: 'data_ult_compra', label: 'Última Compra', w: 120 },
    { key: 'recencia_dias', label: 'Recência', w: 90 },
    { key: 'frequencia', label: 'Pedidos', w: 80 },
    { key: 'valor', label: 'Valor Total', w: 130 },
    { key: 'r_score', label: 'R', w: 40 },
    { key: 'f_score', label: 'F', w: 40 },
    { key: 'v_score', label: 'V', w: 40 },
    { key: 'rfv_score', label: 'Score', w: 60 },
    { key: 'rfv_code', label: 'RFV', w: 70 },
    { key: 'segmento', label: 'Segmento', w: 130 }
  ]

  const sortArrow = (col) => sortCol === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>
          Todos os Clientes ({filtered.length})
        </h3>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#0a0e1a', border: '1px solid #1e2740',
          borderRadius: 8, padding: '6px 12px'
        }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Buscar por nome, segmento ou RFV..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: '#e2e8f0', fontSize: 13, width: 280
            }}
          />
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyles.table}>
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{
                    ...tableStyles.th,
                    cursor: 'pointer',
                    userSelect: 'none',
                    minWidth: col.w,
                    textAlign: ['r_score', 'f_score', 'v_score', 'rfv_score', 'frequencia', 'recencia_dias'].includes(col.key)
                      ? 'center' : 'left'
                  }}
                >
                  {col.label}{sortArrow(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((c, i) => (
              <tr key={c.id || i}>
                <td style={tableStyles.td}>{c.id}</td>
                <td style={{ ...tableStyles.td, fontWeight: 600, color: '#e2e8f0', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.nome}
                </td>
                <td style={tableStyles.td}>{c.data_ult_compra || '-'}</td>
                <td style={{ ...tableStyles.td, textAlign: 'center' }}>
                  {c.recencia_dias < 9999 ? c.recencia_dias : '-'}
                </td>
                <td style={{ ...tableStyles.td, textAlign: 'center' }}>{c.frequencia}</td>
                <td style={{ ...tableStyles.td, fontWeight: 600, color: '#22c55e' }}>
                  R$ {(c.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ ...tableStyles.td, textAlign: 'center', fontWeight: 700, color: '#f97316' }}>{c.r_score}</td>
                <td style={{ ...tableStyles.td, textAlign: 'center', fontWeight: 700, color: '#3b82f6' }}>{c.f_score}</td>
                <td style={{ ...tableStyles.td, textAlign: 'center', fontWeight: 700, color: '#22c55e' }}>{c.v_score}</td>
                <td style={{ ...tableStyles.td, textAlign: 'center', fontWeight: 800, color: '#fff' }}>{c.rfv_score}</td>
                <td style={{ ...tableStyles.td, textAlign: 'center' }}>
                  <span style={{
                    background: '#8b5cf6', color: '#fff',
                    padding: '2px 10px', borderRadius: 12,
                    fontWeight: 700, fontSize: 12
                  }}>{c.rfv_code}</span>
                </td>
                <td style={tableStyles.td}>
                  <span style={{
                    background: c.seg_color || '#475569', color: '#fff',
                    padding: '3px 10px', borderRadius: 12,
                    fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap'
                  }}>{c.segmento}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 16, fontSize: 13, color: '#64748b'
      }}>
        <span>
          Mostrando {page * perPage + 1} a {Math.min((page + 1) * perPage, filtered.length)} de {filtered.length}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{
              background: '#1a1f3a', border: '1px solid #1e2740',
              borderRadius: 6, padding: '6px 12px',
              color: page === 0 ? '#334155' : '#e2e8f0',
              cursor: page === 0 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 4
            }}
          >
            <ChevronLeft size={14} /> Anterior
          </button>
          <span style={{ padding: '6px 12px', color: '#94a3b8' }}>
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            style={{
              background: '#1a1f3a', border: '1px solid #1e2740',
              borderRadius: 6, padding: '6px 12px',
              color: page >= totalPages - 1 ? '#334155' : '#e2e8f0',
              cursor: page >= totalPages - 1 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 4
            }}
          >
            Próximo <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
