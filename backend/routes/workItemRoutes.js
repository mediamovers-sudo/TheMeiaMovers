const express = require('express');
const router = express.Router();
const {
  getWorkItems,
  createWorkItem,
  updateWorkItem,
  deleteWorkItem
} = require('../controllers/workItemController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', getWorkItems);
router.post('/', requireAdmin, createWorkItem);
router.put('/:id', requireAdmin, updateWorkItem);
router.delete('/:id', requireAdmin, deleteWorkItem);

module.exports = router;
