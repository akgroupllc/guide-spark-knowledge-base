
const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Get all articles with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM articles WHERE published = true';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (title LIKE ? OR content LIKE ? OR excerpt LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.execute(query, params);
    
    // Parse JSON tags for each article
    const articles = rows.map(article => ({
      ...article,
      tags: article.tags ? JSON.parse(article.tags) : []
    }));

    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get single article by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM articles WHERE id = ? AND published = true',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const article = {
      ...rows[0],
      tags: rows[0].tags ? JSON.parse(rows[0].tags) : []
    };

    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Create new article
router.post('/', async (req, res) => {
  try {
    const { title, content, excerpt, category, author = 'Admin', tags = [] } = req.body;
    
    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required' });
    }

    const id = `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    await pool.execute(
      'INSERT INTO articles (id, title, content, excerpt, category, author, tags, createdAt, lastUpdated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, content, excerpt || '', category, author, JSON.stringify(tags), now, now]
    );

    const [rows] = await pool.execute('SELECT * FROM articles WHERE id = ?', [id]);
    const article = {
      ...rows[0],
      tags: rows[0].tags ? JSON.parse(rows[0].tags) : []
    };

    res.status(201).json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Update article
router.put('/:id', async (req, res) => {
  try {
    const { title, content, excerpt, category, author, tags } = req.body;
    const articleId = req.params.id;

    // Check if article exists
    const [existing] = await pool.execute('SELECT id FROM articles WHERE id = ?', [articleId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (content !== undefined) {
      updates.push('content = ?');
      params.push(content);
    }
    if (excerpt !== undefined) {
      updates.push('excerpt = ?');
      params.push(excerpt);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      params.push(category);
    }
    if (author !== undefined) {
      updates.push('author = ?');
      params.push(author);
    }
    if (tags !== undefined) {
      updates.push('tags = ?');
      params.push(JSON.stringify(tags));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.push('lastUpdated = ?');
    params.push(new Date());
    params.push(articleId);

    await pool.execute(
      `UPDATE articles SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const [rows] = await pool.execute('SELECT * FROM articles WHERE id = ?', [articleId]);
    const article = {
      ...rows[0],
      tags: rows[0].tags ? JSON.parse(rows[0].tags) : []
    };

    res.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// Delete article
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM articles WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// Increment article views
router.post('/:id/views', async (req, res) => {
  try {
    await pool.execute('UPDATE articles SET views = views + 1 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Views incremented successfully' });
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({ error: 'Failed to increment views' });
  }
});

module.exports = router;
