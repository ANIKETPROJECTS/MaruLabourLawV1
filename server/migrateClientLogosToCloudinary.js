import fs from 'fs';
import path from 'path';
import { connectDB } from './db.js';
import cloudinary from './cloudinary.js';
import Clientele from './models/Clientele.js';
import { clienteleSeed } from './seedData/clientele.js';

function localPathFromUrl(url) {
  return path.resolve(process.cwd(), 'public', url.replace(/^\/+/, ''));
}

function publicIdFromUrl(url) {
  return path.basename(url, path.extname(url))
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

async function run() {
  await connectDB();

  const portfolio = [];
  for (const sector of clienteleSeed.portfolio) {
    const clients = [];
    for (const client of sector.clients) {
      const filePath = localPathFromUrl(client.logoUrl);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Missing logo asset: ${filePath}`);
      }

      const uploaded = await cloudinary.uploader.upload(filePath, {
        folder: 'labourcodes/client-logos',
        public_id: publicIdFromUrl(client.logoUrl),
        overwrite: true,
        resource_type: 'image',
      });
      clients.push({ ...client, logoUrl: uploaded.secure_url });
      console.log(`[migrate:cloudinary] Uploaded ${client.name}`);
    }
    portfolio.push({ ...sector, clients });
  }

  const result = await Clientele.findOneAndUpdate(
    { singleton: 'clientele' },
    { $set: { portfolio } },
    { upsert: true, new: true, runValidators: true },
  );
  const count = result.portfolio.reduce((total, sector) => total + sector.clients.length, 0);
  console.log(`[migrate:cloudinary] Saved ${count} Cloudinary logo URLs across ${result.portfolio.length} sectors.`);
  await import('mongoose').then(({ default: mongoose }) => mongoose.connection.close());
}

run().catch(async (error) => {
  console.error('[migrate:cloudinary] Failed', error);
  process.exitCode = 1;
  await import('mongoose').then(({ default: mongoose }) => mongoose.connection.close()).catch(() => {});
});