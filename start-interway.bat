@echo off
title InterWay - Inicializador

echo ========================================
echo          INICIANDO INTERWAY
echo ========================================
echo.

cd /d C:\Users\LAB4\Desktop\TCC

echo [1/4] Iniciando MariaDB...
start "" /min C:\xampp\mysql_start.bat

echo Aguardando banco iniciar...
timeout /t 5 /nobreak >nul

echo [2/4] Iniciando Backend...
start "InterWay Backend" cmd /k "cd /d C:\Users\LAB4\Desktop\TCC\backend && venv\Scripts\python.exe -m uvicorn app.main:app --reload"

echo Aguardando backend...
timeout /t 4 /nobreak >nul

echo [3/4] Iniciando Frontend...
start "InterWay Frontend" cmd /k "cd /d C:\Users\LAB4\Desktop\TCC\frontend && npm run dev"

echo Aguardando frontend...
timeout /t 4 /nobreak >nul

echo [4/4] Abrindo InterWay...
start "" http://localhost:5173

echo.
echo ========================================
echo       INTERWAY INICIADO!
echo ========================================
echo.
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo Swagger:  http://127.0.0.1:8000/docs
echo.

pause