"""
Sync RFV - Roda na máquina do cliente (agendado via Task Scheduler).
Conecta no PostgreSQL local, calcula RFV e envia para o WebApp.
"""
import sys
import subprocess
import json
from datetime import datetime, date

# Instalar dependências
for pkg in ["psycopg2-binary", "requests"]:
    try:
        __import__(pkg.replace("-binary", "").replace("-", "_"))
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", pkg])

import psycopg2
import requests

# ============================================================
# CONFIGURAÇÕES - AJUSTAR CONFORME NECESSÁRIO
# ============================================================
DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "database": "rmbancodados",
    "user": "bahtech",
    "password": "@1234"
}

# URL do WebApp (ajustar para o IP/domínio da sua máquina)
WEBAPP_URL = "http://rfv.bahflash.tech/api/upload"
API_TOKEN = "nova-automacao-rfv-token-2026"

# Identificador único desta empresa
EMPRESA_ID = "nova-automacao"
EMPRESA_NOME = "Nova Automação Comercial de Equipamentos Industriais"


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

    cur.execute("SELECT COUNT(*) FROM public.clientes_bahtech;")
    total = cur.fetchone()[0]

    cur.close()
    conn.close()
    return rows, total


# ============================================================
# CALCULAR RFV
# ============================================================
def calc_rfv(rows):
    today = date.today()
    clientes = []

    for row in rows:
        id_cli, nome, data_ult, qtd_ped, valor = row
        recencia = (today - data_ult).days if data_ult else 9999
        qtd_ped = int(qtd_ped) if qtd_ped else 0
        valor = float(valor) if valor else 0.0

        clientes.append({
            "id": id_cli,
            "nome": nome or "SEM NOME",
            "data_ult_compra": str(data_ult) if data_ult else "Nunca",
            "recencia_dias": recencia,
            "frequencia": qtd_ped,
            "valor": valor
        })

    if not clientes:
        return []

    def assign_score(values, reverse=False):
        sorted_vals = sorted(set(values))
        n = len(sorted_vals)
        if n == 0:
            return [1] * len(values)
        scores = []
        for v in values:
            rank = sorted_vals.index(v)
            pct = rank / (n - 1) if n > 1 else 0
            score = min(int(pct * 5) + 1, 5)
            if reverse:
                score = 6 - score
            scores.append(score)
        return scores

    r_scores = assign_score([c["recencia_dias"] for c in clientes], reverse=True)
    f_scores = assign_score([c["frequencia"] for c in clientes], reverse=False)
    v_scores = assign_score([c["valor"] for c in clientes], reverse=False)

    for i, c in enumerate(clientes):
        r, f, v = r_scores[i], f_scores[i], v_scores[i]
        c["r_score"] = r
        c["f_score"] = f
        c["v_score"] = v
        c["rfv_score"] = r + f + v
        c["rfv_code"] = f"{r}{f}{v}"

        # Segmentação
        if r >= 4 and f >= 4 and v >= 4:
            seg, color, icon = "Campeões", "#22c55e", "🏆"
        elif r >= 4 and f >= 3:
            seg, color, icon = "Leais", "#3b82f6", "💎"
        elif r >= 4 and f <= 2:
            seg, color, icon = "Novos", "#a855f7", "🆕"
        elif r >= 3 and f >= 3 and v >= 3:
            seg, color, icon = "Potenciais Leais", "#06b6d4", "⭐"
        elif r <= 2 and f >= 3 and v >= 3:
            seg, color, icon = "Em Risco", "#f97316", "⚠️"
        elif r <= 2 and f >= 4:
            seg, color, icon = "Não Pode Perder", "#ef4444", "🚨"
        elif r <= 2 and f <= 2:
            seg, color, icon = "Hibernando", "#6b7280", "😴"
        elif r == 3:
            seg, color, icon = "Precisam Atenção", "#eab308", "👀"
        else:
            seg, color, icon = "Outros", "#9ca3af", "📋"

        c["segmento"] = seg
        c["seg_color"] = color
        c["seg_icon"] = icon

    return clientes


# ============================================================
# PREPARAR PAYLOAD
# ============================================================
def build_payload(clientes, total_db):
    ativos = len(clientes)
    total_valor = sum(c["valor"] for c in clientes)
    total_pedidos = sum(c["frequencia"] for c in clientes)
    recencias_validas = [c["recencia_dias"] for c in clientes if c["recencia_dias"] < 9999]
    media_recencia = round(sum(recencias_validas) / max(len(recencias_validas), 1))

    # Segmentos
    seg_map = {}
    seg_order = ["Campeões", "Leais", "Potenciais Leais", "Novos", "Precisam Atenção", "Em Risco", "Não Pode Perder", "Hibernando", "Outros"]
    for c in clientes:
        s = c["segmento"]
        if s not in seg_map:
            seg_map[s] = {"nome": s, "color": c["seg_color"], "icon": c["seg_icon"], "count": 0, "valor": 0}
        seg_map[s]["count"] += 1
        seg_map[s]["valor"] += c["valor"]

    segmentos = []
    for nome in seg_order:
        if nome in seg_map:
            s = seg_map[nome]
            s["pct_count"] = round(s["count"] / max(ativos, 1) * 100, 1)
            s["pct_valor"] = round(s["valor"] / max(total_valor, 1) * 100, 1)
            s["valor"] = round(s["valor"], 2)
            segmentos.append(s)

    # Top clientes e em risco
    top = sorted(clientes, key=lambda x: x["valor"], reverse=True)[:20]
    risco = sorted(
        [c for c in clientes if c["segmento"] in ("Em Risco", "Não Pode Perder")],
        key=lambda x: x["valor"], reverse=True
    )[:20]

    return {
        "cliente_id": EMPRESA_ID,
        "empresa_nome": EMPRESA_NOME,
        "generated_at": datetime.now().isoformat(),
        "resumo": {
            "clientes_ativos": ativos,
            "total_cadastrados": total_db,
            "clientes_inativos": total_db - ativos,
            "total_valor": round(total_valor, 2),
            "total_pedidos": total_pedidos,
            "recencia_media": media_recencia
        },
        "segmentos": segmentos,
        "top_clientes": top,
        "clientes_risco": risco,
        "clientes": clientes
    }


# ============================================================
# MAIN
# ============================================================
def main():
    print("=" * 50)
    print("  SYNC RFV - Nova Automação")
    print("=" * 50)

    print("\n[1/4] Conectando ao banco...")
    try:
        rows, total = fetch_data()
        print(f"      {len(rows)} clientes com movimentação")
    except Exception as e:
        print(f"      ERRO: {e}")
        input("\nPressione Enter para sair...")
        return

    print("[2/4] Calculando RFV...")
    clientes = calc_rfv(rows)
    print(f"      {len(clientes)} clientes classificados")

    print("[3/4] Montando payload...")
    payload = build_payload(clientes, total)
    print(f"      {len(payload['segmentos'])} segmentos")

    # Salvar local backup
    with open("rfv_backup.json", "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print("      Backup salvo: rfv_backup.json")

    print("[4/4] Enviando para o WebApp...")
    try:
        resp = requests.post(
            WEBAPP_URL,
            json=payload,
            headers={"Authorization": f"Bearer {API_TOKEN}"},
            timeout=30
        )
        if resp.status_code == 200:
            print(f"      SUCESSO: {resp.json().get('message', 'OK')}")
        else:
            print(f"      ERRO HTTP {resp.status_code}: {resp.text}")
    except requests.exceptions.ConnectionError:
        print(f"      ERRO: Não conseguiu conectar em {WEBAPP_URL}")
        print("      Verifique se o WebApp está rodando e o IP está correto.")
    except Exception as e:
        print(f"      ERRO: {e}")

    print("\n" + "=" * 50)
    input("Pressione Enter para sair...")

if __name__ == "__main__":
    main()
