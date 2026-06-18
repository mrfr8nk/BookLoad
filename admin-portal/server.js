import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';

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

const MaterialModel = mongoose.models?.Material ||
  mongoose.model('Material', materialSchema);

const userSchema = new mongoose.Schema({
  phone:         { type: String, required: true, unique: true },
  plan:          { type: String, default: 'FREE' },
  name:          { type: String, default: '' },
  email:         { type: String, default: '' },
  age:           { type: String, default: '' },
  school:        { type: String, default: '' },
  levelType:     { type: String, default: '' },
  levelLabel:    { type: String, default: '' },
  grade:         { type: String, default: '' },
  uploadCount:   { type: Number, default: 0 },
  extraProjects: { type: Number, default: 0 },
  extraMessages: { type: Number, default: 0 },
  extraImages:   { type: Number, default: 0 },
  referralCode:  { type: String, default: '' },
  referralCount: { type: Number, default: 0 },
  referredBy:    { type: String, default: '' },
  usage: {
    chatToday:    { type: Number, default: 0 },
    imagesToday:  { type: Number, default: 0 },
    pdfToday:     { type: Number, default: 0 },
    pdfMonth:     { type: Number, default: 0 },
    mediaDownloads:{ type: Number, default: 0 },
    mockMonth:    { type: Number, default: 0 },
  },
}, { timestamps: true });

const UserModel = mongoose.models?.User || mongoose.model('User', userSchema);

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

// ─── Multer ───────────────────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 80 * 1024 * 1024, files: 100, fields: 210, fieldNameSize: 200, fieldSize: 2 * 1024 * 1024 },
});

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// ─── Serve React build ────────────────────────────────────────────────────────
const CLIENT_DIST = path.join(__dirname, 'client', 'dist');
app.use(express.static(CLIENT_DIST));

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
    const items = await MaterialModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── POST /api/materials/upload (admin) ───────────────────────────────────────
app.post('/api/materials/upload', requireAuth, upload.single('file'), async (req, res) => {
  try {
    const { category, level, grade, subject, year, title } = req.body;
    const file = req.file;
    if (!file)    return res.status(400).json({ error: 'No file provided' });
    if (!subject) return res.status(400).json({ error: 'Subject is required' });

    const displayTitle  = (title || file.originalname).replace(/\.[^.]+$/, '').trim();
    const cdnUrl        = await uploadToCDN(file.buffer, file.originalname, file.mimetype);
    const resolvedGrade = level === 'alevel' ? 'A-Level' : (grade || '');
    const cleanSubject  = (subject || 'General').replace(/\s*\(ZIMSEC\)|\s*\(Cambridge\)/gi, '').trim();

    const mat = await MaterialModel.create({
      category: category || 'paper', level: level || 'olevel', grade: resolvedGrade,
      subject: cleanSubject, title: displayTitle, url: cdnUrl,
      mimeType: file.mimetype, fileSize: file.size,
      uploadedBy: 'admin-portal', approved: true, approvedBy: 'admin-portal', year: year || '',
    });
    res.json({ ok: true, material: mat });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── POST /api/public/upload (no auth — pending review) ──────────────────────
app.post('/api/public/upload', upload.single('file'), async (req, res) => {
  try {
    const { category, level, grade, subject, title, uploaderName, uploaderPhone } = req.body;
    const file = req.file;
    if (!file)    return res.status(400).json({ error: 'No file provided' });
    if (!subject) return res.status(400).json({ error: 'Subject is required' });

    const displayTitle  = (title || file.originalname).replace(/\.[^.]+$/, '').trim();
    const cdnUrl        = await uploadToCDN(file.buffer, file.originalname, file.mimetype, 'fundo/community/');
    const resolvedGrade = level === 'alevel' ? 'A-Level' : (grade || '');
    const cleanSubject  = (subject || 'General').replace(/\s*\(ZIMSEC\)|\s*\(Cambridge\)/gi, '').trim();

    const mat = await MaterialModel.create({
      category: category || 'paper', level: level || 'olevel', grade: resolvedGrade,
      subject: cleanSubject, title: displayTitle, url: cdnUrl,
      mimeType: file.mimetype, fileSize: file.size,
      uploadedBy: uploaderPhone || 'public',
      approved: false, approvedBy: '', year: '',
    });

    // Update uploader's record if phone provided
    if (uploaderPhone) {
      await UserModel.findOneAndUpdate(
        { phone: uploaderPhone },
        { $setOnInsert: { phone: uploaderPhone, name: uploaderName || '' } },
        { upsert: true }
      ).catch(() => {});
    }

    res.json({ ok: true, message: 'Upload submitted for review. You will be rewarded once approved!' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── GET /api/community/stats (public) ────────────────────────────────────────
app.get('/api/community/stats', async (req, res) => {
  try {
    const [totalResources, totalUsers, recentApproved] = await Promise.all([
      MaterialModel.countDocuments({ approved: true }),
      UserModel.countDocuments(),
      MaterialModel.find({ approved: true }).sort({ createdAt: -1 }).limit(6)
        .select('title category subject level createdAt'),
    ]);
    res.json({ totalResources, totalUsers, recentApproved });
  } catch (e) { res.status(500).json({ error: e.message }); }
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
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── DELETE /api/materials/:id ────────────────────────────────────────────────
app.delete('/api/materials/:id', requireAuth, async (req, res) => {
  try {
    const mat = await MaterialModel.findByIdAndDelete(req.params.id);
    if (!mat) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── DELETE /api/materials (bulk) ─────────────────────────────────────────────
app.delete('/api/materials', requireAuth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ error: 'No ids provided' });
    const result = await MaterialModel.deleteMany({ _id: { $in: ids } });
    res.json({ deleted: result.deletedCount });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── GET /api/stats (resources) ───────────────────────────────────────────────
app.get('/api/stats', requireAuth, async (req, res) => {
  try {
    const [total, approved, pending, byCategory] = await Promise.all([
      MaterialModel.countDocuments(),
      MaterialModel.countDocuments({ approved: true }),
      MaterialModel.countDocuments({ approved: false }),
      MaterialModel.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    ]);
    res.json({ total, approved, pending, byCategory });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── GET /api/analytics (bot analytics) ───────────────────────────────────────
app.get('/api/analytics', requireAuth, async (req, res) => {
  try {
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const weekStart  = new Date(); weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);

    const [
      totalUsers, todayUsers, weekUsers, monthUsers,
      planBreakdown, levelBreakdown,
      topUploaders, topReferrers, recentSignups,
      totalMaterials, pendingMaterials, communityUploads,
      byCategory, byLevel,
    ] = await Promise.all([
      UserModel.countDocuments(),
      UserModel.countDocuments({ createdAt: { $gte: todayStart } }),
      UserModel.countDocuments({ createdAt: { $gte: weekStart } }),
      UserModel.countDocuments({ createdAt: { $gte: monthStart } }),
      UserModel.aggregate([{ $group: { _id: '$plan', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      UserModel.aggregate([{ $group: { _id: '$levelLabel', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      UserModel.find({ uploadCount: { $gt: 0 } }, 'phone name plan school uploadCount createdAt')
        .sort({ uploadCount: -1 }).limit(10),
      UserModel.find({ referralCount: { $gt: 0 } }, 'phone name plan referralCount createdAt')
        .sort({ referralCount: -1 }).limit(10),
      UserModel.find({}, 'phone name plan school createdAt').sort({ createdAt: -1 }).limit(12),
      MaterialModel.countDocuments({ approved: true }),
      MaterialModel.countDocuments({ approved: false }),
      MaterialModel.countDocuments({ uploadedBy: { $nin: ['admin-portal', 'public', ''] } }),
      MaterialModel.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      MaterialModel.aggregate([{ $group: { _id: '$level', count: { $sum: 1 } } }]),
    ]);

    // Signups per day last 7 days
    const signupTrend = await UserModel.aggregate([
      { $match: { createdAt: { $gte: weekStart } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      users: { total: totalUsers, today: todayUsers, week: weekUsers, month: monthUsers },
      planBreakdown, levelBreakdown, signupTrend,
      topUploaders, topReferrers, recentSignups,
      materials: { total: totalMaterials, pending: pendingMaterials, community: communityUploads, byCategory, byLevel },
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── GET /api/users (all registered users) ────────────────────────────────────
app.get('/api/users', requireAuth, async (req, res) => {
  try {
    const { search, plan, page = 1, limit = 50 } = req.query;
    const query = {};
    if (plan) query.plan = plan;
    if (search) query.$or = [
      { phone: new RegExp(search, 'i') },
      { name:  new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { school:new RegExp(search, 'i') },
    ];
    const skip  = (Number(page) - 1) * Number(limit);
    const total = await UserModel.countDocuments(query);
    const users = await UserModel.find(query)
      .select('phone name email age school plan levelLabel grade uploadCount referralCount extraMessages extraImages createdAt usage')
      .sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── PATCH /api/users/:phone/plan ─────────────────────────────────────────────
app.patch('/api/users/:phone/plan', requireAuth, async (req, res) => {
  try {
    const { plan } = req.body;
    const validPlans = ['FREE', 'STARTER', 'BASIC', 'PRO', 'PREMIUM'];
    if (!validPlans.includes(plan)) return res.status(400).json({ error: 'Invalid plan' });
    const user = await UserModel.findOneAndUpdate(
      { phone: req.params.phone }, { plan }, { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ ok: true, user });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── POST /api/materials/:id/approve (approve pending) ───────────────────────
app.post('/api/materials/:id/approve', requireAuth, async (req, res) => {
  try {
    const mat = await MaterialModel.findByIdAndUpdate(
      req.params.id, { approved: true, approvedBy: 'admin-portal' }, { new: true }
    );
    if (!mat) return res.status(404).json({ error: 'Not found' });

    if (mat.uploadedBy && !['admin-portal','public',''].includes(mat.uploadedBy)) {
      const user = await UserModel.findOneAndUpdate(
        { phone: mat.uploadedBy },
        { $inc: { uploadCount: 1 } },
        { new: true }
      ).catch(() => null);
      if (user && user.uploadCount % 3 === 0) {
        await UserModel.findOneAndUpdate(
          { phone: mat.uploadedBy },
          { $inc: { extraProjects: 1, extraMessages: 10, extraImages: 2 } }
        ).catch(() => {});
      }
    }
    res.json({ ok: true, material: mat });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── DELETE /api/users/:phone ─────────────────────────────────────────────────
app.delete('/api/users/:phone', requireAuth, async (req, res) => {
  try {
    const user = await UserModel.findOneAndDelete({ phone: req.params.phone });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── DELETE /api/users (bulk) ─────────────────────────────────────────────────
app.delete('/api/users', requireAuth, async (req, res) => {
  try {
    const { phones } = req.body;
    if (!Array.isArray(phones) || !phones.length) return res.status(400).json({ error: 'No phones provided' });
    const result = await UserModel.deleteMany({ phone: { $in: phones } });
    res.json({ deleted: result.deletedCount });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── SPA fallback — must be LAST ──────────────────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(CLIENT_DIST, 'index.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Fundo AI Admin Portal running on port ${PORT}`);
});
