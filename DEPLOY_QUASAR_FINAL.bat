@echo off
setlocal
cd /d "%~dp0"
echo.
echo QUASAR - deploy final corrigido
if not exist package.json (
  echo ERRO: package.json nao encontrado nesta pasta.
  pause
  exit /b 1
)
if not exist public\assets\img_reebok03.webp (
  echo ERRO: assets corrigidos nao encontrados.
  pause
  exit /b 1
)
call npx vercel@latest deploy --prod --project quasarsite --scope quasarmotion3d
if errorlevel 1 (
  echo.
  echo DEPLOY FALHOU - nada foi considerado concluido.
  pause
  exit /b 1
)
echo.
echo DEPLOY CONCLUIDO. Abra https://quasarsite.vercel.app
pause
