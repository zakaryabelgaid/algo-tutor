# GitHub → Hostinger Deployment Checklist ✅

## Prerequisites
- [ ] GitHub account created
- [ ] Hostinger hosting purchased
- [ ] Git installed on your computer
- [ ] Domain name ready

## Step 1: GitHub Repository Setup
- [ ] Create new repository on GitHub
  - [ ] Repository name: `algo-tutor` (or your choice)
  - [ ] Set to **Public** (required for free GitHub Actions)
  - [ ] **Don't** initialize with README
- [ ] Note your GitHub username
- [ ] Note your repository name

## Step 2: Push Code to GitHub
**Option A - Use Setup Script:**
- [ ] Run `setup-github-deployment.bat`
- [ ] Enter your GitHub username when prompted
- [ ] Enter repository name when prompted

**Option B - Manual Commands:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Get Hostinger FTP Credentials
- [ ] Login to Hostinger hPanel
- [ ] Go to Files → FTP Accounts
- [ ] Note down:
  - [ ] FTP Server (e.g., `ftp.yourdomain.com`)
  - [ ] Username
  - [ ] Password (create/reset if needed)

## Step 4: Configure GitHub Secrets
- [ ] Go to your GitHub repository
- [ ] Click Settings → Secrets and variables → Actions
- [ ] Add 3 repository secrets:

**Secret 1:**
- [ ] Name: `HOSTINGER_FTP_SERVER`
- [ ] Value: Your FTP server address

**Secret 2:**
- [ ] Name: `HOSTINGER_FTP_USERNAME`
- [ ] Value: Your FTP username

**Secret 3:**
- [ ] Name: `HOSTINGER_FTP_PASSWORD`
- [ ] Value: Your FTP password

## Step 5: Test Deployment
- [ ] Make a small change (e.g., edit README.md)
- [ ] Commit and push:
  ```bash
  git add .
  git commit -m "Test deployment"
  git push
  ```
- [ ] Go to GitHub → Actions tab
- [ ] Watch deployment progress
- [ ] Wait for green checkmark ✅

## Step 6: Verify Website
- [ ] Visit your domain: `https://yourdomain.com`
- [ ] Test all pages work:
  - [ ] Home page
  - [ ] Lessons page
  - [ ] Individual lessons
  - [ ] News page
  - [ ] Q&A page
  - [ ] Teachers page
- [ ] Check mobile responsiveness
- [ ] Verify images load correctly

## Step 7: Enable SSL (HTTPS)
- [ ] In Hostinger hPanel: Security → SSL/TLS
- [ ] Enable SSL for your domain
- [ ] Force HTTPS redirect
- [ ] Wait 30 minutes for activation
- [ ] Test: `https://yourdomain.com`

## Step 8: Future Updates
- [ ] Understand the workflow:
  1. Make code changes locally
  2. `git add .`
  3. `git commit -m "Description"`
  4. `git push`
  5. GitHub automatically deploys to Hostinger

## Troubleshooting
**If GitHub Actions fails:**
- [ ] Check secrets are set correctly
- [ ] Verify FTP credentials work
- [ ] Review error logs in Actions tab

**If website doesn't update:**
- [ ] Check deployment completed successfully
- [ ] Clear browser cache (Ctrl+F5)
- [ ] Wait a few minutes for changes to propagate

**If FTP connection fails:**
- [ ] Test FTP credentials with FileZilla
- [ ] Check server address format
- [ ] Verify Hostinger account is active

## Success Indicators ✅
- [ ] GitHub repository shows your code
- [ ] GitHub Actions shows successful deployments
- [ ] Website loads at your domain
- [ ] All pages and features work
- [ ] HTTPS (SSL) is active
- [ ] Automatic deployments work on code changes

## Benefits of GitHub Deployment
✅ **Automatic updates** - Push code → Website updates  
✅ **Version control** - Track all changes  
✅ **Collaboration** - Others can contribute  
✅ **Backup** - Code safely stored on GitHub  
✅ **Professional workflow** - Industry standard  
✅ **Free** - No additional costs  

## Quick Commands Reference
```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub (triggers deployment)
git push

# View deployment logs
# Go to GitHub → Your repo → Actions tab
```

## Support Resources
- **GitHub Docs**: [docs.github.com](https://docs.github.com)
- **Hostinger Support**: 24/7 chat in hPanel
- **Git Tutorial**: [git-scm.com/docs/gittutorial](https://git-scm.com/docs/gittutorial)

**🎉 Once complete, your algo-tutor website will automatically deploy to Hostinger every time you push changes to GitHub!**
