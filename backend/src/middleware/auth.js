const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'not authenticated' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId }});
    if (!user) return res.status(401).json({ error: 'invalid token' });
    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'not authenticated' });
  }
}

module.exports = { requireAuth };
