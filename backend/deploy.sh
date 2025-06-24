
#!/bin/bash

echo "🚀 Knowledge Base Backend Deployment Script"
echo "==========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Setup database
echo "🏗️  Setting up database..."
npm run setup-db

if [ $? -ne 0 ]; then
    echo "❌ Failed to setup database"
    exit 1
fi

# Start server
echo "🚀 Starting server..."
npm start

echo "✅ Deployment completed successfully!"
echo "📊 Health check: http://localhost:3001/health"
echo "📚 API Documentation: http://localhost:3001/"
