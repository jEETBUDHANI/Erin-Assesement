const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { requireAuth } = require('../middleware/auth');

// Create lead
router.post('/', requireAuth, async (req, res) => {
  try {
    const data = req.body;
    const lead = await prisma.lead.create({ data });
    res.status(201).json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Read leads with pagination and filtering
router.get('/', requireAuth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(100, parseInt(req.query.limit || '20'));
    const skip = (page - 1) * limit;

    // build where clause
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.source) where.source = req.query.source;
    if (req.query.is_qualified) where.is_qualified = req.query.is_qualified === 'true';
    if (req.query.min_score) where.score = { gte: parseInt(req.query.min_score) };
    if (req.query.q) {
      const q = req.query.q;
      where.OR = [
        { first_name: { contains: q, mode: 'insensitive' } },
        { last_name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { company: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await prisma.$transaction([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lead.count({ where }),
    ]);

    res.json({
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Get single lead
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: req.params.id }});
    if (!lead) return res.status(404).json({ error: 'not found' });
    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Update lead
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Delete lead
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id }});
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
