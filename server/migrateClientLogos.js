import { connectDB } from './db.js';
import Clientele from './models/Clientele.js';
import { clienteleSeed } from './seedData/clientele.js';

async function run() {
  await connectDB();
  const result = await Clientele.findOneAndUpdate(
    { singleton: 'clientele' },
    { $set: { portfolio: clienteleSeed.portfolio } },
    { upsert: true, new: true, runValidators: true },
  );
  const count = result.portfolio.reduce((total, sector) => total + sector.clients.length, 0);
  console.log(`[migrate:client-logos] Updated ${count} client logos across ${result.portfolio.length} sectors.`);
  await import('mongoose').then(({ default: mongoose }) => mongoose.connection.close());
}

run().catch(async (error) => {
  console.error('[migrate:client-logos] Failed', error);
  process.exitCode = 1;
  await import('mongoose').then(({ default: mongoose }) => mongoose.connection.close()).catch(() => {});
});