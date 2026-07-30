import express from 'express';
import KnowledgeCentre from '../models/KnowledgeCentre.js';
import KnowledgeArticle from '../models/KnowledgeArticle.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

/* ── Page singleton ─────────────────────────────────────────── */

router.get('/page', async (req, res) => {
  try {
    let doc = await KnowledgeCentre.findOne({ singleton: 'knowledge-centre' });
    if (!doc) doc = await KnowledgeCentre.create({ singleton: 'knowledge-centre' });
    res.json(doc);
  } catch (err) {
    console.error('[knowledge-centre/page GET]', err);
    res.status(500).json({ error: 'Failed to load page content' });
  }
});

router.put('/page', requireAuth, async (req, res) => {
  try {
    const update = { ...req.body };
    delete update._id;
    delete update.singleton;
    delete update.createdAt;
    delete update.updatedAt;
    const doc = await KnowledgeCentre.findOneAndUpdate(
      { singleton: 'knowledge-centre' },
      { $set: update },
      { new: true, upsert: true }
    );
    res.json(doc);
  } catch (err) {
    console.error('[knowledge-centre/page PUT]', err);
    res.status(500).json({ error: 'Failed to save page content' });
  }
});

/* ── Articles collection ────────────────────────────────────── */

router.get('/articles', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === 'true') filter.featured = true;
    const docs = await KnowledgeArticle.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error('[knowledge-centre/articles GET]', err);
    res.status(500).json({ error: 'Failed to load articles' });
  }
});

router.get('/articles/slug/:slug', async (req, res) => {
  try {
    const doc = await KnowledgeArticle.findOne({ slug: req.params.slug });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load article' });
  }
});

router.get('/articles/:id', async (req, res) => {
  try {
    const doc = await KnowledgeArticle.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load article' });
  }
});

router.post('/articles', requireAuth, async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.slug) delete body.slug;
    const doc = await KnowledgeArticle.create(body);
    res.status(201).json(doc);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Slug already exists' });
    console.error('[knowledge-centre/articles POST]', err);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

router.put('/articles/:id', requireAuth, async (req, res) => {
  try {
    const update = { ...req.body };
    delete update._id;
    if (!update.slug) delete update.slug;
    const doc = await KnowledgeArticle.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Slug already exists' });
    console.error('[knowledge-centre/articles PUT]', err);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

router.delete('/articles/:id', requireAuth, async (req, res) => {
  try {
    const doc = await KnowledgeArticle.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('[knowledge-centre/articles DELETE]', err);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

export default router;
