const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Send Message
router.post('/', async (req, res) => {
  const { order_id, sender_id, message } = req.body;
  if (!order_id || !sender_id || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO messages (order_id, sender_id, message) VALUES (?, ?, ?)',
      [order_id, sender_id, message]
    );
    res.json({ success: true, message_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Messages for an Order
router.get('/:order_id', async (req, res) => {
  const { order_id } = req.params;
  try {
    const [messages] = await pool.execute(
      `SELECT m.message_id, m.message, m.sent_at, u.username AS sender
       FROM messages m
       INNER JOIN users u ON m.sender_id = u.user_id
       WHERE m.order_id = ?
       ORDER BY m.sent_at ASC`,
      [order_id]
    );
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 