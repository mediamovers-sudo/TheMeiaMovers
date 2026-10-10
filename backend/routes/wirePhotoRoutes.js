const express = require('express');
const router = express.Router();
const {
  getWirePhotos,
  createWirePhoto,
  updateWirePhoto,
  deleteWirePhoto
} = require('../controllers/wirePhotoController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', getWirePhotos);
router.post('/', requireAdmin, createWirePhoto);
router.put('/:id', requireAdmin, updateWirePhoto);
router.delete('/:id', requireAdmin, deleteWirePhoto);

module.exports = router;
