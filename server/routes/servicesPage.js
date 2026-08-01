import express from 'express';
import ServicesPage from '../models/ServicesPage.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let page = await ServicesPage.findOne({ singleton: 'services-page' });
    if (!page) {
      page = await ServicesPage.create({ singleton: 'services-page' });
    }
    res.json(page);
  } catch (err) {
    console.error('[services-page/get]', err);
    res.status(500).json({ error: 'Failed to load services page content' });
  }
});

router.put('/', requireAuth, async (req, res) => {
  try {
    const update = { ...req.body };
    delete update._id;
    delete update.singleton;
    const page = await ServicesPage.findOneAndUpdate(
      { singleton: 'services-page' },
      update,
      { new: true, upsert: true },
    );
    res.json(page);
  } catch (err) {
    console.error('[services-page/update]', err);
    res.status(500).json({ error: 'Failed to update services page content' });
  }
});

export default router;
