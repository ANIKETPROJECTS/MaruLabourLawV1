import express from 'express';
import LabourCode from '../models/LabourCode.js';
import { requireAuth } from '../middleware/auth.js';
import { deleteCloudinaryAssets } from '../cloudinaryUtils.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const codes = await LabourCode.find().sort({ order: 1, createdAt: 1 });
    res.json(codes);
  } catch (err) {
    console.error('[labour-codes/list]', err);
    res.status(500).json({ error: 'Failed to load labour codes' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const code = await LabourCode.findOne({ slug: req.params.slug });
    if (!code) return res.status(404).json({ error: 'Labour code not found' });
    res.json(code);
  } catch (err) {
    console.error('[labour-codes/get]', err);
    res.status(500).json({ error: 'Failed to load labour code' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const code = await LabourCode.create(req.body);
    res.status(201).json(code);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Slug already exists' });
    console.error('[labour-codes/create]', err);
    res.status(500).json({ error: 'Failed to create labour code' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const update = { ...req.body };
    delete update._id;
    const code = await LabourCode.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!code) return res.status(404).json({ error: 'Labour code not found' });
    res.json(code);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Slug already exists' });
    console.error('[labour-codes/update]', err);
    res.status(500).json({ error: 'Failed to update labour code' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const code = await LabourCode.findByIdAndDelete(req.params.id);
    if (!code) return res.status(404).json({ error: 'Labour code not found' });
    await deleteCloudinaryAssets([code.img]);
    res.json({ ok: true });
  } catch (err) {
    console.error('[labour-codes/delete]', err);
    res.status(500).json({ error: 'Failed to delete labour code' });
  }
});

export default router;
