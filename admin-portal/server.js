import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORTAL_PORT || 5000;

// ─── Mongo ────────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://darexmucheri:cMd7EoTwGglJGXwR@cluster0.uwf6z.mongodb.net/fun?retryWrites=true&w=majority&appName=Cluster0';

const materialSchema = new mongoose.Schema({
  category:   { type: String, required: true, enum: ['syllabus', 'paper', 'textbook', 'marking_scheme'] },
  level:      { type: String, required: true },
  grade:      { type: String, default: '' },
  subject:    { type: String, required: true },
  title:      { type: String, required: true },
  url:        { type: String, required: true },
  mimeType:   { type: String, default: 'application/pdf' },
  fileSize:   { type: Number, default: 0 },
  uploadedBy: { type: String, default: 'admin-portal' },
  approved:   { type: Boolean, default: true },
  approvedBy: { type: String, default: 'admin-portal' },
  year:       { type: String, default: '' },
}, { timestamps: true });

const MaterialModel = mongoose.models?.Material || mongoose.model('Material', materialSchema);

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(e => console.error('❌ MongoDB error:', e.message));

// ─── CDN ──────────────────────────────────────────────────────────────────────
const CDN_BASE    = 'https://media.mrfrankofc.gleeze.com';
const CDN_API_KEY = 'subzero';

async function uploadToCDN(buffer, filename, mimeType, cdnPath = 'fundo/materials/') {
  const safeFilename = filename.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
  const formData = new FormData();
  const blob = new Blob([buffer], { type: mimeType });
  formData.append('file', blob, safeFilename);
  formData.append('path', cdnPath);
  const response = await fetch(`${CDN_BASE}/upload`, {
    method: 'POST',
    headers: { 'X-API-Key': CDN_API_KEY },
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!data?.success) throw new Error(data?.message || 'CDN upload failed');
  return data.cdnUrl || data.url || data.fileUrl || '';
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
const ADMIN_USER = process.env.ADMIN_USERNAME || 'mrfrankofc';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'darex@123';

function requireAuth(req, res, next) {
  const auth = req.headers['x-admin-token'];
  if (auth === `${ADMIN_USER}:${ADMIN_PASS}`) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

// ─── Multer (memory storage) ──────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB per file
});

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Auth endpoint ────────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ token: `${ADMIN_USER}:${ADMIN_PASS}` });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ─── GET /api/materials ───────────────────────────────────────────────────────
app.get('/api/materials', requireAuth, async (req, res) => {
  try {
    const { category, level, subject, search, page = 1, limit = 30 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (level)    query.level    = level;
    if (subject)  query.subject  = new RegExp(subject, 'i');
    if (search)   query.$or = [
      { title:   new RegExp(search, 'i') },
      { subject: new RegExp(search, 'i') },
    ];

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await MaterialModel.countDocuments(query);
    const items = await MaterialModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── POST /api/materials/upload ───────────────────────────────────────────────
app.post('/api/materials/upload', requireAuth, upload.array('files', 20), async (req, res) => {
  try {
    const { category, level, grade, subject, year, titles } = req.body;
    const titlesArr = Array.isArray(titles) ? titles : (titles ? [titles] : []);
    const files = req.files || [];

    if (!files.length) return res.status(400).json({ error: 'No files provided' });

    const results = [];
    const errors  = [];

    for (let i = 0; i < files.length; i++) {
      const file  = files[i];
      const title = titlesArr[i] || file.originalname.replace(/\.[^.]+$/, '');
      try {
        const cdnUrl = await uploadToCDN(file.buffer, file.originalname, file.mimetype);
        const mat = await MaterialModel.create({
          category,
          level,
          grade:      grade || '',
          subject,
          title,
          url:        cdnUrl,
          mimeType:   file.mimetype,
          fileSize:   file.size,
          uploadedBy: 'admin-portal',
          approved:   true,
          approvedBy: 'admin-portal',
          year:       year || '',
        });
        results.push(mat);
      } catch (e) {
        errors.push({ file: file.originalname, error: e.message });
      }
    }

    res.json({ uploaded: results.length, errors, results });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── PATCH /api/materials/:id ─────────────────────────────────────────────────
app.patch('/api/materials/:id', requireAuth, async (req, res) => {
  try {
    const { title, category, level, grade, subject, year, approved } = req.body;
    const update = {};
    if (title     !== undefined) update.title     = title;
    if (category  !== undefined) update.category  = category;
    if (level     !== undefined) update.level     = level;
    if (grade     !== undefined) update.grade     = grade;
    if (subject   !== undefined) update.subject   = subject;
    if (year      !== undefined) update.year      = year;
    if (approved  !== undefined) update.approved  = approved;

    const mat = await MaterialModel.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!mat) return res.status(404).json({ error: 'Not found' });
    res.json(mat);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── DELETE /api/materials/:id ────────────────────────────────────────────────
app.delete('/api/materials/:id', requireAuth, async (req, res) => {
  try {
    const mat = await MaterialModel.findByIdAndDelete(req.params.id);
    if (!mat) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── DELETE /api/materials (bulk) ─────────────────────────────────────────────
app.delete('/api/materials', requireAuth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ error: 'No ids' });
    const result = await MaterialModel.deleteMany({ _id: { $in: ids } });
    res.json({ deleted: result.deletedCount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── GET /api/stats ───────────────────────────────────────────────────────────
app.get('/api/stats', requireAuth, async (req, res) => {
  try {
    const [total, approved, pending, byCategory] = await Promise.all([
      MaterialModel.countDocuments(),
      MaterialModel.countDocuments({ approved: true }),
      MaterialModel.countDocuments({ approved: false }),
      MaterialModel.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    ]);
    res.json({ total, approved, pending, byCategory });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Fundo AI Admin Portal running on port ${PORT}`);
});
