const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');

// Criar pasta de dados se não existir
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve o frontend em produção
const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, '../frontend/dist');
app.use(express.static(fs.existsSync(publicDir) ? publicDir : distDir));

const API_TOKEN = 'nova-automacao-rfv-token-2026';

// ============================================================
// API - Receber dados do cliente
// ============================================================
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
// API - Listar empresas
// ============================================================
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

// ============================================================
// API - Dados de uma empresa
// ============================================================
app.get('/api/empresa/:id', (req, res) => {
  const filepath = path.join(DATA_DIR, `${req.params.id}.json`);
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'Empresa não encontrada' });
  }
  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  res.json(data);
});

// Fallback para SPA
app.get('*', (req, res) => {
  const pubIndex = path.join(__dirname, 'public', 'index.html');
  const distIndex = path.join(__dirname, '../frontend/dist/index.html');
  const indexPath = fs.existsSync(pubIndex) ? pubIndex : distIndex;
  if (fs.existsSync(indexPath)) {
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
