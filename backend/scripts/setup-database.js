
const { pool } = require('../config/database');

const createTables = async () => {
  try {
    console.log('🏗️  Setting up database tables...');

    // Create articles table
    const createArticlesTable = `
      CREATE TABLE IF NOT EXISTS articles (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        category VARCHAR(100) NOT NULL,
        author VARCHAR(100) NOT NULL DEFAULT 'Admin',
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        lastUpdated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        views INT NOT NULL DEFAULT 0,
        tags JSON,
        published BOOLEAN NOT NULL DEFAULT true,
        INDEX idx_category (category),
        INDEX idx_published (published),
        INDEX idx_created (createdAt),
        INDEX idx_title (title)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await pool.execute(createArticlesTable);
    console.log('✅ Articles table created successfully');

    // Clear existing sample data and insert fresh data
    console.log('🗑️  Clearing existing articles...');
    await pool.execute('DELETE FROM articles');

    console.log('📝 Inserting sample articles from mockArticles...');
    
    const sampleArticles = [
      {
        id: '1',
        title: 'Getting Started with Our Platform',
        content: `
          <h2>Welcome to Our Platform</h2>
          <p>This comprehensive guide will help you get started with our platform quickly and efficiently.</p>
          
          <h3>Step 1: Creating Your Account</h3>
          <p>To begin using our platform, you'll need to create an account. Simply click the "Sign Up" button and follow the prompts.</p>
          
          <h3>Step 2: Setting Up Your Profile</h3>
          <p>Once your account is created, take a few minutes to complete your profile. This helps us provide you with a personalized experience.</p>
          
          <h3>Step 3: Exploring Features</h3>
          <p>Our platform offers many powerful features. Start by exploring the dashboard and familiarizing yourself with the interface.</p>
          
          <h3>Need Help?</h3>
          <p>If you encounter any issues during setup, don't hesitate to contact our support team. We're here to help!</p>
        `,
        excerpt: 'Learn how to get started with our platform in just a few simple steps. This guide covers account creation, profile setup, and initial exploration.',
        category: 'Getting Started',
        author: 'Sarah Johnson',
        createdAt: '2024-01-15 00:00:00',
        lastUpdated: '2024-01-20 00:00:00',
        views: 1247,
        tags: JSON.stringify(['setup', 'beginner', 'tutorial'])
      },
      {
        id: '2',
        title: 'Advanced Configuration Options',
        content: `
          <h2>Advanced Configuration</h2>
          <p>For power users who want to customize their experience, our platform offers extensive configuration options.</p>
          
          <h3>Custom Workflows</h3>
          <p>Create custom workflows that match your specific business processes. Our workflow builder makes it easy to automate repetitive tasks.</p>
          
          <h3>API Integration</h3>
          <p>Connect your existing tools and services using our robust API. Full documentation and examples are available in our developer portal.</p>
          
          <h3>Advanced Security Settings</h3>
          <p>Configure advanced security features including two-factor authentication, IP restrictions, and custom access controls.</p>
        `,
        excerpt: 'Deep dive into advanced configuration options including custom workflows, API integration, and security settings for power users.',
        category: 'Advanced',
        author: 'Michael Chen',
        createdAt: '2024-01-10 00:00:00',
        lastUpdated: '2024-01-18 00:00:00',
        views: 856,
        tags: JSON.stringify(['advanced', 'configuration', 'api'])
      },
      {
        id: '3',
        title: 'Troubleshooting Common Issues',
        content: `
          <h2>Common Issues and Solutions</h2>
          <p>This article covers the most frequently encountered issues and their solutions.</p>
          
          <h3>Login Problems</h3>
          <p>If you're having trouble logging in, try these steps:</p>
          <ul>
            <li>Clear your browser cache and cookies</li>
            <li>Try using an incognito/private browser window</li>
            <li>Reset your password if needed</li>
          </ul>
          
          <h3>Performance Issues</h3>
          <p>For slow loading times or performance problems:</p>
          <ul>
            <li>Check your internet connection</li>
            <li>Close unnecessary browser tabs</li>
            <li>Try a different browser</li>
          </ul>
          
          <h3>Data Sync Issues</h3>
          <p>If your data isn't syncing properly, ensure you have a stable internet connection and try refreshing the page.</p>
        `,
        excerpt: 'Quick solutions to the most common issues users encounter, including login problems, performance issues, and data sync troubles.',
        category: 'Troubleshooting',
        author: 'Emily Rodriguez',
        createdAt: '2024-01-12 00:00:00',
        lastUpdated: '2024-01-22 00:00:00',
        views: 2134,
        tags: JSON.stringify(['troubleshooting', 'support', 'common-issues'])
      },
      {
        id: '4',
        title: 'Security Best Practices',
        content: `
          <h2>Keeping Your Account Secure</h2>
          <p>Security is our top priority. Follow these best practices to keep your account and data safe.</p>
          
          <h3>Strong Passwords</h3>
          <p>Use strong, unique passwords that include a mix of uppercase and lowercase letters, numbers, and special characters.</p>
          
          <h3>Two-Factor Authentication</h3>
          <p>Enable two-factor authentication (2FA) for an extra layer of security. We support both SMS and authenticator app methods.</p>
          
          <h3>Regular Security Reviews</h3>
          <p>Regularly review your account activity and connected devices. Remove any unfamiliar devices immediately.</p>
          
          <h3>Safe Browsing</h3>
          <p>Always ensure you're on the correct website before entering your credentials. Look for the secure lock icon in your browser.</p>
        `,
        excerpt: 'Essential security practices to protect your account and data, including password management, two-factor authentication, and safe browsing tips.',
        category: 'Security',
        author: 'David Kim',
        createdAt: '2024-01-08 00:00:00',
        lastUpdated: '2024-01-16 00:00:00',
        views: 967,
        tags: JSON.stringify(['security', 'best-practices', 'authentication'])
      },
      {
        id: '5',
        title: 'Mobile App Features Guide',
        content: `
          <h2>Using Our Mobile App</h2>
          <p>Our mobile app brings the full power of our platform to your smartphone or tablet.</p>
          
          <h3>Download and Installation</h3>
          <p>Download our app from the App Store or Google Play Store. The installation process is straightforward and secure.</p>
          
          <h3>Key Features</h3>
          <p>The mobile app includes all essential features:</p>
          <ul>
            <li>Real-time notifications</li>
            <li>Offline mode support</li>
            <li>Quick actions and shortcuts</li>
            <li>Biometric authentication</li>
          </ul>
          
          <h3>Syncing Data</h3>
          <p>Your data automatically syncs between the web platform and mobile app, ensuring you always have the latest information.</p>
        `,
        excerpt: 'Complete guide to our mobile app features, including download instructions, key features, and data synchronization capabilities.',
        category: 'Mobile',
        author: 'Lisa Wang',
        createdAt: '2024-01-14 00:00:00',
        lastUpdated: '2024-01-19 00:00:00',
        views: 743,
        tags: JSON.stringify(['mobile', 'app', 'features'])
      },
      {
        id: '6',
        title: 'API Documentation Overview',
        content: `
          <h2>API Documentation</h2>
          <p>Our REST API provides programmatic access to all platform features.</p>
          
          <h3>Authentication</h3>
          <p>All API requests require authentication using API keys. You can generate your API key from your account settings.</p>
          
          <h3>Rate Limits</h3>
          <p>To ensure fair usage, our API has rate limits in place:</p>
          <ul>
            <li>1000 requests per hour for free accounts</li>
            <li>10,000 requests per hour for premium accounts</li>
            <li>Custom limits available for enterprise customers</li>
          </ul>
          
          <h3>Response Formats</h3>
          <p>All responses are returned in JSON format. Error responses include detailed error codes and messages.</p>
          
          <h3>SDK and Libraries</h3>
          <p>We provide official SDKs for popular programming languages including Python, JavaScript, PHP, and Ruby.</p>
        `,
        excerpt: 'Overview of our REST API including authentication, rate limits, response formats, and available SDKs for developers.',
        category: 'API',
        author: 'Alex Thompson',
        createdAt: '2024-01-09 00:00:00',
        lastUpdated: '2024-01-17 00:00:00',
        views: 1456,
        tags: JSON.stringify(['api', 'development', 'integration'])
      }
    ];

    for (const article of sampleArticles) {
      await pool.execute(
        'INSERT INTO articles (id, title, content, excerpt, category, author, createdAt, lastUpdated, views, tags, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          article.id, 
          article.title, 
          article.content, 
          article.excerpt, 
          article.category, 
          article.author, 
          article.createdAt,
          article.lastUpdated,
          article.views,
          article.tags,
          true
        ]
      );
    }
    console.log('✅ Sample articles inserted successfully');

    console.log('🎉 Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

createTables();
