const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ============================================================
// AUTENTICAÇÃO - Servidor controla acesso
// ============================================================
const USERS = {
  'admin@novaautomacao.com.br': 'Nova@2026!',
  'suporte@novaautomacao.com.br': 'Suporte@2026!'
};

const AUTH_SECRET = 'nova-rfv-auth-2026-secret';
const API_TOKEN = 'nova-automacao-rfv-token-2026';

// Gera token de sessão assinado
function generateToken(email) {
  const payload = email + ':' + Date.now();
  const hash = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(payload + ':' + hash).toString('base64');
}

// Valida token de sessão
function validateToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const parts = decoded.split(':');
    if (parts.length < 3) return false;
    const hash = parts.pop();
    const payload = parts.join(':');
    const expected = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
    return hash === expected;
  } catch {
    return false;
  }
}

// Middleware: verifica se está logado
function requireAuth(req, res, next) {
  const token = req.cookies?.rfv_session;
  if (token && validateToken(token)) {
    return next();
  }
  // Se for requisição de API, retorna 401
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  // Senão, redireciona para login
  return res.redirect('/login');
}

// Página de login (HTML puro - não depende do React)
const LOGIN_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <title>Login - Nova Automação</title>
  <link rel="icon" type="image/png" href="/logo-nova.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #f1f5f9;
      color: #1e293b;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .login-container {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 48px 40px;
      width: 100%;
      max-width: 420px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.08);
    }
    .logo { margin-bottom: 12px; }
    .logo img { max-width: 200px; height: auto; }
    .subtitle { color: #64748b; font-size: 14px; margin-bottom: 36px; }
    .subtitle span { color: #3b82f6; font-weight: 600; }
    .form-group { margin-bottom: 20px; text-align: left; }
    .form-group label {
      display: block; font-size: 13px; color: #475569;
      margin-bottom: 8px; font-weight: 500;
    }
    .form-group input {
      width: 100%; padding: 12px 16px; background: #f8fafc;
      border: 1px solid #cbd5e1; border-radius: 8px; color: #1e293b;
      font-size: 15px; outline: none; transition: border-color 0.2s;
      font-family: inherit;
    }
    .form-group input:focus { border-color: #3b82f6; }
    .form-group input::placeholder { color: #94a3b8; }
    .btn-login {
      width: 100%; padding: 14px; background: #3b82f6; color: #fff;
      border: none; border-radius: 8px; font-size: 15px; font-weight: 600;
      cursor: pointer; transition: background 0.2s; margin-top: 8px;
      font-family: inherit;
    }
    .btn-login:hover { background: #2563eb; }
    .error-msg {
      background: #fef2f2; border: 1px solid #fecaca; color: #dc2626;
      padding: 10px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 20px;
    }
    .footer { margin-top: 32px; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="logo">
      <img src="/logo-nova.png" alt="Nova Automação">
    </div>
    <p class="subtitle">Painel de Segmentação <span>RFV</span></p>
    {{ERROR}}
    <form method="POST" action="/login">
      <div class="form-group">
        <label for="email">E-mail</label>
        <input type="email" id="email" name="email" placeholder="seu@email.com.br" required autofocus>
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input type="password" id="password" name="password" placeholder="Digite sua senha" required>
      </div>
      <button type="submit" class="btn-login">Entrar</button>
    </form>
    <p class="footer">Nova Automação &copy; 2026</p>
  </div>
</body>
</html>`;

// Arquivos estáticos públicos (logo, fontes, etc.)
const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, '../frontend/dist');
const staticDir = fs.existsSync(publicDir) ? publicDir : distDir;
app.use('/logo-nova.png', express.static(path.join(staticDir, 'logo-nova.png')));
app.use('/assets', express.static(path.join(staticDir, 'assets')));

// ============================================================
// ROTAS PÚBLICAS (sem autenticação)
// ============================================================

// GET /login - Exibe tela de login
app.get('/login', (req, res) => {
  const token = req.cookies?.rfv_session;
  if (token && validateToken(token)) {
    return res.redirect('/');
  }
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(LOGIN_HTML.replace('{{ERROR}}', ''));
});

// POST /login - Processa login
app.post('/login', (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  if (USERS[email] && USERS[email] === password) {
    const token = generateToken(email);
    res.cookie('rfv_session', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });
    return res.redirect('/');
  }

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(LOGIN_HTML.replace('{{ERROR}}',
    '<div class="error-msg">E-mail ou senha incorretos. Tente novamente.</div>'
  ));
});

// GET /logout - Encerra sessão
app.get('/logout', (req, res) => {
  res.clearCookie('rfv_session');
  res.redirect('/login');
});

// API de upload - usa token próprio (sem cookie)
app.post('/api/upload', (req, res) => {
  const token = req.headers.authorization;
  if (token !== `Bearer ${API_TOKEN}`) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  const data = req.body;
  if (!data || !data.clientes) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  const clienteId = data.cliente_id || 'default';
  data.received_at = new Date().toISOString();

  const filepath = path.join(DATA_DIR, `${clienteId}.json`);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`[UPLOAD] ${clienteId}: ${data.clientes.length} clientes recebidos`);

  res.json({
    status: 'ok',
    message: `${data.clientes.length} clientes recebidos`,
    received_at: data.received_at
  });
});

// ============================================================
// TUDO ABAIXO EXIGE LOGIN
// ============================================================
app.use(requireAuth);

// Serve o restante dos arquivos estáticos (protegido por login)
app.use(express.static(staticDir));

// API - Listar empresas
app.get('/api/empresas', (req, res) => {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  const empresas = files.map(f => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf-8'));
      return {
        id: path.basename(f, '.json'),
        nome: data.empresa_nome || path.basename(f, '.json'),
        total_clientes: data.clientes?.length || 0,
        atualizado: data.generated_at || data.received_at || null,
        total_valor: data.resumo?.total_valor || 0,
        total_pedidos: data.resumo?.total_pedidos || 0
      };
    } catch { return null; }
  }).filter(Boolean);
  res.json(empresas);
});

// API - Dados de uma empresa
app.get('/api/empresa/:id', (req, res) => {
  const filepath = path.join(DATA_DIR, `${req.params.id}.json`);
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'Empresa não encontrada' });
  }
  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  res.json(data);
});

// Fallback SPA - só chega aqui se logado
app.get('*', (req, res) => {
  const pubIndex = path.join(__dirname, 'public', 'index.html');
  const distIndex = path.join(__dirname, '../frontend/dist/index.html');
  const indexPath = fs.existsSync(pubIndex) ? pubIndex : distIndex;
  if (fs.existsSync(indexPath)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(indexPath);
  } else {
    res.json({ message: 'API RFV Dashboard rodando. Frontend não buildado ainda.' });
  }
});

app.listen(PORT, () => {
  console.log('================================================');
  console.log('  Dashboard RFV - API Backend');
  console.log(`  http://localhost:${PORT}`);
  console.log('================================================');
});
