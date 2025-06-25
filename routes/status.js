// routes/status.js
const express = require('express');
const router = express.Router();
const { getTodayStatus } = require('../controllers/statusController');

// GET /status/:userId
router.get('/:userId', getTodayStatus);

module.exports = router;
