const express = require('express');
const router = express.Router();
const {
  getMembers,
  createMember,
  updateMember,
  deleteMember
} = require('../controllers/memberController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', getMembers);
router.post('/', requireAdmin, createMember);
router.put('/:id', requireAdmin, updateMember);
router.delete('/:id', requireAdmin, deleteMember);

module.exports = router;
