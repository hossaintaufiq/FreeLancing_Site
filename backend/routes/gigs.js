const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Create Gig
router.post('/', async (req, res) => {
  const { user_id, category_id, title, description, price } = req.body;
  if (!user_id || !category_id || !title || !description || !price) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO gigs (user_id, category_id, title, description, price) VALUES (?, ?, ?, ?, ?)',
      [user_id, category_id, title, description, price]
    );
    res.json({ success: true, gig_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Gigs (with optional search/filter)
router.get('/', async (req, res) => {
  const { search, category_id } = req.query;
  let sql = `SELECT g.gig_id, g.title, g.description, g.price, g.created_at, u.username AS seller, c.category_name
             FROM gigs g
             INNER JOIN users u ON g.user_id = u.user_id
             INNER JOIN categories c ON g.category_id = c.category_id
             WHERE 1`;
  const params = [];
  if (search) {
    sql += ' AND (g.title LIKE ? OR g.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (category_id) {
    sql += ' AND g.category_id = ?';
    params.push(category_id);
  }
  sql += ' ORDER BY g.created_at DESC LIMIT 50';
  try {
    const [gigs] = await pool.execute(sql, params);
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit Gig
router.put('/:gig_id', async (req, res) => {
  const { gig_id } = req.params;
  const { title, description, price } = req.body;
  if (!title || !description || !price) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    await pool.execute(
      'UPDATE gigs SET title = ?, description = ?, price = ? WHERE gig_id = ?',
      [title, description, price, gig_id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Gig
router.delete('/:gig_id', async (req, res) => {
  const { gig_id } = req.params;
  try {
    await pool.execute('DELETE FROM gigs WHERE gig_id = ?', [gig_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 