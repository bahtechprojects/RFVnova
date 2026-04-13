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

const USERS = {
  'admin@novaautomacao.com.br': 'Nova@2026!',
  'suporte@novaautomacao.com.br': 'Suporte@2026!'
};
const AUTH_SECRET = 'nova-rfv-auth-2026-secret';
const API_TOKEN = 'nova-automacao-rfv-token-2026';

const publicDir = path.join(__dirname, 'public');

// ---- Cookie helpers (sem libs externas) ----
function getCookie(req, name) {
  const header = req.headers.cookie || '';
  const match = header.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function makeToken(email) {
  const data = email + '|' + Date.now();
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('hex');
  return Buffer.from(data + '|' + sig).toString('base64');
}

function checkToken(token) {
  try {
    const str = Buffer.from(token, 'base64').toString();
    const i = str.lastIndexOf('|');
    if (i < 1) return false;
    const sig = crypto.createHmac('sha256', AUTH_SECRET).update(str.substring(0, i)).digest('hex');
    return sig === str.substring(i + 1);
  } catch { return false; }
}

function isAuth(req) {
  const t = getCookie(req, 'rfv_session');
  return t && checkToken(t);
}

// ---- Página de Login (HTML completo inline) ----
function loginPage(error) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta http-equiv="Cache-Control" content="no-cache,no-store,must-revalidate">
<title>Login - Nova Automação</title>
<link rel="icon" type="image/png" href="/logo-nova.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:#f1f5f9;color:#1e293b;min-height:100vh;display:flex;align-items:center;justify-content:center}
.c{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:48px 40px;width:100%;max-width:420px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.08)}
.logo{margin-bottom:12px}.logo img{max-width:200px}
.sub{color:#64748b;font-size:14px;margin-bottom:36px}.sub b{color:#3b82f6}
.f{margin-bottom:20px;text-align:left}
.f label{display:block;font-size:13px;color:#475569;margin-bottom:8px;font-weight:500}
.f input{width:100%;padding:12px 16px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;color:#1e293b;font-size:15px;outline:none;font-family:inherit}
.f input:focus{border-color:#3b82f6}
.f input::placeholder{color:#94a3b8}
.btn{width:100%;padding:14px;background:#3b82f6;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;margin-top:8px;font-family:inherit}
.btn:hover{background:#2563eb}
.err{background:#fef2f2;border:1px solid #fecaca;color:#dc2626;padding:10px 16px;border-radius:8px;font-size:13px;margin-bottom:20px}
.ft{margin-top:32px;font-size:12px;color:#94a3b8}
</style>
</head>
<body>
<div class="c">
<div class="logo"><img src="/logo-nova.png" alt="Nova Automação"></div>
<p class="sub">Painel de Segmentação <b>RFV</b></p>
${error ? '<div class="err">' + error + '</div>' : ''}
<form method="POST" action="/login">
<div class="f"><label>E-mail</label><input type="email" name="email" placeholder="seu@email.com.br" required autofocus></div>
<div class="f"><label>Senha</label><input type="password" name="password" placeholder="Digite sua senha" required></div>
<button class="btn">Entrar</button>
</form>
<p class="ft">Nova Automação &copy; 2026</p>
</div>
</body>
</html>`;
}

// ============================================================
// PRIMEIRA COISA: interceptar TUDO e checar auth
// ============================================================

// Diagnóstico - verifica se o novo código está rodando
app.get('/version', (req, res) => {
  res.json({ version: 'v2-login-2026-04-13', auth: isAuth(req), timestamp: new Date().toISOString() });
});

// Logo é público (precisa aparecer no login)
app.get('/logo-nova.png', (req, res) => {
  res.sendFile(path.join(publicDir, 'logo-nova.png'));
});

// Login GET
app.get('/login', (req, res) => {
  if (isAuth(req)) return res.redirect('/');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(loginPage(''));
});

// Login POST
app.post('/login', (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const pw = req.body.password || '';
  if (USERS[email] && USERS[email] === pw) {
    const token = makeToken(email);
    res.setHeader('Set-Cookie', 'rfv_session=' + encodeURIComponent(token) + '; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400');
    return res.redirect('/');
  }
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(loginPage('E-mail ou senha incorretos. Tente novamente.'));
});

// Logout
app.get('/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'rfv_session=; Path=/; HttpOnly; Max-Age=0');
  res.redirect('/login');
});

// Upload API (usa Bearer token, não cookie)
app.post('/api/upload', (req, res) => {
  const token = req.headers.authorization;
  if (token !== 'Bearer ' + API_TOKEN) return res.status(401).json({ error: 'Token inválido' });
  const data = req.body;
  if (!data || !data.clientes) return res.status(400).json({ error: 'Dados inválidos' });
  const clienteId = data.cliente_id || 'default';
  data.received_at = new Date().toISOString();
  fs.writeFileSync(path.join(DATA_DIR, clienteId + '.json'), JSON.stringify(data, null, 2), 'utf-8');
  console.log('[UPLOAD] ' + clienteId + ': ' + data.clientes.length + ' clientes');
  res.json({ status: 'ok', message: data.clientes.length + ' clientes recebidos', received_at: data.received_at });
});

// ============================================================
// BLOQUEIO: tudo daqui pra baixo exige cookie válido
// ============================================================
app.use((req, res, next) => {
  if (isAuth(req)) return next();
  if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'Não autenticado' });
  res.redirect('/login');
});

// Arquivos estáticos do frontend (protegidos)
app.use(express.static(publicDir));

// API dados
app.get('/api/empresas', (req, res) => {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  const empresas = files.map(f => {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf-8'));
      return { id: path.basename(f, '.json'), nome: d.empresa_nome || path.basename(f, '.json'), total_clientes: (d.clientes || []).length, atualizado: d.generated_at || d.received_at || null, total_valor: (d.resumo || {}).total_valor || 0, total_pedidos: (d.resumo || {}).total_pedidos || 0 };
    } catch { return null; }
  }).filter(Boolean);
  res.json(empresas);
});

app.get('/api/empresa/:id', (req, res) => {
  const fp = path.join(DATA_DIR, req.params.id + '.json');
  if (!fs.existsSync(fp)) return res.status(404).json({ error: 'Não encontrada' });
  res.json(JSON.parse(fs.readFileSync(fp, 'utf-8')));
});

// SPA fallback
app.get('*', (req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend não encontrado');
  }
});

app.listen(PORT, () => {
  console.log('========================================');
  console.log('  Dashboard RFV - Nova Automação');
  console.log('  http://localhost:' + PORT);
  console.log('========================================');
});
