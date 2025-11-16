# Complete Guide: Deploy Next.js App Directly to Hostinger

## Step 1: Build Your Application

### 1.1 Install Dependencies (if not done)
```bash
cd "c:\Users\Aminho\Desktop\New folder\algo-tutor"
npm install
```

### 1.2 Build for Production
```bash
npm run build
```

This creates an `out` folder with all your static files.

## Step 2: Set Up Hostinger Hosting

### 2.1 Purchase Hostinger Plan
1. Go to [hostinger.com](https://www.hostinger.com)
2. Choose a hosting plan:
   - **Premium** (recommended) - €2.99/month
   - **Business** - €3.99/month (better performance)
3. Select domain name or use existing one
4. Complete payment

### 2.2 Access Control Panel
1. Check your email for Hostinger welcome message
2. Click "Access hPanel" or go to [hpanel.hostinger.com](https://hpanel.hostinger.com)
3. Login with your credentials

## Step 3: Get FTP/File Manager Access

### Option A: Using File Manager (Easier)
1. In hPanel, click **"File Manager"**
2. Navigate to `public_html` folder
3. This is where your website files go

### Option B: Using FTP (More Control)
1. In hPanel, go to **"Files"** → **"FTP Accounts"**
2. Note down:
   - **FTP Server**: Usually `ftp.yourdomain.com`
   - **Username**: Your main FTP username
   - **Password**: Set/reset if needed
   - **Port**: 21 (or 22 for SFTP)

## Step 4: Upload Your Website Files

### Method 1: File Manager Upload (Recommended for Beginners)

1. **Open File Manager** in hPanel
2. **Navigate to public_html** folder
3. **Delete default files** (if any):
   - Delete `index.html`
   - Delete any other default files
4. **Upload your files**:
   - Click **"Upload Files"**
   - Select ALL files from your `out` folder
   - OR zip the `out` folder contents and upload the zip, then extract

### Method 2: FTP Client (Recommended for Advanced Users)

#### Download FTP Client
- **FileZilla** (Free): [filezilla-project.org](https://filezilla-project.org)
- **WinSCP** (Windows): [winscp.net](https://winscp.net)

#### Connect via FileZilla
1. Open FileZilla
2. Enter connection details:
   - **Host**: `ftp.yourdomain.com`
   - **Username**: Your FTP username
   - **Password**: Your FTP password
   - **Port**: 21
3. Click **"Quickconnect"**

#### Upload Files
1. **Local side**: Navigate to your `out` folder
2. **Remote side**: Navigate to `public_html`
3. **Select all files** in `out` folder (Ctrl+A)
4. **Drag and drop** to `public_html` folder
5. Wait for upload to complete

## Step 5: Configure Domain (If Using Custom Domain)

### 5.1 If You Bought Domain Through Hostinger
- Domain should automatically point to your hosting
- Wait 24-48 hours for full propagation

### 5.2 If You Have External Domain
1. **Get Hostinger nameservers**:
   - `ns1.dns-parking.com`
   - `ns2.dns-parking.com`
2. **Update at your domain registrar**:
   - Login to your domain provider (GoDaddy, Namecheap, etc.)
   - Change nameservers to Hostinger's
   - Wait 24-48 hours for propagation

## Step 6: Test Your Website

### 6.1 Access Your Site
- **With custom domain**: `https://yourdomain.com`
- **With Hostinger subdomain**: `https://yourdomain.hostinger.site`

### 6.2 Check All Pages Work
- Home page: `/`
- Lessons: `/lessons`
- Individual lessons: `/lessons/c-basics-01`
- News: `/news`
- Q&A: `/qna`
- Teachers: `/teachers`

## Step 7: Set Up SSL Certificate (HTTPS)

### 7.1 Enable SSL in hPanel
1. Go to **"Security"** → **"SSL/TLS"**
2. Click **"Manage"** next to your domain
3. Enable **"Force HTTPS"**
4. Wait 15-30 minutes for activation

## Step 8: Optimize for Production

### 8.1 Set Up Custom Error Pages
1. In File Manager, create `404.html` in `public_html`
2. Copy content from your `out/404.html`

### 8.2 Configure Caching (Optional)
1. Create `.htaccess` file in `public_html`
2. Add caching rules:

```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

## Step 9: Future Updates

### 9.1 Update Process
When you make changes to your app:

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Upload new files**:
   - Delete old files in `public_html`
   - Upload new files from `out` folder

### 9.2 Automate with Batch Script
Create `deploy-to-hostinger.bat`:

```batch
@echo off
echo Building application...
npm run build

echo.
echo Build complete!
echo.
echo Next steps:
echo 1. Open FileZilla or File Manager
echo 2. Delete all files in public_html folder
echo 3. Upload all files from the 'out' folder
echo 4. Your site will be updated!
echo.
pause
```

## Troubleshooting

### Common Issues

**Site shows "Index of /" or directory listing**
- Make sure `index.html` is in the root of `public_html`
- Check file permissions (should be 644)

**404 errors on navigation**
- Next.js static export uses `.html` files
- Make sure all generated files are uploaded
- Check that `trailingSlash: true` is in `next.config.ts`

**Images not loading**
- Check image paths are correct
- Ensure `unoptimized: true` is set in `next.config.ts`
- Verify image files are uploaded

**CSS/JS not loading**
- Check `_next` folder is uploaded completely
- Verify file permissions
- Clear browser cache

**SSL certificate issues**
- Wait 30 minutes after enabling SSL
- Try accessing via `https://`
- Contact Hostinger support if issues persist

## File Structure After Upload

Your `public_html` should look like:
```
public_html/
├── _next/
│   ├── static/
│   └── ...
├── lessons/
│   ├── c-basics-01.html
│   ├── c-syntax-02.html
│   └── ...
├── news/
│   ├── welcome-to-algo-tutor.html
│   └── midterm-exam-schedule.html
├── index.html
├── 404.html
├── qna.html
├── teachers.html
└── ...
```

## Support Contacts

- **Hostinger Support**: Available 24/7 via live chat in hPanel
- **Knowledge Base**: [support.hostinger.com](https://support.hostinger.com)
- **Community**: [community.hostinger.com](https://community.hostinger.com)

## Cost Breakdown

- **Premium Plan**: €2.99/month (€35.88/year)
- **Business Plan**: €3.99/month (€47.88/year)
- **Domain**: Usually included for first year
- **SSL Certificate**: Free with all plans

Your algo-tutor website will be live and accessible worldwide!
