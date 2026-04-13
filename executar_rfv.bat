@echo off
echo ========================================
echo   Atualizando Dashboard RFV...
echo ========================================
cd /d "%~dp0"
python dashboard_rfv.py
if %errorlevel% neq 0 (
    echo.
    echo ERRO ao executar o script!
    pause
) else (
    echo.
    echo Dashboard atualizado com sucesso!
    timeout /t 5
)
