const prisma = require('../models/prisma');

// Public: GET /api/members
const getMembers = async (req, res, next) => {
  try {
    const members = await prisma.member.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    return res.status(200).json(members);
  } catch (err) {
    next(err);
  }
};

// Admin: POST /api/members
const createMember = async (req, res, next) => {
  try {
    const { name, role, department, quote, bio, photoUrl, instagramHandle, sortOrder } = req.body;

    if (!name || !role || !department || !photoUrl) {
      return res.status(400).json({ error: 'Name, role, department, and photoUrl are required.' });
    }

    const member = await prisma.member.create({
      data: {
        name,
        role,
        department,
        quote: quote || null,
        bio: bio || null,
        photoUrl,
        instagramHandle: instagramHandle || null,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : 0
      }
    });

    return res.status(201).json(member);
  } catch (err) {
    next(err);
  }
};

// Admin: PUT /api/members/:id
const updateMember = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid member ID.' });
    }

    const { name, role, department, quote, bio, photoUrl, instagramHandle, sortOrder } = req.body;
    console.log(`[DB Write] updateMember ID: ${id}, Payload:`, req.body);

    const updated = await prisma.member.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(role && { role }),
        ...(department && { department }),
        ...(quote !== undefined && { quote }),
        ...(bio !== undefined && { bio }),
        ...(photoUrl && { photoUrl }),
        ...(instagramHandle !== undefined && { instagramHandle }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) })
      }
    });

    console.log(`[DB Write] updateMember Success:`, updated);
    return res.status(200).json(updated);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Member not found.' });
    }
    next(err);
  }
};

// Admin: DELETE /api/members/:id
const deleteMember = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid member ID.' });
    }

    await prisma.member.delete({
      where: { id }
    });

    return res.status(200).json({ success: true, message: 'Member deleted successfully.' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Member not found.' });
    }
    next(err);
  }
};

module.exports = {
  getMembers,
  createMember,
  updateMember,
  deleteMember
};
