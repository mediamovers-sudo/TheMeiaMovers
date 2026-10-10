const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const { uploadMiddleware, handleUpload } = require('../controllers/uploadController');

router.post('/', requireAdmin, uploadMiddleware, handleUpload);

module.exports = router;
