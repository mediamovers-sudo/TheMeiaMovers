const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { requireAdmin } = require('../middleware/auth');
const { publicFormLimiter } = require('../middleware/rateLimiter');

router.post('/', publicFormLimiter, submitApplication);
router.get('/', requireAdmin, getApplications);
router.patch('/:id', requireAdmin, updateApplicationStatus);

module.exports = router;
