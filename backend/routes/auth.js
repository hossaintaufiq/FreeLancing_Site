const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  const { username, email, password, role_id } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    const hashed_pw = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)',
      [username, email, hashed_pw, role_id || 1]
    );
    res.json({ success: true, user_id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Username or email already exists.' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    const [rows] = await pool.execute(
      'SELECT user_id, username, password, role_id FROM users WHERE username = ?',
      [username]
    );
    const user = rows[0];
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ user_id: user.user_id, role_id: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ success: true, token, user_id: user.user_id, username: user.username, role_id: user.role_id });
    } else {
      res.status(401).json({ error: 'Invalid username or password.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 