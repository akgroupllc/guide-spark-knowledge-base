
# Backend Deployment Guide

This guide explains how to deploy the Knowledge Base backend API server.

## Server Requirements

- Node.js 16+ 
- MySQL database access
- Web server with Node.js support (or VPS)
- Port 3001 available (or configure different port)

## Deployment Steps

### Option 1: Deploy to VPS/Dedicated Server

1. **Upload Backend Files**
   ```bash
   # Upload the entire 'backend' folder to your server
   scp -r backend/ user@your-server.com:/var/www/knowledge-base-api/
   ```

2. **Install Dependencies**
   ```bash
   cd /var/www/knowledge-base-api/
   npm install --production
   ```

3. **Setup Database**
   ```bash
   npm run setup-db
   ```

4. **Configure Environment**
   - Update `.env` file if needed
   - Set `NODE_ENV=production`
   - Update `FRONTEND_URL` to your production domain

5. **Start Server with PM2 (Recommended)**
   ```bash
   # Install PM2 globally
   npm install -g pm2
   
   # Start the application
   pm2 start server.js --name "knowledge-base-api"
   
   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

### Option 2: Deploy to Plesk (if Node.js is supported)

1. **Upload Files**
   - Upload backend folder contents to a subdomain or subfolder
   - Example: `api.yourdomain.com` or `yourdomain.com/api`

2. **Install Node.js Application**
   - In Plesk, go to "Node.js" section
   - Create new Node.js application
   - Set entry point to `server.js`
   - Install dependencies via Plesk interface

3. **Configure Environment Variables**
   - Set environment variables in Plesk Node.js settings:
     - `NODE_ENV=production`
     - `PORT=3001` (or as required by Plesk)
     - `FRONTEND_URL=https://yourdomain.com`

4. **Setup Database**
   - Run database setup script through Plesk terminal or SSH

### Option 3: Deploy to Cloud Platforms

#### Heroku
1. Create new Heroku app
2. Add MySQL add-on (ClearDB or JawsDB)
3. Set environment variables in Heroku dashboard
4. Deploy via Git or GitHub integration

#### DigitalOcean App Platform
1. Create new app from GitHub repository
2. Configure build and run commands
3. Add MySQL database component
4. Set environment variables

#### Railway/Render
1. Connect GitHub repository
2. Add MySQL database
3. Configure environment variables
4. Deploy automatically

## Environment Variables for Production

Update your `.env` file for production:

```env
# Database Configuration (keep your existing values)
DB_HOST=74.208.43.105
DB_NAME=akgroup_help_lovable
DB_USER=akgroup_love_help
DB_PASSWORD=M@3W5@zSp8ljeran
DB_PORT=3306

# Server Configuration
PORT=3001
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=https://yourdomain.com
```

## SSL/HTTPS Configuration

If deploying behind a reverse proxy (Nginx/Apache):

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Apache Configuration (.htaccess)
```apache
RewriteEngine On
RewriteRule ^(.*)$ http://localhost:3001/$1 [P,L]
ProxyPreserveHost On
ProxyRequests Off
```

## Frontend Configuration

After backend deployment, update your frontend's environment configuration:

```typescript
// src/config/environment.ts
return {
  production: isProduction,
  apiBaseUrl: isProduction 
    ? 'https://api.yourdomain.com/api' // Your production backend URL
    : 'http://localhost:3001/api'
};
```

## Testing Deployment

1. **Test Backend Directly**
   ```bash
   curl https://api.yourdomain.com/health
   curl https://api.yourdomain.com/api/articles
   ```

2. **Test Frontend Integration**
   - Deploy frontend with updated API URL
   - Verify all functionality works
   - Check browser console for errors

## Monitoring and Maintenance

- Set up log rotation for server logs
- Monitor database connections and performance
- Regular database backups
- Monitor server resources (CPU, memory, disk)
- Set up alerts for server downtime

## Troubleshooting

**Common Issues:**
- Database connection timeouts: Check firewall settings
- CORS errors: Verify FRONTEND_URL in environment
- Port conflicts: Ensure port 3001 is available
- Permission errors: Check file permissions and ownership

**Logs Location:**
- Application logs: Console output or PM2 logs
- Error logs: Check server error logs
- Database logs: MySQL error logs
