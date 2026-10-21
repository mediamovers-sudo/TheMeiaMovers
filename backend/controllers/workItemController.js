const prisma = require('../models/prisma');

const DEFAULT_WORK_THUMBNAIL = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80';

// Public: GET /api/work-items
const getWorkItems = async (req, res, next) => {
  try {
    const workItems = await prisma.workItem.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    return res.status(200).json(workItems);
  } catch (err) {
    console.error('[WorkItem Route Error] GET /api/work-items failed:', err.message || err);
    next(err);
  }
};

// Admin: POST /api/work-items
const createWorkItem = async (req, res) => {
  try {
    const { title, thumbnailUrl, category, videoUrl, description, sortOrder } = req.body;

    if (!title || !title.trim() || !category || !category.trim()) {
      return res.status(400).json({ error: 'Title and category are required fields.' });
    }

    const cleanThumbnailUrl = (thumbnailUrl && thumbnailUrl.trim()) ? thumbnailUrl.trim() : DEFAULT_WORK_THUMBNAIL;
    const cleanSortOrder = (sortOrder !== undefined && !isNaN(parseInt(sortOrder, 10))) ? parseInt(sortOrder, 10) : 0;

    const workItem = await prisma.workItem.create({
      data: {
        title: title.trim(),
        thumbnailUrl: cleanThumbnailUrl,
        category: category.trim(),
        videoUrl: (videoUrl && videoUrl.trim()) ? videoUrl.trim() : null,
        description: (description && description.trim()) ? description.trim() : null,
        sortOrder: cleanSortOrder
      }
    });

    console.log(`[WorkItem Route Success] POST /api/work-items created work item ID ${workItem.id}`);
    return res.status(201).json(workItem);
  } catch (err) {
    console.error('[WorkItem Route Error] POST /api/work-items failed:', err.message || err);
    return res.status(500).json({
      error: 'Failed to create work item: ' + (err.message || 'Unknown database error')
    });
  }
};

// Admin: PUT /api/work-items/:id
const updateWorkItem = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid work item ID: must be an integer.' });
  }

  try {
    const { title, thumbnailUrl, category, videoUrl, description, sortOrder } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title.trim();
    if (thumbnailUrl !== undefined) {
      updateData.thumbnailUrl = thumbnailUrl.trim() ? thumbnailUrl.trim() : DEFAULT_WORK_THUMBNAIL;
    }
    if (category !== undefined) updateData.category = category.trim();
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl.trim() ? videoUrl.trim() : null;
    if (description !== undefined) updateData.description = description.trim() ? description.trim() : null;
    if (sortOrder !== undefined) {
      updateData.sortOrder = isNaN(parseInt(sortOrder, 10)) ? 0 : parseInt(sortOrder, 10);
    }

    const updated = await prisma.workItem.update({
      where: { id },
      data: updateData
    });

    console.log(`[WorkItem Route Success] PUT /api/work-items/${id} updated work item`);
    return res.status(200).json(updated);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: `Work item not found with ID ${id}.` });
    }
    console.error(`[WorkItem Route Error] PUT /api/work-items/${id} failed:`, err.message || err);
    return res.status(500).json({
      error: 'Failed to update work item: ' + (err.message || 'Unknown database error')
    });
  }
};

// Admin: DELETE /api/work-items/:id
const deleteWorkItem = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid work item ID: must be an integer.' });
  }

  try {
    await prisma.workItem.delete({
      where: { id }
    });

    console.log(`[WorkItem Route Success] DELETE /api/work-items/${id} deleted work item`);
    return res.status(200).json({ success: true, message: 'Work item deleted successfully.' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: `Work item not found with ID ${id}.` });
    }
    console.error(`[WorkItem Route Error] DELETE /api/work-items/${id} failed:`, err.message || err);
    return res.status(500).json({
      error: 'Failed to delete work item: ' + (err.message || 'Unknown database error')
    });
  }
};

module.exports = {
  getWorkItems,
  createWorkItem,
  updateWorkItem,
  deleteWorkItem
};
