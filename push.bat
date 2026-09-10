@echo off
set msg=%*
if "%msg%"=="" set msg=Update portfolio codebase
git add .
git commit -m "%msg%"
git push -u origin main