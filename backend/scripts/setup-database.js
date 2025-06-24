
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

    // Insert sample data if table is empty
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM articles');
    if (rows[0].count === 0) {
      console.log('📝 Inserting sample articles...');
      
      const sampleArticles = [
        {
          id: 'sample-1',
          title: 'Getting Started with Our Knowledge Base',
          content: '<h2>Welcome to Our Knowledge Base</h2><p>This article will help you get started with using our knowledge base system effectively.</p><h3>Key Features</h3><ul><li>Search functionality</li><li>Category filtering</li><li>Article management</li></ul>',
          excerpt: 'Learn how to navigate and use our knowledge base system effectively.',
          category: 'Getting Started',
          author: 'Admin',
          tags: JSON.stringify(['tutorial', 'basics', 'getting-started'])
        },
        {
          id: 'sample-2',
          title: 'How to Search for Articles',
          content: '<h2>Searching Articles</h2><p>Our search functionality allows you to find articles quickly and efficiently.</p><h3>Search Tips</h3><ul><li>Use specific keywords</li><li>Try different search terms</li><li>Use category filters</li></ul>',
          excerpt: 'Master the search functionality to find articles quickly.',
          category: 'Help',
          author: 'Admin',
          tags: JSON.stringify(['search', 'tips', 'help'])
        }
      ];

      for (const article of sampleArticles) {
        await pool.execute(
          'INSERT INTO articles (id, title, content, excerpt, category, author, tags) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [article.id, article.title, article.content, article.excerpt, article.category, article.author, article.tags]
        );
      }
      console.log('✅ Sample articles inserted');
    }

    console.log('🎉 Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

createTables();
