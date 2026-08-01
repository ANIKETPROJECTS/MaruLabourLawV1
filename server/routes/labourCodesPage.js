import express from 'express';
import LabourCodesPage from '../models/LabourCodesPage.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let doc = await LabourCodesPage.findOne({ singleton: 'labour-codes-page' });
    if (!doc) doc = await LabourCodesPage.create({ singleton: 'labour-codes-page' });
    res.json(doc);
  } catch (err) {
    console.error('[labour-codes-page/get]', err);
    res.status(500).json({ error: 'Failed to load labour codes page content' });
  }
});

router.put('/', requireAuth, async (req, res) => {
  try {
    const update = { ...req.body };
    delete update._id;
    delete update.singleton;
    delete update.createdAt;
    delete update.updatedAt;
    const doc = await LabourCodesPage.findOneAndUpdate(
      { singleton: 'labour-codes-page' },
      { $set: update },
      { new: true, upsert: true },
    );
    res.json(doc);
  } catch (err) {
    console.error('[labour-codes-page/put]', err);
    res.status(500).json({ error: 'Failed to update labour codes page content' });
  }
});

export default router;
