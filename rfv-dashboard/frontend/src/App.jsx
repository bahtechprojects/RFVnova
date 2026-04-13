import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard/nova-automacao" replace />} />
      <Route path="/dashboard/:empresaId" element={<Dashboard />} />
    </Routes>
  )
}
