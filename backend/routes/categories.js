const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const [categories] = await pool.execute('SELECT * FROM categories ORDER BY category_name ASC');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 