const prisma = require('../models/prisma');

const DEFAULT_MEMBER_PHOTO = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

// Public: GET /api/members
const getMembers = async (req, res, next) => {
  try {
    const members = await prisma.member.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    return res.status(200).json(members);
  } catch (err) {
    console.error('[Member Route Error] GET /api/members failed:', err.message || err);
    next(err);
  }
};

// Admin: POST /api/members
const createMember = async (req, res) => {
  try {
    const { name, role, department, quote, bio, photoUrl, instagramHandle, sortOrder } = req.body;

    if (!name || !name.trim() || !role || !role.trim() || !department || !department.trim()) {
      return res.status(400).json({ error: 'Name, role, and department are required fields.' });
    }

    const cleanPhotoUrl = (photoUrl && photoUrl.trim()) ? photoUrl.trim() : DEFAULT_MEMBER_PHOTO;
    const cleanSortOrder = (sortOrder !== undefined && !isNaN(parseInt(sortOrder, 10))) ? parseInt(sortOrder, 10) : 0;

    const member = await prisma.member.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        department: department.trim(),
        quote: (quote && quote.trim()) ? quote.trim() : null,
        bio: (bio && bio.trim()) ? bio.trim() : null,
        photoUrl: cleanPhotoUrl,
        instagramHandle: (instagramHandle && instagramHandle.trim()) ? instagramHandle.trim() : null,
        sortOrder: cleanSortOrder
      }
    });

    console.log(`[Member Route Success] POST /api/members created member ID ${member.id}`);
    return res.status(201).json(member);
  } catch (err) {
    console.error('[Member Route Error] POST /api/members failed:', err.message || err);
    return res.status(500).json({
      error: 'Failed to create member: ' + (err.message || 'Unknown database error')
    });
  }
};

// Admin: PUT /api/members/:id
const updateMember = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid member ID: must be an integer.' });
  }

  try {
    const { name, role, department, quote, bio, photoUrl, instagramHandle, sortOrder } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (role !== undefined) updateData.role = role.trim();
    if (department !== undefined) updateData.department = department.trim();
    if (photoUrl !== undefined) {
      updateData.photoUrl = photoUrl.trim() ? photoUrl.trim() : DEFAULT_MEMBER_PHOTO;
    }
    if (quote !== undefined) updateData.quote = quote.trim() ? quote.trim() : null;
    if (bio !== undefined) updateData.bio = bio.trim() ? bio.trim() : null;
    if (instagramHandle !== undefined) updateData.instagramHandle = instagramHandle.trim() ? instagramHandle.trim() : null;
    if (sortOrder !== undefined) {
      updateData.sortOrder = isNaN(parseInt(sortOrder, 10)) ? 0 : parseInt(sortOrder, 10);
    }

    const updated = await prisma.member.update({
      where: { id },
      data: updateData
    });

    console.log(`[Member Route Success] PUT /api/members/${id} updated member`);
    return res.status(200).json(updated);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: `Member not found with ID ${id}.` });
    }
    console.error(`[Member Route Error] PUT /api/members/${id} failed:`, err.message || err);
    return res.status(500).json({
      error: 'Failed to update member: ' + (err.message || 'Unknown database error')
    });
  }
};

// Admin: DELETE /api/members/:id
const deleteMember = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid member ID: must be an integer.' });
  }

  try {
    await prisma.member.delete({
      where: { id }
    });

    console.log(`[Member Route Success] DELETE /api/members/${id} deleted member`);
    return res.status(200).json({ success: true, message: 'Member deleted successfully.' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: `Member not found with ID ${id}.` });
    }
    console.error(`[Member Route Error] DELETE /api/members/${id} failed:`, err.message || err);
    return res.status(500).json({
      error: 'Failed to delete member: ' + (err.message || 'Unknown database error')
    });
  }
};

module.exports = {
  getMembers,
  createMember,
  updateMember,
  deleteMember
};
