import { useState } from 'react'

const USERS = {
  'admin@novaautomacao.com.br': 'Nova@2026!',
  'suporte@novaautomacao.com.br': 'Suporte@2026!'
}

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const emailLower = email.trim().toLowerCase()
    if (USERS[emailLower] && USERS[emailLower] === password) {
      sessionStorage.setItem('rfv_logged_in', 'true')
      sessionStorage.setItem('rfv_user', emailLower)
      onLogin()
    } else {
      setError('E-mail ou senha incorretos. Tente novamente.')
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <img src="/logo-nova.png" alt="Nova Automação" style={styles.logo} />
        </div>
        <p style={styles.subtitle}>
          Painel de Segmentação <span style={styles.accent}>RFV</span>
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com.br"
              required
              autoFocus
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>

        <p style={styles.footer}>Nova Automação &copy; 2026</p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f1f5f9',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '48px 40px',
    width: '100%',
    maxWidth: 420,
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
  },
  logoWrap: {
    marginBottom: 12,
  },
  logo: {
    maxWidth: 200,
    height: 'auto',
  },
  subtitle: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 36,
  },
  accent: {
    color: '#3b82f6',
    fontWeight: 600,
  },
  field: {
    marginBottom: 20,
    textAlign: 'left',
  },
  label: {
    display: 'block',
    fontSize: 13,
    color: '#475569',
    marginBottom: 8,
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    color: '#1e293b',
    fontSize: 15,
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: 14,
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
  },
  error: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '10px 16px',
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 20,
  },
  footer: {
    marginTop: 32,
    fontSize: 12,
    color: '#94a3b8',
  },
}
