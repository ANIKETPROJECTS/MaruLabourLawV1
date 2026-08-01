import { Router } from 'express';
import Footer from '../models/Footer.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public GET
router.get('/', async (req, res) => {
  try {
    let doc = await Footer.findOne({ singleton: 'footer' });
    if (!doc) doc = await Footer.create({ singleton: 'footer' });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load footer content' });
  }
});

// Protected PUT
router.put('/', requireAuth, async (req, res) => {
  try {
    const update = { ...req.body };
    delete update._id;
    delete update.singleton;
    delete update.createdAt;
    delete update.updatedAt;
    delete update.__v;
    const doc = await Footer.findOneAndUpdate(
      { singleton: 'footer' },
      { $set: update },
      { new: true, upsert: true }
    );
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save footer content' });
  }
});

export default router;
