
# Knowledge Base Backend API

This is the backend API server for the Knowledge Base application, built with Node.js, Express, and MySQL.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   The `.env` file is already configured with your MySQL credentials:
   - Database Host: 74.208.43.105
   - Database Name: akgroup_help_lovable
   - Username: akgroup_love_help
   - Password: M@3W5@zSp8ljeran

3. **Setup Database Tables**
   ```bash
   npm run setup-db
   ```

4. **Start the Server**
   ```bash
   # Development mode (auto-restart on changes)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Articles
- `GET /api/articles` - Get all articles (with optional filtering)
- `GET /api/articles/:id` - Get single article by ID
- `POST /api/articles` - Create new article
- `PUT /api/articles/:id` - Update existing article
- `DELETE /api/articles/:id` - Delete article
- `POST /api/articles/:id/views` - Increment article view count

### Categories
- `GET /api/categories` - Get all unique categories

### System
- `GET /health` - Health check endpoint
- `GET /` - API documentation

## Query Parameters

### GET /api/articles
- `category` - Filter by category
- `search` - Search in title, content, and excerpt
- `limit` - Number of articles to return (default: 50)
- `offset` - Number of articles to skip (default: 0)

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes per IP)
- SQL injection prevention with parameterized queries
- Input validation

## Database Schema

### Articles Table
- `id` - Primary key (VARCHAR)
- `title` - Article title (VARCHAR)
- `content` - Full article content (TEXT)
- `excerpt` - Short description (TEXT)
- `category` - Article category (VARCHAR)
- `author` - Author name (VARCHAR)
- `createdAt` - Creation timestamp (DATETIME)
- `lastUpdated` - Last update timestamp (DATETIME)
- `views` - View counter (INT)
- `tags` - Article tags as JSON array
- `published` - Publication status (BOOLEAN)

## Deployment

1. Upload the backend folder to your server
2. Install Node.js (16+) on your server
3. Run `npm install` to install dependencies
4. Run `npm run setup-db` to create database tables
5. Start the server with `npm start`
6. Ensure your server allows connections on the configured port (default: 3001)

## Monitoring

- Server logs all requests using Morgan
- Health check endpoint at `/health`
- Database connection testing on startup
- Graceful shutdown handling
