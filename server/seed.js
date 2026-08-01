// One-off migration script: populates MongoDB with the site's existing
// hardcoded Home / Services / Careers content, and creates the initial
// admin user. Safe to re-run — it only fills in missing documents.
import bcrypt from 'bcryptjs';
import { connectDB } from './db.js';
import Admin from './models/Admin.js';
import Home from './models/Home.js';
import About from './models/About.js';
import Clientele from './models/Clientele.js';
import Service from './models/Service.js';
import Career from './models/Career.js';
import Resource from './models/Resource.js';
import { servicesSeed } from './seedData/services.js';
import { careersSeed } from './seedData/careers.js';
import { homeSeed } from './seedData/home.js';
import { aboutSeed } from './seedData/about.js';
import { clienteleSeed } from './seedData/clientele.js';
import { resourcesSeed } from './seedData/resources.js';
import KnowledgeCentre from './models/KnowledgeCentre.js';
import KnowledgeArticle from './models/KnowledgeArticle.js';
import { knowledgeCentrePageSeed, knowledgeArticlesSeed } from './seedData/knowledgeCentre.js';
import LabourCode from './models/LabourCode.js';
import { labourCodesSeed } from './seedData/labourCodes.js';

async function run() {
  await connectDB();

  // Admin user
  const username = (process.env.SEED_ADMIN_USERNAME || 'admin').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const existingAdmin = await Admin.findOne({ username });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ username, passwordHash });
    console.log(`[seed] Created admin user "${username}"`);
  } else {
    console.log(`[seed] Admin user "${username}" already exists — skipped`);
  }

  // Home content
  const existingHome = await Home.findOne({ singleton: 'home' });
  if (!existingHome) {
    await Home.create({ singleton: 'home', ...homeSeed });
    console.log('[seed] Created Home content');
  } else {
    console.log('[seed] Home content already exists — skipped');
  }

  // About content
  const existingAbout = await About.findOne({ singleton: 'about' });
  if (!existingAbout) {
    await About.create({ singleton: 'about', ...aboutSeed });
    console.log('[seed] Created About content');
  } else {
    console.log('[seed] About content already exists — skipped');
  }

  // Clientele content
  const existingClientele = await Clientele.findOne({ singleton: 'clientele' });
  if (!existingClientele) {
    await Clientele.create({ singleton: 'clientele', ...clienteleSeed });
    console.log('[seed] Created Clientele content');
  } else {
    console.log('[seed] Clientele content already exists — skipped');
  }

  // Services
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany(servicesSeed);
    console.log(`[seed] Inserted ${servicesSeed.length} services`);
  } else {
    console.log('[seed] Services already exist — skipped');
  }

  // Careers
  const careerCount = await Career.countDocuments();
  if (careerCount === 0) {
    await Career.insertMany(careersSeed);
    console.log(`[seed] Inserted ${careersSeed.length} careers`);
  } else {
    console.log('[seed] Careers already exist — skipped');
  }

  // Resources
  const resourceCount = await Resource.countDocuments();
  if (resourceCount === 0) {
    await Resource.insertMany(resourcesSeed);
    console.log(`[seed] Inserted ${resourcesSeed.length} resources`);
  } else {
    console.log('[seed] Resources already exist — skipped');
  }

  // Knowledge Centre page content
  const existingKC = await KnowledgeCentre.findOne({ singleton: 'knowledge-centre' });
  if (!existingKC) {
    await KnowledgeCentre.create({ singleton: 'knowledge-centre', ...knowledgeCentrePageSeed });
    console.log('[seed] Created Knowledge Centre page content');
  } else {
    console.log('[seed] Knowledge Centre page content already exists — skipped');
  }

  // Knowledge Centre articles
  const kcArticleCount = await KnowledgeArticle.countDocuments();
  if (kcArticleCount === 0) {
    await KnowledgeArticle.insertMany(knowledgeArticlesSeed);
    console.log(`[seed] Inserted ${knowledgeArticlesSeed.length} knowledge centre articles`);
  } else {
    console.log('[seed] Knowledge Centre articles already exist — skipped');
  }

  // Labour Codes
  const labourCodeCount = await LabourCode.countDocuments();
  if (labourCodeCount === 0) {
    await LabourCode.insertMany(labourCodesSeed);
    console.log(`[seed] Inserted ${labourCodesSeed.length} labour codes`);
  } else {
    console.log('[seed] Labour codes already exist — skipped');
  }

  console.log('[seed] Done.');
  process.exit(0);
}

run().catch((err) => {
  console.error('[seed] Failed', err);
  process.exit(1);
});
