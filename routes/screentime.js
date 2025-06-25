const express = require('express');
const router = express.Router();
const { saveScreenTime } = require('../controllers/screentimeController');

router.post('/', saveScreenTime);

module.exports = router;