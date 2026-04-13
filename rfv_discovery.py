"""
Script de descoberta - Conecta no PostgreSQL do ResultMais
e lista as views/tabelas disponíveis para o usuário bahtech.
"""
import sys

try:
    import psycopg2
except ImportError:
    print("Instalando psycopg2...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "psycopg2-binary"])
    import psycopg2

# Configurações de conexão
DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "database": "rmbancodados",
    "user": "bahtech",
    "password": "@1234"
}

def main():
    print("=" * 60)
    print("CONEXÃO COM POSTGRESQL - RESULTMAIS")
    print("=" * 60)

    try:
        conn = psycopg2.connect(**DB_CONFIG)
        print("\n✅ CONEXÃO ESTABELECIDA COM SUCESSO!\n")
    except Exception as e:
        print(f"\n❌ ERRO AO CONECTAR: {e}")
        input("\nPressione Enter para sair...")
        return

    cur = conn.cursor()

    # 1. Listar todas as views disponíveis
    print("-" * 60)
    print("VIEWS DISPONÍVEIS:")
    print("-" * 60)
    cur.execute("""
        SELECT table_schema, table_name
        FROM information_schema.views
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY table_schema, table_name;
    """)
    views = cur.fetchall()
    if views:
        for schema, name in views:
            print(f"  {schema}.{name}")
    else:
        print("  Nenhuma view encontrada.")

    # 2. Listar tabelas acessíveis
    print("\n" + "-" * 60)
    print("TABELAS ACESSÍVEIS:")
    print("-" * 60)
    cur.execute("""
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        AND table_type = 'BASE TABLE'
        ORDER BY table_schema, table_name;
    """)
    tables = cur.fetchall()
    if tables:
        for schema, name in tables:
            print(f"  {schema}.{name}")
    else:
        print("  Nenhuma tabela acessível.")

    # 3. Para cada view encontrada, mostrar as colunas
    if views:
        print("\n" + "=" * 60)
        print("DETALHES DAS VIEWS (COLUNAS):")
        print("=" * 60)
        for schema, name in views:
            print(f"\n📋 {schema}.{name}:")
            cur.execute("""
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_schema = %s AND table_name = %s
                ORDER BY ordinal_position;
            """, (schema, name))
            cols = cur.fetchall()
            for col_name, col_type in cols:
                print(f"    - {col_name} ({col_type})")

            # Mostrar amostra de 5 linhas
            try:
                cur.execute(f'SELECT * FROM "{schema}"."{name}" LIMIT 5;')
                rows = cur.fetchall()
                col_names = [desc[0] for desc in cur.description]
                if rows:
                    print(f"\n  📊 Amostra (primeiras 5 linhas):")
                    print(f"  {' | '.join(col_names)}")
                    print(f"  {'-' * 80}")
                    for row in rows:
                        print(f"  {' | '.join(str(v) for v in row)}")
            except Exception as e:
                print(f"  ⚠️ Erro ao buscar amostra: {e}")
                conn.rollback()

    # 4. Contar registros
    if views:
        print("\n" + "=" * 60)
        print("CONTAGEM DE REGISTROS:")
        print("=" * 60)
        for schema, name in views:
            try:
                cur.execute(f'SELECT COUNT(*) FROM "{schema}"."{name}";')
                count = cur.fetchone()[0]
                print(f"  {schema}.{name}: {count:,} registros")
            except Exception as e:
                print(f"  {schema}.{name}: erro - {e}")
                conn.rollback()

    cur.close()
    conn.close()
    print("\n" + "=" * 60)
    print("Conexão encerrada.")
    input("\nPressione Enter para sair...")

if __name__ == "__main__":
    main()
