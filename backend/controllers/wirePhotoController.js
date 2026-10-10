const prisma = require('../models/prisma');

// Public: GET /api/wire-photos
const getWirePhotos = async (req, res, next) => {
  try {
    const wirePhotos = await prisma.wirePhoto.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    return res.status(200).json(wirePhotos);
  } catch (err) {
    next(err);
  }
};

// Admin: POST /api/wire-photos
const createWirePhoto = async (req, res, next) => {
  try {
    const { imageUrl, title, description, reelTag, sortOrder } = req.body;

    if (!imageUrl || !title) {
      return res.status(400).json({ error: 'ImageUrl and title are required.' });
    }

    const wirePhoto = await prisma.wirePhoto.create({
      data: {
        imageUrl,
        title,
        description: description || null,
        reelTag: reelTag || null,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : 0
      }
    });

    return res.status(201).json(wirePhoto);
  } catch (err) {
    next(err);
  }
};

// Admin: PUT /api/wire-photos/:id
const updateWirePhoto = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid wire photo ID.' });
    }

    const { imageUrl, title, description, reelTag, sortOrder } = req.body;

    const updated = await prisma.wirePhoto.update({
      where: { id },
      data: {
        ...(imageUrl && { imageUrl }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(reelTag !== undefined && { reelTag }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) })
      }
    });

    return res.status(200).json(updated);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Wire photo not found.' });
    }
    next(err);
  }
};

// Admin: DELETE /api/wire-photos/:id
const deleteWirePhoto = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid wire photo ID.' });
    }

    await prisma.wirePhoto.delete({
      where: { id }
    });

    return res.status(200).json({ success: true, message: 'Wire photo deleted successfully.' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Wire photo not found.' });
    }
    next(err);
  }
};

module.exports = {
  getWirePhotos,
  createWirePhoto,
  updateWirePhoto,
  deleteWirePhoto
};
