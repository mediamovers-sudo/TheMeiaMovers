const prisma = require('../models/prisma');

// Public: GET /api/work-items
const getWorkItems = async (req, res, next) => {
  try {
    const workItems = await prisma.workItem.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    return res.status(200).json(workItems);
  } catch (err) {
    next(err);
  }
};

// Admin: POST /api/work-items
const createWorkItem = async (req, res, next) => {
  try {
    const { title, thumbnailUrl, category, videoUrl, description, sortOrder } = req.body;

    if (!title || !thumbnailUrl || !category) {
      return res.status(400).json({ error: 'Title, thumbnailUrl, and category are required.' });
    }

    const workItem = await prisma.workItem.create({
      data: {
        title,
        thumbnailUrl,
        category,
        videoUrl: videoUrl || null,
        description: description || null,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : 0
      }
    });

    return res.status(201).json(workItem);
  } catch (err) {
    next(err);
  }
};

// Admin: PUT /api/work-items/:id
const updateWorkItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid work item ID.' });
    }

    const { title, thumbnailUrl, category, videoUrl, description, sortOrder } = req.body;

    const updated = await prisma.workItem.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(thumbnailUrl && { thumbnailUrl }),
        ...(category && { category }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(description !== undefined && { description }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) })
      }
    });

    return res.status(200).json(updated);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Work item not found.' });
    }
    next(err);
  }
};

// Admin: DELETE /api/work-items/:id
const deleteWorkItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid work item ID.' });
    }

    await prisma.workItem.delete({
      where: { id }
    });

    return res.status(200).json({ success: true, message: 'Work item deleted successfully.' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Work item not found.' });
    }
    next(err);
  }
};

module.exports = {
  getWorkItems,
  createWorkItem,
  updateWorkItem,
  deleteWorkItem
};
