const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Place Order
router.post('/', async (req, res) => {
  const { gig_id, buyer_id } = req.body;
  if (!gig_id || !buyer_id) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    // Get seller_id from gig
    const [gigRows] = await pool.execute('SELECT user_id FROM gigs WHERE gig_id = ?', [gig_id]);
    if (!gigRows.length) {
      return res.status(404).json({ error: 'Gig not found.' });
    }
    const seller_id = gigRows[0].user_id;
    const [result] = await pool.execute(
      'INSERT INTO orders (gig_id, buyer_id, seller_id) VALUES (?, ?, ?)',
      [gig_id, buyer_id, seller_id]
    );
    res.json({ success: true, order_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Orders for a User (buyer or seller)
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const [orders] = await pool.execute(
      `SELECT o.order_id, o.status, o.order_date, g.title, g.price, 
              s.username AS seller, b.username AS buyer
       FROM orders o
       INNER JOIN gigs g ON o.gig_id = g.gig_id
       INNER JOIN users s ON o.seller_id = s.user_id
       INNER JOIN users b ON o.buyer_id = b.user_id
       WHERE o.buyer_id = ? OR o.seller_id = ?
       ORDER BY o.order_date DESC`,
      [user_id, user_id]
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 