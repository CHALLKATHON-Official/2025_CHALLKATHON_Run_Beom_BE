// routes/screentime.js
const express = require('express');
const router = express.Router();
const { saveScreenTime } = require('../controllers/screentimeController');

// POST /screentime
router.post('/', saveScreenTime);

module.exports = router;
