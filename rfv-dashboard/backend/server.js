const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve o frontend
const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, '../frontend/dist');
app.use(express.static(fs.existsSync(publicDir) ? publicDir : distDir));

const API_TOKEN = 'nova-automacao-rfv-token-2026';

// Versão (diagnóstico)
app.get('/api/version', (req, res) => {
  res.json({ version: 'v3-login-html-2026-04-13' });
});

// Upload
app.post('/api/upload', (req, res) => {
  const token = req.headers.authorization;
  if (token !== `Bearer ${API_TOKEN}`) return res.status(401).json({ error: 'Token inválido' });
  const data = req.body;
  if (!data || !data.clientes) return res.status(400).json({ error: 'Dados inválidos' });
  const clienteId = data.cliente_id || 'default';
  data.received_at = new Date().toISOString();
  fs.writeFileSync(path.join(DATA_DIR, `${clienteId}.json`), JSON.stringify(data, null, 2), 'utf-8');
  console.log(`[UPLOAD] ${clienteId}: ${data.clientes.length} clientes`);
  res.json({ status: 'ok', message: `${data.clientes.length} clientes recebidos`, received_at: data.received_at });
});

// Listar empresas
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

// Dados empresa
app.get('/api/empresa/:id', (req, res) => {
  const fp = path.join(DATA_DIR, `${req.params.id}.json`);
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
    res.json({ message: 'Frontend não encontrado' });
  }
});

app.listen(PORT, () => {
  console.log('  Dashboard RFV - http://localhost:' + PORT);
});
