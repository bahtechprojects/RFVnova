const express = require('express');
const cors = require('cors');
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

// ============================================================
// AUTENTICAÇÃO
// ============================================================
const USERS = {
  'admin@novaautomacao.com.br': 'Nova@2026!',
  'suporte@novaautomacao.com.br': 'Suporte@2026!'
};

const AUTH_SECRET = 'nova-rfv-auth-2026-secret';
const API_TOKEN = 'nova-automacao-rfv-token-2026';

// Parseia cookies do header (sem lib externa)
function parseCookies(req) {
  const header = req.headers.cookie || '';
  const cookies = {};
  header.split(';').forEach(c => {
    const parts = c.trim().split('=');
    if (parts.length >= 2) {
      cookies[parts[0].trim()] = decodeURIComponent(parts.slice(1).join('='));
    }
  });
  return cookies;
}

function generateToken(email) {
  const payload = email + '|' + Date.now();
  const hash = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(payload + '|' + hash).toString('base64');
}

function validateToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const lastPipe = decoded.lastIndexOf('|');
    if (lastPipe === -1) return false;
    const payload = decoded.substring(0, lastPipe);
    const hash = decoded.substring(lastPipe + 1);
    const expected = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
    return hash === expected;
  } catch {
    return false;
  }
}

function isLoggedIn(req) {
  const cookies = parseCookies(req);
  const token = cookies['rfv_session'];
  return token && validateToken(token);
}

function requireAuth(req, res, next) {
  if (isLoggedIn(req)) return next();
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  return res.redirect('/login');
}

// ============================================================
// PÁGINA DE LOGIN (HTML puro)
// ============================================================
const LOGIN_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <title>Login - Nova Automação</title>
  <link rel="icon" type="image/png" href="/logo-nova.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter',sans-serif;background:#f1f5f9;color:#1e293b;min-height:100vh;display:flex;align-items:center;justify-content:center}
    .card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:48px 40px;width:100%;max-width:420px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.08)}
    .logo{margin-bottom:12px}.logo img{max-width:200px;height:auto}
    .sub{color:#64748b;font-size:14px;margin-bottom:36px}.sub span{color:#3b82f6;font-weight:600}
    .fg{margin-bottom:20px;text-align:left}
    .fg label{display:block;font-size:13px;color:#475569;margin-bottom:8px;font-weight:500}
    .fg input{width:100%;padding:12px 16px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;color:#1e293b;font-size:15px;outline:none;font-family:inherit}
    .fg input:focus{border-color:#3b82f6}
    .fg input::placeholder{color:#94a3b8}
    .btn{width:100%;padding:14px;background:#3b82f6;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;margin-top:8px;font-family:inherit}
    .btn:hover{background:#2563eb}
    .err{background:#fef2f2;border:1px solid #fecaca;color:#dc2626;padding:10px 16px;border-radius:8px;font-size:13px;margin-bottom:20px}
    .ft{margin-top:32px;font-size:12px;color:#94a3b8}
  </style>
</head>
<body>
  <div class="card">
    <div class="logo"><img src="/logo-nova.png" alt="Nova Automação"></div>
    <p class="sub">Painel de Segmentação <span>RFV</span></p>
    {{ERROR}}
    <form method="POST" action="/login">
      <div class="fg"><label>E-mail</label><input type="email" name="email" placeholder="seu@email.com.br" required autofocus></div>
      <div class="fg"><label>Senha</label><input type="password" name="password" placeholder="Digite sua senha" required></div>
      <button type="submit" class="btn">Entrar</button>
    </form>
    <p class="ft">Nova Automação © 2026</p>
  </div>
</body>
</html>`;

// ============================================================
// ROTAS PÚBLICAS
// ============================================================

// Logo precisa ser público (aparece no login)
const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, '../frontend/dist');
const staticDir = fs.existsSync(publicDir) ? publicDir : distDir;
app.use('/logo-nova.png', express.static(path.join(staticDir, 'logo-nova.png')));

app.get('/login', (req, res) => {
  if (isLoggedIn(req)) return res.redirect('/');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(LOGIN_HTML.replace('{{ERROR}}', ''));
});

app.post('/login', (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  if (USERS[email] && USERS[email] === password) {
    const token = generateToken(email);
    res.setHeader('Set-Cookie',
      `rfv_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
    );
    return res.redirect('/');
  }

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(LOGIN_HTML.replace('{{ERROR}}',
    '<div class="err">E-mail ou senha incorretos. Tente novamente.</div>'
  ));
});

app.get('/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'rfv_session=; Path=/; HttpOnly; Max-Age=0');
  res.redirect('/login');
});

// Upload usa token próprio
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
  res.json({ status: 'ok', message: `${data.clientes.length} clientes recebidos`, received_at: data.received_at });
});

// ============================================================
// TUDO ABAIXO EXIGE LOGIN
// ============================================================
app.use(requireAuth);

app.use(express.static(staticDir));

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

app.get('/api/empresa/:id', (req, res) => {
  const filepath = path.join(DATA_DIR, `${req.params.id}.json`);
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'Empresa não encontrada' });
  }
  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  res.json(data);
});

// Fallback SPA
app.get('*', (req, res) => {
  const pubIndex = path.join(__dirname, 'public', 'index.html');
  const distIndex = path.join(__dirname, '../frontend/dist/index.html');
  const indexPath = fs.existsSync(pubIndex) ? pubIndex : distIndex;
  if (fs.existsSync(indexPath)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(indexPath);
  } else {
    res.json({ message: 'API rodando. Frontend não buildado.' });
  }
});

app.listen(PORT, () => {
  console.log('================================================');
  console.log('  Dashboard RFV - API Backend');
  console.log(`  http://localhost:${PORT}`);
  console.log('================================================');
});
