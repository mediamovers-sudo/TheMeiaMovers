const express = require('express');
const router = express.Router();
const { login, logout, me } = require('../controllers/authController');
const { requireAdmin } = require('../middleware/auth');
const { loginRateLimiter } = require('../middleware/rateLimiter');

router.post('/login', loginRateLimiter, login);
router.post('/logout', logout);
router.get('/me', requireAdmin, me);

module.exports = router;
