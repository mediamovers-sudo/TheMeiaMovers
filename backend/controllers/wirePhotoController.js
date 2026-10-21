const prisma = require('../models/prisma');

const DEFAULT_WIRE_PHOTO = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80';

// Public: GET /api/wire-photos
const getWirePhotos = async (req, res, next) => {
  try {
    const wirePhotos = await prisma.wirePhoto.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    return res.status(200).json(wirePhotos);
  } catch (err) {
    console.error('[WirePhoto Route Error] GET /api/wire-photos failed:', err.message || err);
    next(err);
  }
};

// Admin: POST /api/wire-photos
const createWirePhoto = async (req, res) => {
  try {
    const { imageUrl, title, description, reelTag, sortOrder } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is a required field.' });
    }

    const cleanImageUrl = (imageUrl && imageUrl.trim()) ? imageUrl.trim() : DEFAULT_WIRE_PHOTO;
    const cleanSortOrder = (sortOrder !== undefined && !isNaN(parseInt(sortOrder, 10))) ? parseInt(sortOrder, 10) : 0;

    const wirePhoto = await prisma.wirePhoto.create({
      data: {
        imageUrl: cleanImageUrl,
        title: title.trim(),
        description: (description && description.trim()) ? description.trim() : null,
        reelTag: (reelTag && reelTag.trim()) ? reelTag.trim() : null,
        sortOrder: cleanSortOrder
      }
    });

    console.log(`[WirePhoto Route Success] POST /api/wire-photos created wire photo ID ${wirePhoto.id}`);
    return res.status(201).json(wirePhoto);
  } catch (err) {
    console.error('[WirePhoto Route Error] POST /api/wire-photos failed:', err.message || err);
    return res.status(500).json({
      error: 'Failed to create wire photo: ' + (err.message || 'Unknown database error')
    });
  }
};

// Admin: PUT /api/wire-photos/:id
const updateWirePhoto = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid wire photo ID: must be an integer.' });
  }

  try {
    const { imageUrl, title, description, reelTag, sortOrder } = req.body;
    const updateData = {};

    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl.trim() ? imageUrl.trim() : DEFAULT_WIRE_PHOTO;
    }
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim() ? description.trim() : null;
    if (reelTag !== undefined) updateData.reelTag = reelTag.trim() ? reelTag.trim() : null;
    if (sortOrder !== undefined) {
      updateData.sortOrder = isNaN(parseInt(sortOrder, 10)) ? 0 : parseInt(sortOrder, 10);
    }

    const updated = await prisma.wirePhoto.update({
      where: { id },
      data: updateData
    });

    console.log(`[WirePhoto Route Success] PUT /api/wire-photos/${id} updated wire photo`);
    return res.status(200).json(updated);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: `Wire photo not found with ID ${id}.` });
    }
    console.error(`[WirePhoto Route Error] PUT /api/wire-photos/${id} failed:`, err.message || err);
    return res.status(500).json({
      error: 'Failed to update wire photo: ' + (err.message || 'Unknown database error')
    });
  }
};

// Admin: DELETE /api/wire-photos/:id
const deleteWirePhoto = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid wire photo ID: must be an integer.' });
  }

  try {
    await prisma.wirePhoto.delete({
      where: { id }
    });

    console.log(`[WirePhoto Route Success] DELETE /api/wire-photos/${id} deleted wire photo`);
    return res.status(200).json({ success: true, message: 'Wire photo deleted successfully.' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: `Wire photo not found with ID ${id}.` });
    }
    console.error(`[WirePhoto Route Error] DELETE /api/wire-photos/${id} failed:`, err.message || err);
    return res.status(500).json({
      error: 'Failed to delete wire photo: ' + (err.message || 'Unknown database error')
    });
  }
};

module.exports = {
  getWirePhotos,
  createWirePhoto,
  updateWirePhoto,
  deleteWirePhoto
};
