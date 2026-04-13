import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    () => sessionStorage.getItem('rfv_logged_in') === 'true'
  )

  const handleLogout = () => {
    sessionStorage.clear()
    setLoggedIn(false)
  }

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard/nova-automacao" replace />} />
      <Route path="/dashboard/:empresaId" element={<Dashboard onLogout={handleLogout} />} />
    </Routes>
  )
}
