// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 📌 /screentime 라우터 불러오기
const screentimeRoutes = require('./routes/screentime');
app.use('/screentime', screentimeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

const statusRoutes = require('./routes/status');
app.use('/status', statusRoutes);

const rankingRoutes = require('./routes/ranking');
app.use('/ranking', rankingRoutes);
