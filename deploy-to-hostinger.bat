@echo off
title Deploy to Hostinger - Algo Tutor
color 0A

echo ========================================
echo    ALGO TUTOR - HOSTINGER DEPLOYMENT
echo ========================================
echo.

echo [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Building application for production...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [3/3] Build completed successfully!
echo.
echo ========================================
echo           DEPLOYMENT READY!
echo ========================================
echo.
echo Your website files are ready in the 'out' folder.
echo.
echo NEXT STEPS:
echo 1. Go to your Hostinger hPanel (hpanel.hostinger.com)
echo 2. Open File Manager
echo 3. Navigate to public_html folder
echo 4. Delete any existing files
echo 5. Upload ALL files from the 'out' folder
echo.
echo OR use FTP client like FileZilla:
echo - Host: ftp.yourdomain.com
echo - Upload 'out' folder contents to public_html
echo.
echo Your site will be live at: https://yourdomain.com
echo.
pause
