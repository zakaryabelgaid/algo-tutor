# Complete Guide: Deploy to Hostinger via GitHub Actions

## Overview
This guide will set up automatic deployment from GitHub to Hostinger. Every time you push code changes, your website will automatically update on Hostinger.

## Step 1: Create GitHub Repository

### 1.1 Create Repository on GitHub
1. Go to [github.com](https://github.com) and sign in
2. Click **"New repository"** (green button)
3. Repository settings:
   - **Name**: `algo-tutor` (or your preferred name)
   - **Visibility**: Public (required for free GitHub Actions)
   - **Don't** initialize with README (you already have files)
4. Click **"Create repository"**

### 1.2 Push Your Code to GitHub
Open terminal/command prompt in your project folder:

```bash
# Navigate to your project
cd "c:\Users\Aminho\Desktop\New folder\algo-tutor"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - algo tutor app"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/algo-tutor.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Set Up Hostinger

### 2.1 Get Hostinger Hosting
1. Go to [hostinger.com](https://hostinger.com)
2. Purchase hosting plan (Premium recommended - €2.99/month)
3. Set up your domain name
4. Access hPanel dashboard

### 2.2 Get FTP Credentials
1. Login to hPanel ([hpanel.hostinger.com](https://hpanel.hostinger.com))
2. Go to **"Files"** → **"FTP Accounts"**
3. Note down these details:
   - **FTP Server**: Usually `ftp.yourdomain.com` or IP address
   - **Username**: Your FTP username
   - **Password**: Your FTP password (create/reset if needed)

## Step 3: Configure GitHub Secrets

### 3.1 Add Secrets to GitHub Repository
1. Go to your GitHub repository
2. Click **"Settings"** tab (top menu)
3. In left sidebar: **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**

Add these 3 secrets one by one:

**Secret 1: FTP Server**
- Name: `HOSTINGER_FTP_SERVER`
- Value: Your FTP server (e.g., `ftp.yourdomain.com`)

**Secret 2: FTP Username**
- Name: `HOSTINGER_FTP_USERNAME`  
- Value: Your FTP username

**Secret 3: FTP Password**
- Name: `HOSTINGER_FTP_PASSWORD`
- Value: Your FTP password

## Step 4: Verify GitHub Actions Workflow

The workflow file `.github/workflows/deploy.yml` is already created. Let me show you what it does:

```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build application
      run: npm run build
      
    - name: Deploy to Hostinger via FTP
      uses: SamKirkland/FTP-Deploy-Action@v4.3.4
      with:
        server: ${{ secrets.HOSTINGER_FTP_SERVER }}
        username: ${{ secrets.HOSTINGER_FTP_USERNAME }}
        password: ${{ secrets.HOSTINGER_FTP_PASSWORD }}
        local-dir: ./out/
        server-dir: /public_html/belgaid_lessons
```

## Step 5: Test Deployment

### 5.1 Trigger First Deployment
1. Make a small change to your code (e.g., edit README.md)
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push
   ```

### 5.2 Monitor Deployment
1. Go to your GitHub repository
2. Click **"Actions"** tab
3. You'll see the deployment running
4. Click on the workflow to see progress
5. Wait for green checkmark (success) or red X (error)

### 5.3 Check Your Website
- Visit your domain: `https://yourdomain.com`
- Your site should be live!

## Step 6: Future Updates

### 6.1 Automatic Deployment Process
Every time you push to the `main` branch:
1. GitHub Actions automatically triggers
2. Builds your Next.js app
3. Uploads files to Hostinger
4. Your website updates automatically

### 6.2 Making Updates
```bash
# Make your changes to the code
# Then commit and push:
git add .
git commit -m "Description of your changes"
git push
```

## Step 7: Enable SSL Certificate

### 7.1 Set Up HTTPS
1. In Hostinger hPanel, go to **"Security"** → **"SSL/TLS"**
2. Click **"Manage"** next to your domain
3. Enable **"Force HTTPS"**
4. Wait 15-30 minutes for activation

## Troubleshooting

### Common Issues

**GitHub Actions Fails:**
- Check secrets are correctly set
- Verify FTP credentials work
- Check workflow logs for specific errors

**FTP Connection Issues:**
- Verify FTP server address
- Check username/password are correct
- Try connecting manually with FileZilla first

**Website Not Updating:**
- Check if deployment completed successfully
- Clear browser cache (Ctrl+F5)
- Verify files uploaded to correct directory

**Build Fails:**
- Check for syntax errors in your code
- Verify all dependencies are in package.json
- Review build logs in GitHub Actions

### Getting Help
- **GitHub Actions Logs**: Click on failed workflow for details
- **Hostinger Support**: 24/7 chat in hPanel
- **FTP Test**: Use FileZilla to test connection manually

## Workflow Monitoring

### 7.1 GitHub Actions Dashboard
- **Green checkmark**: Deployment successful
- **Yellow circle**: Deployment in progress  
- **Red X**: Deployment failed (check logs)

### 7.2 Deployment Time
- Typical deployment: 2-5 minutes
- Includes: Build (1-2 min) + Upload (1-3 min)

## Security Best Practices

### 8.1 Protect Your Secrets
- Never commit FTP credentials to code
- Use GitHub Secrets for sensitive data
- Regularly rotate FTP passwords

### 8.2 Branch Protection
Consider setting up branch protection:
1. Go to repository **Settings** → **Branches**
2. Add rule for `main` branch
3. Require pull request reviews

## Cost Summary

- **GitHub**: Free (for public repositories)
- **Hostinger Premium**: €2.99/month
- **Domain**: Usually free first year
- **SSL Certificate**: Free included
- **Total**: ~€36/year

## Success Checklist ✅

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Hostinger hosting purchased
- [ ] FTP credentials obtained
- [ ] GitHub secrets configured
- [ ] First deployment successful
- [ ] Website accessible via domain
- [ ] SSL certificate enabled
- [ ] Automatic deployments working

## Your Deployment is Complete! 🎉

Your algo-tutor website now automatically deploys to Hostinger whenever you push changes to GitHub. This gives you:

- **Automatic updates**: Push code → Website updates
- **Version control**: Full history of changes
- **Collaboration**: Others can contribute via pull requests
- **Backup**: Your code is safely stored on GitHub
- **Professional workflow**: Industry-standard deployment process

**Website URL**: `https://yourdomain.com`
**GitHub Repository**: `https://github.com/YOUR_USERNAME/algo-tutor`
