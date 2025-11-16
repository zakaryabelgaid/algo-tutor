# Hostinger Deployment Checklist ✅

## Before You Start
- [ ] Hostinger hosting account purchased
- [ ] Domain name ready (or using Hostinger subdomain)
- [ ] Node.js and npm installed on your computer

## Step 1: Prepare Your App
- [ ] Run `deploy-to-hostinger.bat` OR manually run:
  - [ ] `npm install`
  - [ ] `npm run build`
- [ ] Verify `out` folder is created with files

## Step 2: Access Hostinger
- [ ] Login to hPanel (hpanel.hostinger.com)
- [ ] Locate your domain in the dashboard
- [ ] Access File Manager OR get FTP credentials

## Step 3: Upload Files
### Using File Manager:
- [ ] Open File Manager in hPanel
- [ ] Navigate to `public_html` folder
- [ ] Delete existing files (index.html, etc.)
- [ ] Upload ALL files from `out` folder
- [ ] Verify upload completed (check file count)

### Using FTP (Alternative):
- [ ] Download FileZilla or WinSCP
- [ ] Connect using FTP credentials
- [ ] Navigate to `public_html` on server
- [ ] Upload `out` folder contents
- [ ] Verify all files transferred

## Step 4: Configure Domain & SSL
- [ ] Domain points to Hostinger (if external domain)
- [ ] Enable SSL certificate in hPanel
- [ ] Force HTTPS redirect
- [ ] Wait 30 minutes for SSL activation

## Step 5: Test Your Website
- [ ] Visit your domain: `https://yourdomain.com`
- [ ] Test main pages:
  - [ ] Home page (/)
  - [ ] Lessons (/lessons)
  - [ ] Individual lesson (/lessons/c-basics-01)
  - [ ] News (/news)
  - [ ] Q&A (/qna)
  - [ ] Teachers (/teachers)
- [ ] Check mobile responsiveness
- [ ] Verify all images load
- [ ] Test navigation between pages

## Step 6: Optimization (Optional)
- [ ] Create .htaccess for caching
- [ ] Set up custom 404 page
- [ ] Configure compression
- [ ] Test site speed

## Troubleshooting
If something doesn't work:
- [ ] Check browser console for errors
- [ ] Verify all files uploaded correctly
- [ ] Clear browser cache
- [ ] Check file permissions (644 for files, 755 for folders)
- [ ] Contact Hostinger support if needed

## Future Updates
When you make changes:
- [ ] Run `deploy-to-hostinger.bat` again
- [ ] Re-upload files to `public_html`
- [ ] Clear browser cache to see changes

## Success! 🎉
- [ ] Website is live and accessible
- [ ] All pages work correctly
- [ ] SSL certificate is active
- [ ] Mobile-friendly design confirmed

**Your algo-tutor website is now live on Hostinger!**
