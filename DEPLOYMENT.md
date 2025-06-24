
# Deployment Guide for Plesk

This guide will help you deploy your React Knowledge Base app on a Plesk server.

## Prerequisites
- Plesk server with Node.js 18+ support
- MySQL database (optional, for API integration)
- Domain or subdomain configured in Plesk

## Step 1: Build the Application

On your local machine or development environment:

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `dist` folder with all production files.

## Step 2: Upload Files to Plesk

1. In Plesk, go to your domain/subdomain
2. Navigate to "Files" or use File Manager
3. Upload all contents from the `dist` folder to your web root (usually `httpdocs` or `public_html`)

## Step 3: Configure Web Server

The `.htaccess` file is included for Apache servers. If using Nginx, add this to your server configuration:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## Step 4: Test Deployment

Visit your domain - the app should load with mock data working.

## Step 5: Optional - Set Up MySQL API Backend

If you want to replace mock data with a real database:

1. Create a MySQL database in Plesk
2. Set up a backend API (Node.js, PHP, Python, etc.)
3. Update the API base URL in `src/config/environment.ts`
4. Deploy your backend API to a subdomain or subfolder

## Environment Configuration

The app is configured to:
- Use mock data in development
- Try to connect to API in production, fallback to mock data if API unavailable
- Handle loading states and errors gracefully

## Troubleshooting

- If routing doesn't work, ensure `.htaccess` is uploaded and mod_rewrite is enabled
- Check browser console for any JavaScript errors
- Verify all files from `dist` folder are uploaded correctly
- For API issues, check network tab in browser dev tools

## Performance Optimization

The deployment includes:
- Static file compression (gzip)
- Browser caching headers
- Optimized build with code splitting
- Lazy loading for better performance
