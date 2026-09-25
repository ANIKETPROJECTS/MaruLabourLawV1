import { Router } from 'express';
import Footer from '../models/Footer.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const LEGACY_SOCIAL_FIELDS = {
  whatsapp: 'whatsappUrl',
  instagram: 'instagramUrl',
  linkedin: 'linkedinUrl',
  facebook: 'facebookUrl',
  twitter: 'twitterUrl',
};

function serializeFooter(doc) {
  const result = doc.toObject();

  // Older footer documents only have one URL field per platform. Expose those
  // values in the new collection format until an admin explicitly configures it.
  if (!result.socialLinksConfigured && !result.socialLinks?.length) {
    result.socialLinks = Object.entries(LEGACY_SOCIAL_FIELDS)
      .map(([platform, field]) => ({
        platform,
        href: result[field] || '',
        enabled: Boolean(result[field]),
      }))
      .filter((link) => link.href);
  }

  return result;
}

// Public GET
router.get('/', async (req, res) => {
  try {
    let doc = await Footer.findOne({ singleton: 'footer' });
    if (!doc) doc = await Footer.create({ singleton: 'footer' });
    res.json(serializeFooter(doc));
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
    if (Array.isArray(req.body.socialLinks)) {
      const seenPlatforms = new Set();
      update.socialLinks = req.body.socialLinks
        .filter((link) => link && LEGACY_SOCIAL_FIELDS[link.platform] && !seenPlatforms.has(link.platform) && seenPlatforms.add(link.platform))
        .map((link) => ({
          platform: link.platform,
          href: typeof link.href === 'string' ? link.href.trim() : '',
          enabled: link.enabled !== false,
        }));
      update.socialLinksConfigured = true;

      // Keep the old URL fields in sync for compatibility with any older page
      // code or integrations that still consume them.
      for (const [platform, field] of Object.entries(LEGACY_SOCIAL_FIELDS)) {
        const socialLink = update.socialLinks.find((link) => link.platform === platform);
        update[field] = socialLink?.enabled ? socialLink.href : '';
      }
    }
    const doc = await Footer.findOneAndUpdate(
      { singleton: 'footer' },
      { $set: update },
      { new: true, upsert: true }
    );
    res.json(serializeFooter(doc));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save footer content' });
  }
});

export default router;
