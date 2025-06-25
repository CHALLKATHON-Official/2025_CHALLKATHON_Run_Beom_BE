const express = require('express');
const router  = express.Router();
const { saveGoal, getGoal } = require('../controllers/goalController');
const authMiddleware        = require('../middleware/auth');  

router.post('/', authMiddleware, saveGoal);
router.get ('/', authMiddleware, getGoal);

module.exports = router;
