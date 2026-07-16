@echo off
title Stationery Hub Website
cd /d "%~dp0"
echo Starting Stationery Hub...
echo.
echo If MySQL is not already running, this will try to start it.
start "MySQL Server" /min "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --datadir="C:\ProgramData\MySQL\MySQL Server 8.4\Data" --console
timeout /t 4 /nobreak >nul
echo.
echo Website starting...
echo Open: http://127.0.0.1:5173
echo.
npm start
pause
