@echo off
title GitHub Deployment Setup - Algo Tutor
color 0B

echo ========================================
echo    GITHUB DEPLOYMENT SETUP
echo ========================================
echo.

echo This script will help you set up GitHub deployment.
echo.
echo BEFORE RUNNING THIS SCRIPT:
echo 1. Create a GitHub repository at github.com
echo 2. Get your Hostinger FTP credentials from hPanel
echo 3. Have your GitHub username ready
echo.

set /p username="Enter your GitHub username: "
set /p reponame="Enter repository name (default: algo-tutor): "
if "%reponame%"=="" set reponame=algo-tutor

echo.
echo [1/4] Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo ERROR: Git initialization failed
    echo Make sure Git is installed: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo.
echo [2/4] Adding files to Git...
git add .
git commit -m "Initial commit - algo tutor app ready for deployment"

echo.
echo [3/4] Adding GitHub remote...
git remote add origin https://github.com/%username%/%reponame%.git
git branch -M main

echo.
echo [4/4] Pushing to GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo NOTE: If this fails, you may need to:
    echo 1. Authenticate with GitHub (use GitHub Desktop or Git Credential Manager)
    echo 2. Make sure the repository exists on GitHub
    echo 3. Try running: git push -u origin main
    echo.
)

echo.
echo ========================================
echo         SETUP COMPLETE!
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Go to your GitHub repository:
echo    https://github.com/%username%/%reponame%
echo.
echo 2. Go to Settings → Secrets and variables → Actions
echo.
echo 3. Add these 3 secrets:
echo    - HOSTINGER_FTP_SERVER (e.g., ftp.yourdomain.com)
echo    - HOSTINGER_FTP_USERNAME (your FTP username)
echo    - HOSTINGER_FTP_PASSWORD (your FTP password)
echo.
echo 4. Push any change to trigger deployment:
echo    git add .
echo    git commit -m "Test deployment"
echo    git push
echo.
echo 5. Monitor deployment in GitHub Actions tab
echo.
echo Your website will be live at: https://yourdomain.com
echo.
pause
