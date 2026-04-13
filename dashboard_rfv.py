"""
Dashboard RFV - Nova Automação
Conecta no PostgreSQL (ResultMais), calcula RFV e gera dashboard HTML.
Pode ser agendado no Task Scheduler do Windows.
"""
import sys
import subprocess
import os
from datetime import datetime, date
from pathlib import Path

# Instalar dependências se necessário
REQUIRED = ["psycopg2-binary"]
for pkg in REQUIRED:
    try:
        __import__(pkg.replace("-binary", "").replace("-", "_"))
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", pkg])

import psycopg2

# ============================================================
# CONFIGURAÇÕES
# ============================================================
DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "database": "rmbancodados",
    "user": "bahtech",
    "password": "@1234"
}

# Caminho onde o dashboard HTML será salvo
OUTPUT_DIR = Path(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_FILE = OUTPUT_DIR / "dashboard_rfv.html"

# ============================================================
# BUSCAR DADOS
# ============================================================
def fetch_data():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("""
        SELECT id_cliente, nome_cliente, data_ult_compra, qtd_pedidos, valor_total
        FROM public.clientes_bahtech
        WHERE qtd_pedidos > 0 OR valor_total > 0 OR data_ult_compra IS NOT NULL
        ORDER BY valor_total DESC;
    """)
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]

    # Buscar total geral para contexto
    cur.execute("SELECT COUNT(*) FROM public.clientes_bahtech;")
    total_clientes = cur.fetchone()[0]

    cur.close()
    conn.close()
    return rows, columns, total_clientes

# ============================================================
# CALCULAR RFV
# ============================================================
def calc_rfv(rows):
    today = date.today()
    clientes = []

    for row in rows:
        id_cli, nome, data_ult, qtd_ped, valor = row
        # Recência em dias (se nunca comprou, assume valor alto)
        if data_ult:
            recencia_dias = (today - data_ult).days
        else:
            recencia_dias = 9999

        qtd_ped = int(qtd_ped) if qtd_ped else 0
        valor = float(valor) if valor else 0.0

        clientes.append({
            "id": id_cli,
            "nome": nome or "SEM NOME",
            "data_ult_compra": str(data_ult) if data_ult else "Nunca",
            "recencia_dias": recencia_dias,
            "frequencia": qtd_ped,
            "valor": valor
        })

    if not clientes:
        return []

    # Calcular scores usando quintis (1-5)
    # Recência: menor = melhor (score 5)
    # Frequência: maior = melhor (score 5)
    # Valor: maior = melhor (score 5)

    def assign_score(values, reverse=False):
        sorted_vals = sorted(set(values))
        n = len(sorted_vals)
        if n == 0:
            return [1] * len(values)

        scores = []
        for v in values:
            if n <= 5:
                rank = sorted_vals.index(v)
                score = int((rank / max(n - 1, 1)) * 4) + 1
            else:
                rank = sorted_vals.index(v)
                pct = rank / (n - 1) if n > 1 else 0
                score = min(int(pct * 5) + 1, 5)

            if reverse:
                score = 6 - score
            scores.append(score)
        return scores

    recencias = [c["recencia_dias"] for c in clientes]
    frequencias = [c["frequencia"] for c in clientes]
    valores = [c["valor"] for c in clientes]

    r_scores = assign_score(recencias, reverse=True)  # menor dias = score maior
    f_scores = assign_score(frequencias, reverse=False)  # mais pedidos = score maior
    v_scores = assign_score(valores, reverse=False)  # mais valor = score maior

    for i, c in enumerate(clientes):
        c["r_score"] = r_scores[i]
        c["f_score"] = f_scores[i]
        c["v_score"] = v_scores[i]
        c["rfv_score"] = r_scores[i] + f_scores[i] + v_scores[i]
        c["rfv_code"] = f"{r_scores[i]}{f_scores[i]}{v_scores[i]}"

        # Segmentação
        r, f, v = r_scores[i], f_scores[i], v_scores[i]
        if r >= 4 and f >= 4 and v >= 4:
            c["segmento"] = "Campeões"
            c["seg_color"] = "#22c55e"
            c["seg_icon"] = "🏆"
        elif r >= 4 and f >= 3:
            c["segmento"] = "Leais"
            c["seg_color"] = "#3b82f6"
            c["seg_icon"] = "💎"
        elif r >= 4 and f <= 2:
            c["segmento"] = "Novos"
            c["seg_color"] = "#a855f7"
            c["seg_icon"] = "🆕"
        elif r >= 3 and f >= 3 and v >= 3:
            c["segmento"] = "Potenciais Leais"
            c["seg_color"] = "#06b6d4"
            c["seg_icon"] = "⭐"
        elif r <= 2 and f >= 3 and v >= 3:
            c["segmento"] = "Em Risco"
            c["seg_color"] = "#f97316"
            c["seg_icon"] = "⚠️"
        elif r <= 2 and f >= 4:
            c["segmento"] = "Não Pode Perder"
            c["seg_color"] = "#ef4444"
            c["seg_icon"] = "🚨"
        elif r <= 2 and f <= 2:
            c["segmento"] = "Hibernando"
            c["seg_color"] = "#6b7280"
            c["seg_icon"] = "😴"
        elif r == 3:
            c["segmento"] = "Precisam Atenção"
            c["seg_color"] = "#eab308"
            c["seg_icon"] = "👀"
        else:
            c["segmento"] = "Outros"
            c["seg_color"] = "#9ca3af"
            c["seg_icon"] = "📋"

    return clientes

# ============================================================
# GERAR HTML
# ============================================================
def generate_html(clientes, total_clientes_db):
    now = datetime.now().strftime("%d/%m/%Y %H:%M")
    ativos = len(clientes)
    inativos = total_clientes_db - ativos

    # Estatísticas por segmento
    segmentos = {}
    for c in clientes:
        seg = c["segmento"]
        if seg not in segmentos:
            segmentos[seg] = {"count": 0, "valor": 0, "color": c["seg_color"], "icon": c["seg_icon"]}
        segmentos[seg]["count"] += 1
        segmentos[seg]["valor"] += c["valor"]

    # Totais
    total_valor = sum(c["valor"] for c in clientes)
    total_pedidos = sum(c["frequencia"] for c in clientes)
    media_recencia = sum(c["recencia_dias"] for c in clientes if c["recencia_dias"] < 9999) / max(len([c for c in clientes if c["recencia_dias"] < 9999]), 1)

    # Top 20 clientes por valor
    top_valor = sorted(clientes, key=lambda x: x["valor"], reverse=True)[:20]

    # Clientes em risco (alto valor mas recência alta)
    em_risco = sorted(
        [c for c in clientes if c["segmento"] in ("Em Risco", "Não Pode Perder")],
        key=lambda x: x["valor"], reverse=True
    )[:20]

    # Dados para gráfico de segmentos (JSON)
    seg_labels = []
    seg_counts = []
    seg_colors = []
    seg_valores = []
    for seg_name in ["Campeões", "Leais", "Potenciais Leais", "Novos", "Precisam Atenção", "Em Risco", "Não Pode Perder", "Hibernando", "Outros"]:
        if seg_name in segmentos:
            seg_labels.append(seg_name)
            seg_counts.append(segmentos[seg_name]["count"])
            seg_colors.append(segmentos[seg_name]["color"])
            seg_valores.append(round(segmentos[seg_name]["valor"], 2))

    # Dados para scatter plot RxF
    scatter_data = []
    for c in sorted(clientes, key=lambda x: x["valor"], reverse=True)[:200]:
        scatter_data.append({
            "x": c["r_score"],
            "y": c["f_score"],
            "r": max(3, min(20, c["valor"] / max(total_valor, 1) * 1000)),
            "nome": c["nome"][:30],
            "seg": c["segmento"],
            "color": c["seg_color"]
        })

    # Tabela de todos os clientes (JSON para DataTable)
    all_clients_json = []
    for c in clientes:
        all_clients_json.append([
            c["id"],
            c["nome"],
            c["data_ult_compra"],
            c["recencia_dias"] if c["recencia_dias"] < 9999 else "-",
            c["frequencia"],
            f'{c["valor"]:,.2f}'.replace(",", "X").replace(".", ",").replace("X", "."),
            c["r_score"],
            c["f_score"],
            c["v_score"],
            c["rfv_score"],
            c["rfv_code"],
            c["segmento"]
        ])

    import json
    clients_json_str = json.dumps(all_clients_json, ensure_ascii=False)
    scatter_json_str = json.dumps(scatter_data, ensure_ascii=False)

    # Gerar cards de segmentos
    seg_cards_html = ""
    for seg_name in ["Campeões", "Leais", "Potenciais Leais", "Novos", "Precisam Atenção", "Em Risco", "Não Pode Perder", "Hibernando", "Outros"]:
        if seg_name in segmentos:
            s = segmentos[seg_name]
            pct = (s["count"] / ativos * 100) if ativos > 0 else 0
            pct_val = (s["valor"] / total_valor * 100) if total_valor > 0 else 0
            seg_cards_html += f'''
            <div class="seg-card" style="border-left: 4px solid {s['color']}">
                <div class="seg-header">
                    <span class="seg-icon">{s['icon']}</span>
                    <span class="seg-name">{seg_name}</span>
                </div>
                <div class="seg-stats">
                    <div class="seg-stat">
                        <span class="seg-num">{s['count']}</span>
                        <span class="seg-label">clientes ({pct:.1f}%)</span>
                    </div>
                    <div class="seg-stat">
                        <span class="seg-num">R$ {s['valor']:,.2f}</span>
                        <span class="seg-label">faturamento ({pct_val:.1f}%)</span>
                    </div>
                </div>
            </div>'''

    # Top clientes rows
    top_rows_html = ""
    for i, c in enumerate(top_valor):
        top_rows_html += f'''
        <tr>
            <td>{i+1}</td>
            <td>{c['nome']}</td>
            <td>{c['data_ult_compra']}</td>
            <td>{c['frequencia']}</td>
            <td>R$ {c['valor']:,.2f}</td>
            <td><span class="rfv-badge">{c['rfv_code']}</span></td>
            <td><span class="seg-tag" style="background:{c['seg_color']}">{c['segmento']}</span></td>
        </tr>'''

    # Em risco rows
    risco_rows_html = ""
    for c in em_risco:
        risco_rows_html += f'''
        <tr>
            <td>{c['nome']}</td>
            <td>{c['data_ult_compra']}</td>
            <td>{c['recencia_dias']} dias</td>
            <td>{c['frequencia']}</td>
            <td>R$ {c['valor']:,.2f}</td>
            <td><span class="seg-tag" style="background:{c['seg_color']}">{c['segmento']}</span></td>
        </tr>'''

    html = f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard RFV - Nova Automação</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            min-height: 100vh;
        }}
        .header {{
            background: linear-gradient(135deg, #1e293b, #334155);
            padding: 20px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #3b82f6;
        }}
        .header h1 {{
            font-size: 24px;
            color: #fff;
        }}
        .header h1 span {{ color: #3b82f6; }}
        .header .meta {{
            text-align: right;
            font-size: 13px;
            color: #94a3b8;
        }}
        .container {{ max-width: 1400px; margin: 0 auto; padding: 20px; }}

        /* KPI Cards */
        .kpi-row {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }}
        .kpi-card {{
            background: #1e293b;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            border: 1px solid #334155;
        }}
        .kpi-card .kpi-value {{
            font-size: 28px;
            font-weight: 700;
            color: #fff;
            margin: 8px 0 4px;
        }}
        .kpi-card .kpi-label {{
            font-size: 13px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        .kpi-card.blue .kpi-value {{ color: #3b82f6; }}
        .kpi-card.green .kpi-value {{ color: #22c55e; }}
        .kpi-card.yellow .kpi-value {{ color: #eab308; }}
        .kpi-card.red .kpi-value {{ color: #ef4444; }}
        .kpi-card.purple .kpi-value {{ color: #a855f7; }}

        /* Section */
        .section {{
            background: #1e293b;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            border: 1px solid #334155;
        }}
        .section h2 {{
            font-size: 18px;
            margin-bottom: 16px;
            color: #fff;
            border-bottom: 1px solid #334155;
            padding-bottom: 10px;
        }}

        /* Segment Cards */
        .seg-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 12px;
        }}
        .seg-card {{
            background: #0f172a;
            border-radius: 8px;
            padding: 16px;
        }}
        .seg-header {{
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
        }}
        .seg-icon {{ font-size: 20px; }}
        .seg-name {{ font-weight: 600; font-size: 15px; }}
        .seg-stats {{ display: flex; gap: 20px; }}
        .seg-stat {{ display: flex; flex-direction: column; }}
        .seg-num {{ font-weight: 700; font-size: 16px; color: #fff; }}
        .seg-label {{ font-size: 11px; color: #94a3b8; }}

        /* Charts */
        .charts-row {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-bottom: 24px;
        }}
        @media (max-width: 900px) {{
            .charts-row {{ grid-template-columns: 1fr; }}
        }}

        /* Tables */
        table {{ width: 100%; border-collapse: collapse; }}
        th {{
            background: #334155;
            color: #e2e8f0;
            padding: 10px 12px;
            text-align: left;
            font-size: 13px;
            font-weight: 600;
        }}
        td {{
            padding: 8px 12px;
            border-bottom: 1px solid #1e293b;
            font-size: 13px;
        }}
        tr:hover {{ background: #1e293b; }}
        .rfv-badge {{
            background: #3b82f6;
            color: #fff;
            padding: 2px 10px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 13px;
        }}
        .seg-tag {{
            color: #fff;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
        }}

        /* DataTables override */
        .dataTables_wrapper {{ color: #e2e8f0; }}
        .dataTables_filter input {{
            background: #0f172a;
            border: 1px solid #475569;
            color: #e2e8f0;
            padding: 6px 12px;
            border-radius: 6px;
        }}
        .dataTables_length select {{
            background: #0f172a;
            border: 1px solid #475569;
            color: #e2e8f0;
            padding: 4px;
            border-radius: 4px;
        }}
        .dataTables_info, .dataTables_length label, .dataTables_filter label {{
            color: #94a3b8 !important;
            font-size: 13px;
        }}
        .dataTables_paginate .paginate_button {{
            color: #e2e8f0 !important;
            border: 1px solid #475569 !important;
            background: #1e293b !important;
            border-radius: 4px;
            margin: 0 2px;
        }}
        .dataTables_paginate .paginate_button.current {{
            background: #3b82f6 !important;
            color: #fff !important;
            border-color: #3b82f6 !important;
        }}
        .dataTables_paginate .paginate_button:hover {{
            background: #334155 !important;
            color: #fff !important;
        }}

        /* Legenda RFV */
        .rfv-legend {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 10px;
            margin-top: 12px;
            padding: 16px;
            background: #0f172a;
            border-radius: 8px;
        }}
        .rfv-legend-item {{
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
        }}
        .rfv-legend-dot {{
            width: 12px;
            height: 12px;
            border-radius: 50%;
            flex-shrink: 0;
        }}

        .tab-bar {{
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
        }}
        .tab-btn {{
            background: #334155;
            color: #94a3b8;
            border: none;
            padding: 8px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s;
        }}
        .tab-btn.active {{
            background: #3b82f6;
            color: #fff;
        }}
        .tab-content {{ display: none; }}
        .tab-content.active {{ display: block; }}

        .print-btn {{
            background: #3b82f6;
            color: #fff;
            border: none;
            padding: 8px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
        }}
        .print-btn:hover {{ background: #2563eb; }}

        @media print {{
            body {{ background: #fff; color: #000; }}
            .header {{ background: #f1f5f9; border-color: #3b82f6; }}
            .section, .kpi-card {{ background: #fff; border-color: #e2e8f0; }}
            .seg-card {{ background: #f8fafc; }}
            th {{ background: #e2e8f0; color: #000; }}
            .no-print {{ display: none; }}
        }}
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>Dashboard <span>RFV</span></h1>
            <div style="font-size:13px;color:#64748b;margin-top:4px;">Nova Automação Comercial de Equipamentos Industriais</div>
        </div>
        <div class="meta">
            <div>Atualizado em: {now}</div>
            <div style="margin-top:8px;">
                <button class="print-btn no-print" onclick="window.print()">Imprimir / PDF</button>
            </div>
        </div>
    </div>

    <div class="container">
        <!-- KPIs -->
        <div class="kpi-row">
            <div class="kpi-card blue">
                <div class="kpi-label">Clientes Ativos</div>
                <div class="kpi-value">{ativos:,}</div>
                <div class="kpi-label">de {total_clientes_db:,} cadastrados</div>
            </div>
            <div class="kpi-card green">
                <div class="kpi-label">Faturamento Total</div>
                <div class="kpi-value">R$ {total_valor:,.2f}</div>
            </div>
            <div class="kpi-card purple">
                <div class="kpi-label">Total de Pedidos</div>
                <div class="kpi-value">{total_pedidos:,}</div>
            </div>
            <div class="kpi-card yellow">
                <div class="kpi-label">Recência Média</div>
                <div class="kpi-value">{media_recencia:.0f} dias</div>
            </div>
            <div class="kpi-card red">
                <div class="kpi-label">Clientes Inativos</div>
                <div class="kpi-value">{inativos:,}</div>
                <div class="kpi-label">sem compras registradas</div>
            </div>
        </div>

        <!-- Segmentos -->
        <div class="section">
            <h2>Segmentação de Clientes</h2>
            <div class="seg-grid">
                {seg_cards_html}
            </div>
            <div class="rfv-legend" style="margin-top:16px;">
                <div class="rfv-legend-item"><div class="rfv-legend-dot" style="background:#22c55e"></div><b>Campeões</b> — Compram recente, frequente e alto valor</div>
                <div class="rfv-legend-item"><div class="rfv-legend-dot" style="background:#3b82f6"></div><b>Leais</b> — Compram recente e com boa frequência</div>
                <div class="rfv-legend-item"><div class="rfv-legend-dot" style="background:#06b6d4"></div><b>Potenciais Leais</b> — Bons em R, F e V mas não no topo</div>
                <div class="rfv-legend-item"><div class="rfv-legend-dot" style="background:#a855f7"></div><b>Novos</b> — Compraram recente mas poucas vezes</div>
                <div class="rfv-legend-item"><div class="rfv-legend-dot" style="background:#eab308"></div><b>Precisam Atenção</b> — Recência mediana, podem evadir</div>
                <div class="rfv-legend-item"><div class="rfv-legend-dot" style="background:#f97316"></div><b>Em Risco</b> — Bons clientes que sumiram</div>
                <div class="rfv-legend-item"><div class="rfv-legend-dot" style="background:#ef4444"></div><b>Não Pode Perder</b> — Alta frequência mas recência ruim</div>
                <div class="rfv-legend-item"><div class="rfv-legend-dot" style="background:#6b7280"></div><b>Hibernando</b> — Sem compras há muito tempo</div>
            </div>
        </div>

        <!-- Gráficos -->
        <div class="charts-row">
            <div class="section">
                <h2>Distribuição por Segmento</h2>
                <canvas id="chartSegmentos" height="300"></canvas>
            </div>
            <div class="section">
                <h2>Faturamento por Segmento</h2>
                <canvas id="chartValor" height="300"></canvas>
            </div>
        </div>

        <!-- Tabs -->
        <div class="section">
            <div class="tab-bar no-print">
                <button class="tab-btn active" onclick="switchTab('top')">Top 20 Clientes</button>
                <button class="tab-btn" onclick="switchTab('risco')">Clientes em Risco</button>
                <button class="tab-btn" onclick="switchTab('todos')">Todos os Clientes</button>
            </div>

            <!-- Top 20 -->
            <div id="tab-top" class="tab-content active">
                <h2>Top 20 Clientes por Valor</h2>
                <table>
                    <thead>
                        <tr><th>#</th><th>Cliente</th><th>Última Compra</th><th>Pedidos</th><th>Valor Total</th><th>RFV</th><th>Segmento</th></tr>
                    </thead>
                    <tbody>{top_rows_html}</tbody>
                </table>
            </div>

            <!-- Em Risco -->
            <div id="tab-risco" class="tab-content">
                <h2>Clientes em Risco (Alto Valor + Recência Ruim)</h2>
                {"<p style='color:#94a3b8;'>Nenhum cliente em risco identificado.</p>" if not em_risco else ""}
                <table>
                    <thead>
                        <tr><th>Cliente</th><th>Última Compra</th><th>Recência</th><th>Pedidos</th><th>Valor Total</th><th>Segmento</th></tr>
                    </thead>
                    <tbody>{risco_rows_html}</tbody>
                </table>
            </div>

            <!-- Todos -->
            <div id="tab-todos" class="tab-content">
                <h2>Todos os Clientes</h2>
                <table id="tabelaCompleta" class="display" style="width:100%">
                    <thead>
                        <tr>
                            <th>ID</th><th>Cliente</th><th>Última Compra</th><th>Recência (dias)</th>
                            <th>Pedidos</th><th>Valor Total</th><th>R</th><th>F</th><th>V</th>
                            <th>Score</th><th>RFV</th><th>Segmento</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>

        <!-- Legenda metodológica -->
        <div class="section" style="font-size:13px;color:#94a3b8;">
            <h2>Metodologia RFV</h2>
            <p style="margin-bottom:8px;">Cada cliente recebe um score de 1 a 5 em cada dimensão (quintis):</p>
            <ul style="margin-left:20px;line-height:2;">
                <li><b>R (Recência)</b> — Dias desde a última compra. Menor = melhor (score 5).</li>
                <li><b>F (Frequência)</b> — Quantidade de pedidos. Maior = melhor (score 5).</li>
                <li><b>V (Valor)</b> — Valor total de compras. Maior = melhor (score 5).</li>
            </ul>
            <p style="margin-top:8px;">Score total varia de 3 (pior) a 15 (melhor). A segmentação combina os 3 scores para classificar cada cliente.</p>
        </div>
    </div>

    <script>
        // Tab switching
        function switchTab(tab) {{
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
            document.getElementById('tab-' + tab).classList.add('active');
            event.target.classList.add('active');

            if (tab === 'todos' && !window.dtInitialized) {{
                initDataTable();
                window.dtInitialized = true;
            }}
        }}

        // DataTable
        const clientsData = {clients_json_str};
        function initDataTable() {{
            $('#tabelaCompleta').DataTable({{
                data: clientsData,
                language: {{
                    search: "Buscar:",
                    lengthMenu: "Mostrar _MENU_ por página",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ clientes",
                    paginate: {{ first: "Primeiro", last: "Último", next: "Próximo", previous: "Anterior" }},
                    zeroRecords: "Nenhum cliente encontrado"
                }},
                pageLength: 25,
                order: [[9, 'desc']],
                columnDefs: [
                    {{ targets: [6,7,8,9], className: 'dt-center' }}
                ]
            }});
        }}

        // Charts
        const segLabels = {json.dumps(seg_labels, ensure_ascii=False)};
        const segCounts = {json.dumps(seg_counts)};
        const segColors = {json.dumps(seg_colors)};
        const segValores = {json.dumps(seg_valores)};

        // Pie chart - Quantidade
        new Chart(document.getElementById('chartSegmentos'), {{
            type: 'doughnut',
            data: {{
                labels: segLabels,
                datasets: [{{
                    data: segCounts,
                    backgroundColor: segColors,
                    borderColor: '#1e293b',
                    borderWidth: 2
                }}]
            }},
            options: {{
                responsive: true,
                plugins: {{
                    legend: {{
                        position: 'bottom',
                        labels: {{ color: '#e2e8f0', padding: 12, font: {{ size: 12 }} }}
                    }}
                }}
            }}
        }});

        // Bar chart - Valor
        new Chart(document.getElementById('chartValor'), {{
            type: 'bar',
            data: {{
                labels: segLabels,
                datasets: [{{
                    label: 'Faturamento (R$)',
                    data: segValores,
                    backgroundColor: segColors,
                    borderRadius: 6
                }}]
            }},
            options: {{
                responsive: true,
                indexAxis: 'y',
                plugins: {{
                    legend: {{ display: false }}
                }},
                scales: {{
                    x: {{
                        ticks: {{
                            color: '#94a3b8',
                            callback: function(v) {{ return 'R$ ' + v.toLocaleString('pt-BR'); }}
                        }},
                        grid: {{ color: '#334155' }}
                    }},
                    y: {{
                        ticks: {{ color: '#e2e8f0', font: {{ size: 11 }} }},
                        grid: {{ display: false }}
                    }}
                }}
            }}
        }});
    </script>
</body>
</html>'''

    return html

# ============================================================
# MAIN
# ============================================================
def main():
    print("=" * 50)
    print("  DASHBOARD RFV - Nova Automação")
    print("=" * 50)

    print("\n[1/3] Conectando ao banco de dados...")
    try:
        rows, columns, total_clientes = fetch_data()
        print(f"      {len(rows)} clientes com movimentação encontrados")
        print(f"      {total_clientes} clientes totais no banco")
    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        input("\nPressione Enter para sair...")
        return

    print("[2/3] Calculando RFV...")
    clientes = calc_rfv(rows)
    print(f"      {len(clientes)} clientes classificados")

    # Resumo por segmento
    segs = {}
    for c in clientes:
        segs[c["segmento"]] = segs.get(c["segmento"], 0) + 1
    for seg, count in sorted(segs.items(), key=lambda x: -x[1]):
        print(f"      {seg}: {count}")

    print("[3/3] Gerando dashboard HTML...")
    html = generate_html(clientes, total_clientes)
    OUTPUT_FILE.write_text(html, encoding="utf-8")
    print(f"      Salvo em: {OUTPUT_FILE}")

    # Abrir no navegador
    import webbrowser
    webbrowser.open(str(OUTPUT_FILE))
    print("\n✅ Dashboard aberto no navegador!")
    print("=" * 50)

if __name__ == "__main__":
    main()
