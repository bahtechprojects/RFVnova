"""
WebApp Dashboard RFV - Nova Automação
Flask web application que recebe dados do cliente e exibe o dashboard.
"""
import os
import json
from functools import wraps
from datetime import datetime
from pathlib import Path
from flask import Flask, render_template, request, jsonify, redirect, url_for, session

app = Flask(__name__)
app.secret_key = "novaautomacao-rfv-2026"

# Usuários fictícios para acesso ao painel
USERS = {
    "admin@novaautomacao.com.br": "Nova@2026!",
    "suporte@novaautomacao.com.br": "Suporte@2026!",
}


def login_required(f):
    """Decorator que protege rotas exigindo login."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get("logged_in"):
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated

# Diretório para salvar dados recebidos dos clientes
DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

# Token simples de autenticação para a API
API_TOKEN = "nova-automacao-rfv-token-2026"


# ============================================================
# API - Recebe dados do cliente
# ============================================================
@app.route("/api/upload", methods=["POST"])
def api_upload():
    """Recebe dados RFV do script rodando na máquina do cliente."""
    token = request.headers.get("Authorization", "")
    if token != f"Bearer {API_TOKEN}":
        return jsonify({"error": "Token inválido"}), 401

    data = request.get_json()
    if not data:
        return jsonify({"error": "Dados não recebidos"}), 400

    # Salvar com timestamp
    cliente_id = data.get("cliente_id", "default")
    filename = DATA_DIR / f"{cliente_id}.json"

    data["received_at"] = datetime.now().isoformat()
    filename.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    return jsonify({
        "status": "ok",
        "message": f"Dados recebidos: {len(data.get('clientes', []))} clientes",
        "received_at": data["received_at"]
    })


# ============================================================
# LOGIN
# ============================================================
@app.route("/login", methods=["GET", "POST"])
def login():
    """Tela de login."""
    if session.get("logged_in"):
        return redirect(url_for("index"))

    error = None
    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        if email in USERS and USERS[email] == password:
            session["logged_in"] = True
            session["email"] = email
            return redirect(url_for("index"))
        error = "E-mail ou senha incorretos. Tente novamente."

    return render_template("login.html", error=error)


@app.route("/logout")
def logout():
    """Encerra a sessão."""
    session.clear()
    return redirect(url_for("login"))


# ============================================================
# PÁGINAS
# ============================================================
@app.route("/")
@login_required
def index():
    """Página principal - lista clientes/empresas disponíveis."""
    empresas = []
    for f in sorted(DATA_DIR.glob("*.json")):
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
            empresas.append({
                "id": f.stem,
                "nome": d.get("empresa_nome", f.stem),
                "total_clientes": len(d.get("clientes", [])),
                "atualizado": d.get("generated_at", d.get("received_at", "?")),
                "total_valor": d.get("resumo", {}).get("total_valor", 0)
            })
        except Exception:
            pass

    return render_template("index.html", empresas=empresas)


@app.route("/dashboard/<empresa_id>")
@login_required
def dashboard(empresa_id):
    """Dashboard RFV de uma empresa."""
    filepath = DATA_DIR / f"{empresa_id}.json"
    if not filepath.exists():
        return "Empresa não encontrada", 404

    data = json.loads(filepath.read_text(encoding="utf-8"))
    return render_template("dashboard.html", data=data, empresa_id=empresa_id)


@app.route("/api/data/<empresa_id>")
def api_data(empresa_id):
    """Retorna dados JSON para o frontend."""
    filepath = DATA_DIR / f"{empresa_id}.json"
    if not filepath.exists():
        return jsonify({"error": "Não encontrado"}), 404

    data = json.loads(filepath.read_text(encoding="utf-8"))
    return jsonify(data)


# ============================================================
# MAIN
# ============================================================
if __name__ == "__main__":
    print("=" * 50)
    print("  Dashboard RFV - WebApp")
    print("  http://localhost:5000")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5000, debug=True)
