# Hostinger Deployment Guide via GitHub

## Overview
This guide will help you deploy your Next.js application to Hostinger using GitHub Actions for automatic deployment.

## Prerequisites
- GitHub account
- Hostinger hosting account
- Domain name (optional, can use Hostinger subdomain)

## Step 1: Prepare Your Application

### 1.1 Install Dependencies
```bash
npm install
```

### 1.2 Test Local Build
```bash
npm run build
```
This should create an `out` folder with your static files.

## Step 2: Set Up GitHub Repository

### 2.1 Create GitHub Repository
1. Go to https://github.com
2. Click "New repository"
3. Name it `algo-tutor` (or your preferred name)
4. Make it **Public**
5. Don't initialize with README
6. Click "Create repository"

### 2.2 Push Your Code
```bash
# If not already initialized
git init
git add .
git commit -m "Initial commit"

# Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/algo-tutor.git
git branch -M main
git push -u origin main
```

## Step 3: Set Up Hostinger

### 3.1 Get Hosting Plan
- Visit https://www.hostinger.com
- Choose Premium or Business plan
- Complete purchase and domain setup

### 3.2 Get FTP Credentials
1. Login to Hostinger control panel
2. Go to "Hosting" → "Manage"
3. Click "File Manager" or "FTP Accounts"
4. Note down:
   - FTP Server (e.g., `ftp.yourdomain.com`)
   - Username
   - Password

## Step 4: Configure GitHub Secrets

### 4.1 Add Repository Secrets
1. Go to your GitHub repository
2. Click "Settings" tab
3. Go to "Secrets and variables" → "Actions"
4. Add these secrets:

**HOSTINGER_FTP_SERVER**
- Value: Your FTP server address

**HOSTINGER_FTP_USERNAME** 
- Value: Your FTP username

**HOSTINGER_FTP_PASSWORD**
- Value: Your FTP password

## Step 5: Deploy

### 5.1 Automatic Deployment
- Every push to `main` branch will trigger deployment
- GitHub Actions will build and upload to Hostinger
- Check "Actions" tab for deployment status

### 5.2 Manual Deployment (Alternative)
If you prefer manual deployment:

1. Build locally:
```bash
npm run build
```

2. Upload `out` folder contents to Hostinger's `public_html` directory via:
   - File Manager in control panel
   - FTP client (FileZilla, WinSCP)

## Step 6: Configure Domain (Optional)

### 6.1 Custom Domain
If using your own domain:
1. Update nameservers to Hostinger's
2. Wait for DNS propagation (24-48 hours)

### 6.2 Hostinger Subdomain
Use the free subdomain provided by Hostinger

## Troubleshooting

### Common Issues

**Build Fails:**
- Check Node.js version compatibility
- Ensure all dependencies are installed
- Review error logs in GitHub Actions

**FTP Upload Fails:**
- Verify FTP credentials
- Check server-dir path in workflow
- Ensure Hostinger account is active

**Site Not Loading:**
- Check if files are in correct directory (`public_html`)
- Verify domain DNS settings
- Clear browser cache

**Firebase/API Issues:**
- Update Firebase config for production domain
- Check CORS settings
- Verify API endpoints

## File Structure After Deployment
```
public_html/
├── _next/
├── images/
├── index.html
├── 404.html
└── other static files...
```

## Support
- Hostinger Support: https://www.hostinger.com/help
- GitHub Actions Docs: https://docs.github.com/en/actions
- Next.js Static Export: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
