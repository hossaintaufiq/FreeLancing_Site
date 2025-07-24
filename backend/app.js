// app.js - Main server for SkillLink backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const gigsRoutes = require('./routes/gigs');
const ordersRoutes = require('./routes/orders');
const messagesRoutes = require('./routes/messages');
const categoriesRoutes = require('./routes/categories');

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/categories', categoriesRoutes);

app.get('/', (req, res) => {
  res.send('SkillLink API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
