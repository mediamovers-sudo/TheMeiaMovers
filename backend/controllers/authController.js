const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../models/prisma');
const { JWT_SECRET, NODE_ENV } = require('../config/env');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid administrative credentials.' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid administrative credentials.' });
    }

    // Sign JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set token in httpOnly, secure, sameSite cookie — never returned in JSON body
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      user: {
        email: admin.email
      }
    });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('token', {
    path: '/',
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax'
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

const me = async (req, res, next) => {
  try {
    return res.status(200).json({
      authenticated: true,
      user: {
        email: req.admin.email
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  logout,
  me
};
