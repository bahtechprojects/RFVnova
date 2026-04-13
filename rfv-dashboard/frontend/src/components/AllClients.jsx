import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlass, CaretLeft, CaretRight, SortAscending, SortDescending } from '@phosphor-icons/react'

export default function AllClients({ clientes }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [sortCol, setSortCol] = useState('rfv_score')
  const [sortDir, setSortDir] = useState('desc')
  const perPage = 25

  const getPrioridade = (c) => {
    const priority = (c.v_score || 0) * 2 + (5 - (c.r_score || 0))
    if (priority >= 8) return { label: 'Alta', color: '#dc2626', bg: '#fef2f2', sort: 3 }
    if (priority >= 5) return { label: 'Média', color: '#ca8a04', bg: '#fefce8', sort: 2 }
    return { label: 'Baixa', color: '#16a34a', bg: '#f0fdf4', sort: 1 }
  }

  const filtered = useMemo(() => {
    let data = clientes || []
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(c => c.nome?.toLowerCase().includes(q) || c.segmento?.toLowerCase().includes(q) || c.rfv_code?.includes(q))
    }
    data = [...data].sort((a, b) => {
      if (sortCol === 'prioridade') {
        const pa = (a.v_score || 0) * 2 + (5 - (a.r_score || 0))
        const pb = (b.v_score || 0) * 2 + (5 - (b.r_score || 0))
        return sortDir === 'asc' ? pa - pb : pb - pa
      }
      let va = a[sortCol], vb = b[sortCol]
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return data
  }, [clientes, search, sortCol, sortDir])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice(page * perPage, (page + 1) * perPage)
  const handleSort = (col) => { if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortCol(col); setSortDir('desc') }; setPage(0) }

  const columns = [
    { key: 'id', label: 'ID', w: 60 },
    { key: 'nome', label: 'Cliente', w: 220 },
    { key: 'data_ult_compra', label: 'Última Compra', w: 110 },
    { key: 'frequencia', label: 'Pedidos', w: 70, center: true },
    { key: 'valor', label: 'Valor Total', w: 120 },
    { key: 'rfv_score', label: 'Score', w: 60, center: true },
    { key: 'rfv_code', label: 'RFV', w: 65, center: true },
    { key: 'prioridade', label: 'Prioridade', w: 90, center: true },
    { key: 'segmento', label: 'Segmento', w: 130 }
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>
          Todos os Clientes <span style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8', marginLeft: 8 }}>{filtered.length}</span>
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '7px 14px' }}>
          <MagnifyingGlass size={16} color="#94a3b8" />
          <input type="text" placeholder="Buscar por nome, segmento ou RFV..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#1e293b', fontSize: 13, width: 280, fontFamily: 'Inter' }} />
        </div>
      </div>

      <div style={{ borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} onClick={() => handleSort(col.key)}
                  style={{ background: '#f8fafc', color: sortCol === col.key ? '#1e3a5f' : '#94a3b8', padding: '10px 12px', textAlign: col.center ? 'center' : 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', cursor: 'pointer', minWidth: col.w, whiteSpace: 'nowrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    {col.label}
                    {sortCol === col.key && (sortDir === 'asc' ? <SortAscending size={11} weight="bold" /> : <SortDescending size={11} weight="bold" />)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((c, i) => {
              const prio = getPrioridade(c)
              return (
                <tr key={c.id || i} style={{ transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontSize: 11 }}>{c.id}</td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', fontWeight: 600, color: '#1e293b', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nome}</td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', color: '#64748b' }}>{c.data_ult_compra || '-'}</td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', textAlign: 'center', color: '#64748b' }}>{c.frequencia}</td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, color: '#16a34a' }}>R$ {(c.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: c.rfv_score >= 12 ? '#16a34a' : c.rfv_score >= 9 ? '#ca8a04' : c.rfv_score >= 6 ? '#ea580c' : '#dc2626' }}>{c.rfv_score}</span>
                  </td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                    <span style={{ background: '#1e3a5f', color: '#fff', padding: '2px 10px', borderRadius: 14, fontWeight: 700, fontSize: 10 }}>{c.rfv_code}</span>
                  </td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                    <span style={{ background: prio.bg, color: prio.color, padding: '2px 8px', borderRadius: 14, fontSize: 10, fontWeight: 700 }}>{prio.label}</span>
                  </td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ background: `${c.seg_color || '#64748b'}12`, color: c.seg_color || '#64748b', padding: '2px 8px', borderRadius: 14, fontSize: 10, fontWeight: 700 }}>{c.segmento}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, fontSize: 12, color: '#94a3b8' }}>
        <span>{page * perPage + 1} — {Math.min((page + 1) * perPage, filtered.length)} de {filtered.length}</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 14px', color: page === 0 ? '#cbd5e1' : '#1e293b', cursor: page === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, fontFamily: 'Inter' }}>
            <CaretLeft size={12} weight="bold" /> Anterior
          </button>
          <div style={{ padding: '6px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#1e3a5f' }}>
            {page + 1} / {totalPages || 1}
          </div>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 14px', color: page >= totalPages - 1 ? '#cbd5e1' : '#1e293b', cursor: page >= totalPages - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, fontFamily: 'Inter' }}>
            Próximo <CaretRight size={12} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  )
}
