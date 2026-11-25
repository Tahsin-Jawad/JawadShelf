@echo off
cd /d "%~dp0"

echo [1/4] Syncing with GitHub...
git pull --no-rebase origin main

echo [2/4] Updating materials list...
call node scripts/generate-materials.js

echo [3/4] Saving changes...
git add .
git commit -m "Added new materials"

echo [4/4] Uploading to live website...
git push origin main

echo.
echo ==========================================
echo   DONE! Website will update in 1 minute.
echo ==========================================
pause