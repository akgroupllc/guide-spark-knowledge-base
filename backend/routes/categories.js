
const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Get all unique categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT DISTINCT category FROM articles WHERE published = true ORDER BY category ASC'
    );
    
    const categories = rows.map(row => row.category);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
