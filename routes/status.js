const express = require('express');
const router = express.Router();
const { getTodayStatus } = require('../controllers/statusController');

router.get('/:userId', getTodayStatus);

module.exports = router;