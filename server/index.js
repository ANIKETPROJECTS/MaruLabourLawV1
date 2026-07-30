import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import homeRoutes from './routes/home.js';
import servicesRoutes from './routes/services.js';
import careersRoutes from './routes/careers.js';
import resourcesRoutes from './routes/resources.js';
import uploadRoutes from './routes/upload.js';
import aboutRoutes from './routes/about.js';
import clienteleRoutes from './routes/clientele.js';
import contactRoutes from './routes/contact.js';
import careersPageRoutes from './routes/careersPage.js';
import resourcesPageRoutes from './routes/resourcesPage.js';
import applicationsRoutes from './routes/applications.js';
import enquiriesRoutes from './routes/enquiries.js';
import knowledgeCentreRoutes from './routes/knowledgeCentre.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.API_PORT || 8787;

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/clientele', clienteleRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/careers-page', careersPageRoutes);
app.use('/api/resources-page', resourcesPageRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/knowledge-centre', knowledgeCentreRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// In production, serve the built frontend from this same process/port.
const distDir = path.resolve(__dirname, '..', 'dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[server] API listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[server] Failed to connect to MongoDB', err);
    process.exit(1);
  });
