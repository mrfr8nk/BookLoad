import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';
import { createHash } from 'crypto';
import { createRequire } from 'module';
import axios from 'axios';
import PDFDocument from 'pdfkit';
import {
  PREAMBLE_PROMPT_MD,
  STAGE1_PROMPT_MD,
  STAGE2_PROMPT_MD,
  STAGE3_PROMPT_MD,
  STAGE4_PROMPT_MD,
  STAGE5_PROMPT_MD,
  STAGE6_PROMPT_MD,
} from '../project-prompts.js';

const require = createRequire(import.meta.url);
let jwt;
try { jwt = require('jsonwebtoken'); } catch (_) { jwt = null; }

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || process.env.PORTAL_PORT || 5000;

const JWT_SECRET = process.env.SESSION_SECRET || 'fundo-ai-secret-2025';

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
  webPassword:   { type: String, default: '' },
  uploadCount:   { type: Number, default: 0 },
  extraProjects: { type: Number, default: 0 },
  extraMessages: { type: Number, default: 0 },
  extraImages:   { type: Number, default: 0 },
  referralCode:  { type: String, default: '' },
  referralCount: { type: Number, default: 0 },
  referredBy:    { type: String, default: '' },
  usage: {
    chatToday:      { type: Number, default: 0 },
    imagesToday:    { type: Number, default: 0 },
    pdfToday:       { type: Number, default: 0 },
    chatMonth:      { type: Number, default: 0 },
    imagesMonth:    { type: Number, default: 0 },
    pdfMonth:       { type: Number, default: 0 },
    mediaDownloads:      { type: Number, default: 0 },
    mediaDownloadsToday: { type: Number, default: 0 },
    mediaDownloadsMonth: { type: Number, default: 0 },
    mockMonth:      { type: Number, default: 0 },
    projectsMonth:  { type: Number, default: 0 },
    lastDayReset:   { type: String, default: '' },
    lastMonthReset: { type: String, default: '' },
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

// ─── Student JWT Auth ──────────────────────────────────────────────────────────
function hashPassword(pw) {
  return createHash('sha256').update(pw + 'fundo2025').digest('hex');
}

function requireStudent(req, res, next) {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token || !jwt) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.student = jwt.verify(token, JWT_SECRET);
    next();
  } catch (_) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ─── Reset usage if needed ─────────────────────────────────────────────────────
function todayStr()  { return new Date().toISOString().slice(0, 10); }
function monthStr()  { return new Date().toISOString().slice(0, 7); }

async function resetUsageIfNeeded(user) {
  const today = todayStr();
  const month = monthStr();
  const updates = {};
  user.usage = user.usage || {};

  if (user.usage.lastDayReset !== today) {
    user.usage.chatToday    = 0;
    user.usage.imagesToday  = 0;
    user.usage.pdfToday     = 0;
    user.usage.mediaDownloadsToday = 0;
    user.usage.lastDayReset = today;
    updates['usage.chatToday']    = 0;
    updates['usage.imagesToday']  = 0;
    updates['usage.pdfToday']     = 0;
    updates['usage.mediaDownloadsToday'] = 0;
    updates['usage.lastDayReset'] = today;
  }

  if (user.usage.lastMonthReset !== month) {
    user.usage.chatMonth      = 0;
    user.usage.imagesMonth    = 0;
    user.usage.pdfMonth       = 0;
    user.usage.projectsMonth  = 0;
    user.usage.mediaDownloadsMonth = 0;
    user.usage.lastMonthReset = month;
    updates['usage.chatMonth']      = 0;
    updates['usage.imagesMonth']    = 0;
    updates['usage.pdfMonth']       = 0;
    updates['usage.projectsMonth']  = 0;
    updates['usage.mediaDownloadsMonth'] = 0;
    updates['usage.lastMonthReset'] = month;
  }

  if (Object.keys(updates).length) {
    await UserModel.findOneAndUpdate({ phone: user.phone }, { $set: updates }).catch(() => {});
  }
  return user;
}

// ─── Settings model (for dynamic plan limits) ──────────────────────────────────
const settingsSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });
const SettingsModel = mongoose.models?.Settings || mongoose.model('Settings', settingsSchema);

// ─── Plan limits (mutable — updated by admin portal) ──────────────────────────
let PLAN_LIMITS = {
  FREE:    { chat: 25,    images: 3,    pdf: 1,    projects: 2,    library: 5,    period: 'daily'   },
  STARTER: { chat: 75,   images: 8,    pdf: 3,    projects: 5,    library: 20,   period: 'monthly' },
  BASIC:   { chat: 300,  images: 20,   pdf: 10,   projects: 15,   library: 60,   period: 'monthly' },
  PRO:     { chat: 1000, images: 50,   pdf: 50,   projects: 50,   library: 200,  period: 'monthly' },
  PREMIUM: { chat: 9999, images: 9999, pdf: 9999, projects: 9999, library: 9999, period: 'monthly' },
};

mongoose.connection.once('open', async () => {
  try {
    const saved = await SettingsModel.findOne({ key: 'planLimits' });
    if (saved?.value) { PLAN_LIMITS = saved.value; console.log('✅ Plan limits loaded from DB'); }
  } catch (e) { console.error('⚠️  Could not load plan limits:', e.message); }
});

// ─── AI Config ─────────────────────────────────────────────────────────────────
const BK9_MODEL    = 'meta-llama/llama-4-scout-17b-16e-instruct';
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_DOC_MODEL = 'meta/llama-3.3-70b-instruct';

const WEB_SYSTEM_PROMPT = `You are Fundo AI, a world-class educational AI assistant built specifically for Zimbabwean students studying under ZIMSEC and Cambridge curricula. You were created by Darrell Mucheri.

**Your expertise covers:**
- ZIMSEC: Primary (Grade 1–7), O-Level (Form 1–4), A-Level (Form 5–6)
- Cambridge: IGCSE, AS/A-Level, Primary
- All core subjects: Mathematics, Sciences, Languages, Humanities, Commerce, Technology

**Your teaching style:**
- Break down complex topics into clear, step-by-step explanations
- Use real examples relevant to Zimbabwe and African context
- Format responses beautifully with headers, bullet points, and structure
- For maths, show full working step-by-step
- Reference actual ZIMSEC/Cambridge syllabus topics and past paper formats
- Encourage students and celebrate their progress
- Use markdown formatting: **bold**, *italic*, \`code\`, headers, tables

**You can help with:**
- Any subject question or homework
- Explaining concepts and topics
- Solving maths and science problems
- Essay writing and English language
- Past paper questions and exam preparation
- Study strategies and notes
- Project research and writing

Always be warm, encouraging, and educational. Sign responses with — *Fundo AI* 🤖✨`;

async function callBK92(systemPrompt, userMessage) {
  const q = userMessage.substring(0, 4000);
  const sys = systemPrompt.substring(0, 1500);

  const tryBK92 = async () => {
    const res = await axios.get('https://api.bk9.dev/ai/BK92', {
      params: { q, BK9: sys, model: 'openai/gpt-oss-120b' },
      timeout: 18000,
    });
    if (res.data?.status && res.data?.BK9) return res.data.BK9;
    throw new Error('BK92: empty response');
  };

  const tryBK91 = async () => {
    const res2 = await axios.get('https://api.bk9.dev/ai/BK91', {
      params: { BK9: sys, q: q.substring(0, 2000), model: BK9_MODEL },
      timeout: 18000,
    });
    if (res2.data?.status && res2.data?.BK9) return res2.data.BK9;
    throw new Error('BK91: empty response');
  };

  try {
    return await Promise.any([tryBK92(), tryBK91()]);
  } catch (_) {
    throw new Error('AI unavailable');
  }
}

// Retries callBK92 on failure — the underlying BK9 API becomes flaky when hit
// with many concurrent large-prompt requests (as happens during project
// generation), so a couple of retries with a short backoff meaningfully
// improves reliability without materially hurting perceived speed.
async function callBK92Retry(systemPrompt, userMessage, retries = 2) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      return await callBK92(systemPrompt, userMessage);
    } catch (e) {
      lastErr = e;
      if (i < retries - 1) await new Promise(r => setTimeout(r, 800));
    }
  }
  throw lastErr || new Error('AI unavailable');
}

// Runs an array of async task-factories with limited concurrency — firing
// too many large BK9 prompts at once causes timeouts/failures upstream, so
// we process them in small batches instead of one giant Promise.all.
async function runWithConcurrency(taskFactories, batchSize = 2) {
  const results = [];
  for (let i = 0; i < taskFactories.length; i += batchSize) {
    const batch = taskFactories.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn => fn()));
    results.push(...batchResults);
  }
  return results;
}

async function callVisionAPI(imageUrl, question) {
  const res = await axios.get('https://api.bk9.dev/ai/vision', {
    params: { q: question, image_url: imageUrl, model: 'meta-llama/llama-4-scout-17b-16e-instruct' },
    timeout: 40000,
  });
  if (res.data?.status && res.data?.BK9) return res.data.BK9;
  throw new Error('Vision API unavailable');
}

async function generateImageNanoBanana(prompt) {
  const res = await axios.get(`https://omegatech-api.dixonomega.tech/api/ai/nano-banana-pro`, {
    params: { prompt },
    timeout: 35000,
  });
  const url = res.data?.image;
  if (!res.data?.success || !url) throw new Error('NanoBanana: no image in response');
  return url;
}

async function generateImageAI(prompt) {
  try {
    return await generateImageNanoBanana(prompt);
  } catch (_) {}

  const seed = Math.floor(Math.random() * 99999999);
  const encoded = encodeURIComponent(prompt);
  const urls = [
    `https://image.pollinations.ai/prompt/${encoded}?width=768&height=768&nologo=true&model=flux&seed=${seed}`,
    `https://image.pollinations.ai/prompt/${encoded}?width=768&height=768&nologo=true&model=turbo&seed=${seed}`,
  ];
  for (const url of urls) {
    try {
      const r = await axios.head(url, { timeout: 15000 });
      if (r.status === 200) return url;
    } catch (_) {}
  }
  return urls[0];
}

async function callNVIDIA(messages) {
  const res = await axios.post(NVIDIA_BASE_URL, {
    model: NVIDIA_DOC_MODEL,
    messages,
    max_tokens: 2048,
    temperature: 0.3,
    top_p: 0.7,
    stream: false,
  }, {
    headers: {
      Authorization: `Bearer ${NVIDIA_API_KEY}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 22000,
  });
  const txt = res.data?.choices?.[0]?.message?.content;
  if (!txt) throw new Error('NVIDIA: empty response');
  return txt;
}

async function askAI(messages) {
  const sysMsg = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');
  const lastUser = userMessages[userMessages.length - 1]?.content || '';

  let historyContext = '';
  if (userMessages.length > 1) {
    const prevMsgs = userMessages.slice(-6, -1);
    historyContext = prevMsgs.map(m => `${m.role === 'user' ? 'Student' : 'Fundo AI'}: ${m.content}`).join('\n');
  }

  const fullQuestion = historyContext
    ? `Previous conversation:\n${historyContext}\n\nStudent: ${lastUser}`
    : lastUser;

  try {
    return await Promise.any([
      callNVIDIA(messages),
      callBK92(sysMsg?.content || WEB_SYSTEM_PROMPT, fullQuestion),
    ]);
  } catch (_) {
    throw new Error('AI unavailable');
  }
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
app.get('/favicon.ico', (_req, res) => res.redirect(301, 'https://mrfranko-cdn.hf.space/edu/fundo.png'));
app.use(express.static(CLIENT_DIST));

// ─── Admin Auth endpoint ───────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ token: `${ADMIN_USER}:${ADMIN_PASS}` });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// STUDENT AUTH ROUTES
// ══════════════════════════════════════════════════════════════════════════════

async function generateUniqueReferralCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code, exists;
  do {
    code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    exists = await UserModel.findOne({ referralCode: code });
  } while (exists);
  return code;
}

async function applyReferral(newPhone, referredByCode) {
  if (!referredByCode) return;
  try {
    const code = referredByCode.trim().toUpperCase();
    const referrer = await UserModel.findOne({ referralCode: code });
    if (!referrer || referrer.phone === newPhone) return;
    await UserModel.updateOne(
      { referralCode: code },
      { $inc: { referralCount: 1, extraMessages: 5, extraImages: 2, extraProjects: 1 } }
    );
    await UserModel.updateOne(
      { phone: newPhone },
      { $set: { referredBy: code }, $inc: { extraMessages: 5, extraImages: 2 } }
    );
  } catch (_) {}
}

app.post('/api/student/signup', async (req, res) => {
  try {
    const { phone, name, school, levelType, levelLabel, grade, password, referredBy } = req.body;
    if (!phone || !name || !password) return res.status(400).json({ error: 'Phone, name and password are required.' });
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 9) return res.status(400).json({ error: 'Enter a valid phone number.' });

    const existing = await UserModel.findOne({ phone: cleanPhone });
    if (existing) {
      if (existing.webPassword) return res.status(409).json({ error: 'Account already exists. Please log in.' });
      existing.name = name;
      existing.school = school || existing.school;
      existing.levelType = levelType || existing.levelType;
      existing.levelLabel = levelLabel || existing.levelLabel;
      existing.grade = grade || existing.grade;
      existing.webPassword = hashPassword(password);
      if (!existing.referralCode) existing.referralCode = await generateUniqueReferralCode();
      await existing.save();
      const token = jwt ? jwt.sign({ phone: cleanPhone, name }, JWT_SECRET, { expiresIn: '30d' }) : 'no-jwt';
      return res.json({ token, user: { phone: cleanPhone, name, plan: existing.plan, school, levelLabel, grade, referralCode: existing.referralCode } });
    }

    const refCode = await generateUniqueReferralCode();
    const user = await UserModel.create({
      phone: cleanPhone, name, school: school || '', levelType: levelType || '',
      levelLabel: levelLabel || '', grade: grade || '',
      webPassword: hashPassword(password), plan: 'FREE', referralCode: refCode,
    });
    await applyReferral(cleanPhone, referredBy);
    const token = jwt ? jwt.sign({ phone: cleanPhone, name }, JWT_SECRET, { expiresIn: '30d' }) : 'no-jwt';
    res.json({ token, user: { phone: cleanPhone, name, plan: 'FREE', school, levelLabel, grade, referralCode: refCode } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/student/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ error: 'Phone and password required.' });
    const cleanPhone = phone.replace(/\D/g, '');
    const user = await UserModel.findOne({ phone: cleanPhone });
    if (!user) return res.status(404).json({ error: 'No account found. Please sign up first.' });
    if (!user.webPassword) {
      user.webPassword = hashPassword(password);
      await user.save();
    } else if (user.webPassword !== hashPassword(password)) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }
    const token = jwt ? jwt.sign({ phone: cleanPhone, name: user.name }, JWT_SECRET, { expiresIn: '30d' }) : 'no-jwt';
    res.json({ token, user: { phone: cleanPhone, name: user.name, plan: user.plan, school: user.school, levelLabel: user.levelLabel, grade: user.grade } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/student/update-profile', requireStudent, async (req, res) => {
  try {
    const { name, school, levelType, levelLabel, grade } = req.body;
    const update = {};
    if (name)       update.name       = name;
    if (school)     update.school     = school;
    if (levelType)  update.levelType  = levelType;
    if (levelLabel) update.levelLabel = levelLabel;
    if (grade)      update.grade      = grade;
    const user = await UserModel.findOneAndUpdate(
      { phone: req.student.phone }, update, { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: { phone: user.phone, name: user.name, plan: user.plan, school: user.school, levelLabel: user.levelLabel, grade: user.grade } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/student/me', requireStudent, async (req, res) => {
  try {
    let user = await UserModel.findOne({ phone: req.student.phone });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user = await resetUsageIfNeeded(user.toObject ? user.toObject() : user);
    const plan = user.plan || 'FREE';
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
    res.json({
      phone: user.phone, name: user.name, plan, school: user.school,
      levelType: user.levelType, levelLabel: user.levelLabel, grade: user.grade,
      usage: {
        chatToday:    user.usage?.chatToday    || 0,
        imagesToday:  user.usage?.imagesToday  || 0,
        pdfToday:     user.usage?.pdfToday     || 0,
        chatMonth:    user.usage?.chatMonth    || 0,
        imagesMonth:  user.usage?.imagesMonth  || 0,
        pdfMonth:     user.usage?.pdfMonth     || 0,
        projectsMonth:       user.usage?.projectsMonth       || 0,
        mediaDownloadsToday: user.usage?.mediaDownloadsToday || 0,
        mediaDownloadsMonth: user.usage?.mediaDownloadsMonth || 0,
      },
      limits,
      isMonthly: limits.period === 'monthly',
      extraMessages: user.extraMessages || 0,
      extraImages: user.extraImages || 0,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════════════════════════════════
// STUDENT AI ROUTES
// ══════════════════════════════════════════════════════════════════════════════

app.post('/api/student/chat', requireStudent, async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message required' });

    let user = await UserModel.findOne({ phone: req.student.phone });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user = await resetUsageIfNeeded(user.toObject ? user.toObject() : user);

    const plan = user.plan || 'FREE';
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
    const isMonthly = limits.period === 'monthly';
    const chatUsed = isMonthly ? (user.usage?.chatMonth || 0) : (user.usage?.chatToday || 0);
    const extra = user.extraMessages || 0;
    if (chatUsed >= limits.chat + extra) {
      const pd = isMonthly ? 'month' : 'day';
      return res.status(429).json({ error: `${isMonthly ? 'Monthly' : 'Daily'} chat limit reached (${limits.chat}/${pd}). Upgrade your plan for more!` });
    }

    const messages = [
      { role: 'system', content: WEB_SYSTEM_PROMPT },
      ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];

    const sysPrompt = WEB_SYSTEM_PROMPT;
    const historyContext = history.slice(-8).map(m => `${m.role === 'user' ? 'Student' : 'Fundo AI'}: ${m.content}`).join('\n');
    const fullQ = historyContext ? `${historyContext}\n\nStudent: ${message}` : message;
    const reply = await callBK92(sysPrompt, fullQ);

    const chatInc = isMonthly
      ? { 'usage.chatToday': 1, 'usage.chatMonth': 1 }
      : { 'usage.chatToday': 1 };
    await UserModel.findOneAndUpdate(
      { phone: req.student.phone },
      { $inc: chatInc }
    ).catch(() => {});

    res.json({ reply });
  } catch (e) {
    res.status(500).json({ error: e.message || 'AI error. Try again.' });
  }
});

app.get('/api/student/generate-image', requireStudent, async (req, res) => {
  try {
    const { prompt } = req.query;
    if (!prompt) return res.status(400).json({ error: 'Prompt required' });

    let user = await UserModel.findOne({ phone: req.student.phone });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user = await resetUsageIfNeeded(user.toObject ? user.toObject() : user);

    const plan = user.plan || 'FREE';
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
    const isMonthly = limits.period === 'monthly';
    const imgUsed = isMonthly ? (user.usage?.imagesMonth || 0) : (user.usage?.imagesToday || 0);
    const extra = user.extraImages || 0;
    if (imgUsed >= limits.images + extra) {
      const pd = isMonthly ? 'month' : 'day';
      return res.status(429).json({ error: `${isMonthly ? 'Monthly' : 'Daily'} image limit reached (${limits.images}/${pd}). Upgrade for more!` });
    }

    const enhanced = `${prompt}, high quality, detailed, educational, vivid`;
    const imageUrl = await generateImageAI(enhanced);

    const imgInc = isMonthly
      ? { 'usage.imagesToday': 1, 'usage.imagesMonth': 1 }
      : { 'usage.imagesToday': 1 };
    await UserModel.findOneAndUpdate(
      { phone: req.student.phone },
      { $inc: imgInc }
    ).catch(() => {});

    res.json({ imageUrl, prompt: enhanced });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/student/analyze-image', requireStudent, async (req, res) => {
  try {
    const { imageUrl, question } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'Image URL required' });
    const q = (question?.trim()) || 'Describe and analyse this image in detail. If it is educational content, explain it thoroughly.';

    let user = await UserModel.findOne({ phone: req.student.phone });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user = await resetUsageIfNeeded(user.toObject ? user.toObject() : user);
    const plan = user.plan || 'FREE';
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
    const chatUsed = user.usage?.chatToday || 0;
    const extra = user.extraMessages || 0;
    if (chatUsed >= limits.chat + extra) {
      return res.status(429).json({ error: `Daily limit reached. Upgrade your plan for more!` });
    }

    const reply = await callVisionAPI(imageUrl, q);
    await UserModel.findOneAndUpdate(
      { phone: req.student.phone },
      { $inc: { 'usage.chatToday': 1 } }
    ).catch(() => {});

    res.json({ reply });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Vision AI error. Try again.' });
  }
});

app.post('/api/student/upload-image', requireStudent, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' });
    const ext = (req.file.originalname.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z]/g,'');
    const filename = `vision_${Date.now()}.${ext || 'jpg'}`;
    const url = await uploadToCDN(req.file.buffer, filename, req.file.mimetype, 'fundo/vision/');
    res.json({ url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/student/my-referral', requireStudent, async (req, res) => {
  try {
    let user = await UserModel.findOne({ phone: req.student.phone });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.referralCode) {
      const code = 'FUNDO' + req.student.phone.slice(-5).toUpperCase();
      user = await UserModel.findOneAndUpdate(
        { phone: req.student.phone }, { referralCode: code }, { new: true }
      );
    }
    res.json({ referralCode: user.referralCode, referralCount: user.referralCount || 0 });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/student/my-uploads', requireStudent, async (req, res) => {
  try {
    const uploads = await MaterialModel.find({ uploadedBy: req.student.phone })
      .sort({ createdAt: -1 }).limit(50).lean();
    res.json({ uploads });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/student/generate-notes', requireStudent, async (req, res) => {
  try {
    const { topic, subject, level, grade } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic required' });

    let user = await UserModel.findOne({ phone: req.student.phone });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user = await resetUsageIfNeeded(user.toObject ? user.toObject() : user);

    const plan = user.plan || 'FREE';
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
    const pdfUsed = user.usage?.pdfToday || 0;
    if (pdfUsed >= limits.pdf) {
      return res.status(429).json({ error: `Daily notes limit reached (${limits.pdf}). Upgrade for more!` });
    }

    const levelInfo = grade ? `${level} ${grade}` : level || 'O-Level';
    const prompt = `Generate comprehensive, well-structured study notes for: **${topic}**

Level: ${levelInfo} | Subject: ${subject || 'General'}
Curriculum: ZIMSEC and Cambridge

Please provide:
1. Overview/Introduction
2. Key Concepts (with clear explanations)
3. Important Definitions
4. Examples and Worked Solutions (if applicable)
5. Key Points to Remember
6. Common Exam Questions/Tips
7. Summary

Format with clear headings, bullet points, and make it easy to study from.`;

    const messages = [
      { role: 'system', content: WEB_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ];

    const notes = await askAI(messages);

    await UserModel.findOneAndUpdate(
      { phone: req.student.phone },
      { $inc: { 'usage.pdfToday': 1 } }
    ).catch(() => {});

    res.json({ notes, topic, subject, level });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Student Mock Exam ─────────────────────────────────────────────────────────
app.post('/api/student/generate-mock-exam', requireStudent, async (req, res) => {
  try {
    const { subject, level, grade, topic, count = 10, difficulty = 'medium' } = req.body;
    if (!subject) return res.status(400).json({ error: 'Subject required' });

    let user = await UserModel.findOne({ phone: req.student.phone });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user = await resetUsageIfNeeded(user.toObject ? user.toObject() : user);

    const plan = user.plan || 'FREE';
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
    const pdfUsed = user.usage?.pdfToday || 0;
    if (pdfUsed >= limits.pdf) {
      return res.status(429).json({ error: `Daily limit reached (${limits.pdf}). Upgrade for more!` });
    }

    const levelInfo = grade ? `${level} ${grade}` : level || 'O-Level';
    const topicLine = topic ? ` on "${topic}"` : '';
    const prompt = `Generate exactly ${count} multiple-choice exam questions for ${subject}${topicLine} at ${levelInfo} level (ZIMSEC/Cambridge curriculum), difficulty: ${difficulty}.

Return ONLY valid JSON (no markdown, no extra text) in this exact format:
{"questions":[{"id":1,"q":"Question text here?","options":["A. Option 1","B. Option 2","C. Option 3","D. Option 4"],"answer":"A","explanation":"Brief explanation of why A is correct."}]}

Requirements:
- Exactly ${count} questions
- Each question has id, q, options (exactly 4 starting with A./B./C./D.), answer (just the letter), explanation
- Questions must be curriculum-appropriate for ${levelInfo} ${subject}
- Mix of difficulty within the ${difficulty} band
- No duplicate questions`;

    const messages = [
      { role: 'system', content: 'You are a ZIMSEC/Cambridge exam paper generator. You output ONLY valid JSON, never markdown or extra text.' },
      { role: 'user', content: prompt },
    ];

    let raw = '';
    try {
      raw = await Promise.any([
        callNVIDIA(messages),
        callBK92('You are a ZIMSEC/Cambridge exam generator. Return ONLY valid JSON.', prompt),
      ]);
    } catch (_) {
      throw new Error('AI unavailable');
    }

    // Extract JSON from response
    const jsonMatch = raw.match(/\{[\s\S]*"questions"[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI did not return valid exam JSON. Please try again.');
    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error('No questions generated. Please try again.');
    }

    await UserModel.findOneAndUpdate(
      { phone: req.student.phone },
      { $inc: { 'usage.pdfToday': 1 } }
    ).catch(() => {});

    res.json({ questions: parsed.questions, subject, level, topic, count: parsed.questions.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Project Generator ─────────────────────────────────────────────────────────
app.post('/api/student/generate-project', requireStudent, async (req, res) => {
  try {
    const { topic, subject, level, grade, studentName, school, pages = 4 } = req.body;
    if (!topic) return res.status(400).json({ error: 'Project topic required' });

    let user = await UserModel.findOne({ phone: req.student.phone });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user = await resetUsageIfNeeded(user.toObject ? user.toObject() : user);
    const plan = user.plan || 'FREE';
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
    const projectLimit = limits.projects ?? 2;
    const projectsUsed = user.usage?.projectsMonth || 0;
    if (projectsUsed >= projectLimit && (user.extraProjects || 0) <= 0) {
      return res.status(429).json({ error: `Monthly project limit reached (${projectLimit}/month on ${plan}). Upgrade for more!` });
    }

    const sName = studentName || user.name || 'Student';
    const sSchool = school || user.school || 'School';
    void pages;

    // Normalise level → same "Form N" / "Grade N" / "O-Level" / "A-Level"
    // convention used by the WhatsApp bot so the shared ZIMSEC stage prompts
    // (project-prompts.js) apply the correct complexity/marking guidance.
    const isForm = level !== 'primary';
    let zimsecLevel = grade && grade.trim() ? grade.trim() : null;
    if (!zimsecLevel) {
      zimsecLevel = level === 'alevel' ? 'Form 5' : level === 'olevel' ? 'Form 3' : 'Grade 5';
    }

    const subj = subject || 'General Studies';

    // The BK9 API becomes unreliable when hit with 6+ large concurrent
    // requests at once (as a single Promise.all would do), so stages are
    // generated in small concurrent batches with automatic retries.
    const [preamble, s1, s2, s3, s4, s5, s6] = await runWithConcurrency([
      () => callBK92Retry(WEB_SYSTEM_PROMPT, PREAMBLE_PROMPT_MD(subj, zimsecLevel, isForm, topic)),
      () => callBK92Retry(WEB_SYSTEM_PROMPT, STAGE1_PROMPT_MD(subj, zimsecLevel, isForm, topic)),
      () => callBK92Retry(WEB_SYSTEM_PROMPT, STAGE2_PROMPT_MD(subj, zimsecLevel, isForm, topic)),
      () => callBK92Retry(WEB_SYSTEM_PROMPT, STAGE3_PROMPT_MD(subj, zimsecLevel, isForm, topic)),
      () => callBK92Retry(WEB_SYSTEM_PROMPT, STAGE4_PROMPT_MD(subj, zimsecLevel, isForm, topic)),
      () => callBK92Retry(WEB_SYSTEM_PROMPT, STAGE5_PROMPT_MD(subj, zimsecLevel, isForm, topic)),
      () => callBK92Retry(WEB_SYSTEM_PROMPT, STAGE6_PROMPT_MD(subj, zimsecLevel, isForm, topic)),
    ], 2);

    const content = `# ${sName}'s ZIMSEC School-Based Project

**Student:** ${sName}  |  **School:** ${sSchool}  |  **Level:** ${zimsecLevel}  |  **Subject:** ${subj}

---

${preamble}

---

## Stage 1: Problem Identification (5 marks)

${s1}

---

## Stage 2: Investigation of Related Ideas (10 marks)

${s2}

---

## Stage 3: Generation of Ideas / Possible Solutions (10 marks)

${s3}

---

## Stage 4: Development and Refinement of Chosen Idea (10 marks)

${s4}

---

## Stage 5: Presentation of Final Solution (10 marks)

${s5}

---

## Stage 6: Evaluation and Recommendations (5 marks)

${s6}
`;

    if (projectsUsed >= projectLimit && (user.extraProjects || 0) > 0) {
      await UserModel.findOneAndUpdate(
        { phone: req.student.phone },
        { $inc: { extraProjects: -1, 'usage.projectsMonth': 1 } }
      ).catch(() => {});
    } else {
      await UserModel.findOneAndUpdate(
        { phone: req.student.phone },
        { $inc: { 'usage.projectsMonth': 1 } }
      ).catch(() => {});
    }

    res.json({ content, topic, subject: subj, level: zimsecLevel, studentName: sName, school: sSchool, plan });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Export PDF ────────────────────────────────────────────────────────────────
app.post('/api/student/export-pdf', requireStudent, async (req, res) => {
  try {
    const { content, title, type = 'notes' } = req.body;
    if (!content) return res.status(400).json({ error: 'Content required' });

    const user = await UserModel.findOne({ phone: req.student.phone });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const plan = user.plan || 'FREE';
    const isPaid = plan !== 'FREE';

    const doc = new PDFDocument({ margin: 60, size: 'A4', info: { Title: title || 'Fundo AI', Author: 'Fundo AI' } });
    const chunks = [];
    doc.on('data', c => chunks.push(c));

    // Header bar
    doc.rect(0, 0, doc.page.width, 54).fill('#7c3aed');
    doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold').text('FUNDO AI', 60, 17, { continued: true });
    doc.fillColor('#c4b5fd').fontSize(11).font('Helvetica').text(`  ·  ${type === 'project' ? 'Academic Project' : type === 'exam' ? 'Mock Exam' : 'Study Notes'}`, { baseline: 'middle' });

    // Title
    doc.fillColor('#18063a').fontSize(20).font('Helvetica-Bold').text(title || 'Study Notes', 60, 80);
    doc.fontSize(10).fillColor('#6b7280').font('Helvetica').text(`Generated by Fundo AI  ·  ${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}  ·  ${plan} Plan`, 60, 106);
    doc.moveTo(60, 122).lineTo(doc.page.width - 60, 122).strokeColor('#e5e7eb').lineWidth(1).stroke();
    doc.moveDown(1.5);

    // Content — parse markdown-ish formatting
    const lines = content.split('\n');
    doc.fillColor('#1f2937').fontSize(11).font('Helvetica');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) { doc.moveDown(0.4); continue; }
      if (trimmed.startsWith('# ')) {
        doc.moveDown(0.6).fillColor('#7c3aed').fontSize(15).font('Helvetica-Bold').text(trimmed.slice(2)).fillColor('#1f2937').fontSize(11).font('Helvetica').moveDown(0.3);
      } else if (trimmed.startsWith('## ')) {
        doc.moveDown(0.4).fillColor('#5b21b6').fontSize(13).font('Helvetica-Bold').text(trimmed.slice(3)).fillColor('#1f2937').fontSize(11).font('Helvetica').moveDown(0.2);
      } else if (trimmed.startsWith('### ')) {
        doc.moveDown(0.3).fillColor('#374151').fontSize(12).font('Helvetica-Bold').text(trimmed.slice(4)).fillColor('#1f2937').fontSize(11).font('Helvetica').moveDown(0.2);
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        doc.fontSize(11).font('Helvetica').text(`• ${trimmed.slice(2)}`, { indent: 14, lineGap: 2 });
      } else if (/^\d+\.\s/.test(trimmed)) {
        doc.fontSize(11).font('Helvetica').text(trimmed, { indent: 14, lineGap: 2 });
      } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        doc.fontSize(11).font('Helvetica-Bold').text(trimmed.replace(/\*\*/g, ''));
      } else {
        const clean = trimmed.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/`(.*?)`/g, '$1');
        doc.fontSize(11).font('Helvetica').text(clean, { lineGap: 2 });
      }
    }

    // Footer watermark for free users
    if (!isPaid) {
      const pages = doc.bufferedPageRange ? doc.bufferedPageRange().count : 1;
      for (let i = 0; i < (pages || 1); i++) {
        if (i > 0) doc.switchToPage(i);
        doc.save().fillColor('#d1d5db').fontSize(8).font('Helvetica')
          .text('Generated by Fundo AI — Free Plan · Upgrade at fundoai.gleeze.com for premium features', 60, doc.page.height - 38, { align: 'center', width: doc.page.width - 120 }).restore();
      }
    } else {
      doc.save().fillColor('#d1d5db').fontSize(8).font('Helvetica')
        .text('Generated by Fundo AI · fundoai.gleeze.com', 60, doc.page.height - 38, { align: 'center', width: doc.page.width - 120 }).restore();
    }

    await new Promise(resolve => { doc.on('end', resolve); doc.end(); });
    const pdfBuffer = Buffer.concat(chunks);

    // Serve the PDF directly as a same-origin binary download. Cross-origin
    // CDN links don't reliably trigger a file download (the `download`
    // attribute on <a> is ignored across origins, so the browser often just
    // opens/previews the PDF instead) — sending the bytes back from our own
    // server with Content-Disposition: attachment guarantees a real download.
    const safeName = `${(title||'notes').replace(/[^\w]/g,'_').slice(0,40)}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.end(pdfBuffer);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Student Materials ──────────────────────────────────────────────────────────
app.get('/api/student/materials', requireStudent, async (req, res) => {
  try {
    const { category, level, subject, search, page = 1, limit = 20 } = req.query;
    const query = { approved: true };
    if (category) query.category = category;
    if (level) query.level = level;
    if (subject) query.subject = new RegExp(subject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (search) query.$or = [
      { title: new RegExp(search, 'i') },
      { subject: new RegExp(search, 'i') },
    ];
    const skip = (Number(page) - 1) * Number(limit);
    const total = await MaterialModel.countDocuments(query);
    const items = await MaterialModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

    let user = await UserModel.findOne({ phone: req.student.phone });
    if (user) user = await resetUsageIfNeeded(user);
    const plan = user?.plan || 'FREE';
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
    const isMonthly = limits.period === 'monthly';
    const used = isMonthly ? (user?.usage?.mediaDownloadsMonth || 0) : (user?.usage?.mediaDownloadsToday || 0);
    const canDownload = used < (limits.library ?? 5);

    res.json({
      items, total, page: Number(page), pages: Math.ceil(total / Number(limit)), canDownload,
      libraryUsage: used, libraryLimit: limits.library ?? 5, isMonthly,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Student Material Download (tracks & enforces library quota) ────────────────
app.post('/api/student/materials/:id/download', requireStudent, async (req, res) => {
  try {
    const material = await MaterialModel.findById(req.params.id);
    if (!material || !material.approved) return res.status(404).json({ error: 'Resource not found' });

    let user = await UserModel.findOne({ phone: req.student.phone });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user = await resetUsageIfNeeded(user);

    const plan = user.plan || 'FREE';
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
    const isMonthly = limits.period === 'monthly';
    const field = isMonthly ? 'mediaDownloadsMonth' : 'mediaDownloadsToday';
    const used = user.usage?.[field] || 0;
    const cap = limits.library ?? 5;

    if (used >= cap) {
      return res.status(403).json({ error: 'Download limit reached for your plan. Upgrade to download more resources.' });
    }

    await UserModel.findOneAndUpdate({ phone: user.phone }, { $inc: { [`usage.${field}`]: 1 } });

    res.json({ url: material.url, libraryUsage: used + 1, libraryLimit: cap, isMonthly });
  } catch (e) { res.status(500).json({ error: e.message }); }
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

// ─── POST /api/public/upload + alias /api/community/upload ────────────────────
async function handlePublicUpload(req, res) {
  try {
    const { category, level, grade, subject, title, uploaderName, uploaderPhone, year, referralCode } = req.body;
    const file = req.file;
    if (!file)    return res.status(400).json({ error: 'No file provided' });
    if (!subject) return res.status(400).json({ error: 'Subject is required' });

    const displayTitle  = (title || file.originalname).replace(/\.[^.]+$/, '').trim();
    const safeName      = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const cdnUrl        = await uploadToCDN(file.buffer, safeName, file.mimetype, 'fundo/community/');
    const resolvedGrade = level === 'alevel' ? 'A-Level' : (grade || '');
    const cleanSubject  = (subject || 'General').replace(/\s*\(ZIMSEC\)|\s*\(Cambridge\)/gi, '').trim();

    const mat = await MaterialModel.create({
      category: category || 'paper', level: level || 'olevel', grade: resolvedGrade,
      subject: cleanSubject, title: displayTitle, url: cdnUrl,
      mimeType: file.mimetype, fileSize: file.size,
      uploadedBy: uploaderPhone || 'public',
      approved: false, approvedBy: '',
      year: year || '',
    });

    if (uploaderPhone) {
      await UserModel.findOneAndUpdate(
        { phone: uploaderPhone },
        {
          $setOnInsert: { phone: uploaderPhone, name: uploaderName || '' },
          ...(referralCode ? { $setOnInsert: { referredBy: referralCode } } : {}),
        },
        { upsert: true }
      ).catch(() => {});
    }

    res.json({ ok: true, message: 'Upload submitted for review. You will earn rewards once approved!' });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

app.post('/api/public/upload', upload.single('file'), handlePublicUpload);
app.post('/api/community/upload', upload.single('file'), handlePublicUpload);

// ─── GET /api/community/uploader-credits (public) ─────────────────────────────
app.get('/api/community/uploader-credits', async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ error: 'Phone required' });
    const approvedUploads = await MaterialModel.countDocuments({ uploadedBy: phone, approved: true });
    const pendingUploads  = await MaterialModel.countDocuments({ uploadedBy: phone, approved: false });
    res.json({ approvedUploads, pendingUploads, rewardsEarned: Math.floor(approvedUploads / 3) });
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
    if (grade     !== undefined) update.grade      = grade;
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
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── GET /api/analytics ───────────────────────────────────────────────────────
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

// ─── GET /api/users ───────────────────────────────────────────────────────────
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

// ─── POST /api/materials/:id/approve ─────────────────────────────────────────
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

// ─── GET /api/plan-limits ─────────────────────────────────────────────────────
app.get('/api/plan-limits', async (_req, res) => {
  res.json(PLAN_LIMITS);
});

// ─── PUT /api/plan-limits ─────────────────────────────────────────────────────
app.put('/api/plan-limits', requireAuth, async (req, res) => {
  try {
    const limits = req.body;
    const valid = ['FREE','STARTER','BASIC','PRO','PREMIUM'];
    for (const plan of valid) {
      if (!limits[plan]) return res.status(400).json({ error: `Missing plan: ${plan}` });
      if (typeof limits[plan].chat !== 'number') return res.status(400).json({ error: `Invalid chat for ${plan}` });
    }
    await SettingsModel.findOneAndUpdate(
      { key: 'planLimits' },
      { value: limits },
      { upsert: true, new: true }
    );
    PLAN_LIMITS = limits;
    res.json({ ok: true, limits: PLAN_LIMITS });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── GET /api/web-stats ───────────────────────────────────────────────────────
app.get('/api/web-stats', requireAuth, async (_req, res) => {
  try {
    const [
      totalWebUsers, webWithPlan,
      topChatters, totalMessages,
    ] = await Promise.all([
      UserModel.countDocuments({ webPassword: { $ne: '' } }),
      UserModel.aggregate([
        { $match: { webPassword: { $ne: '' } } },
        { $group: { _id: '$plan', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      UserModel.find({}, 'phone name plan usage')
        .sort({ 'usage.chatMonth': -1 }).limit(10),
      UserModel.aggregate([
        { $group: { _id: null, total: { $sum: '$usage.chatMonth' } } },
      ]),
    ]);
    res.json({
      totalWebUsers,
      webWithPlan,
      topChatters,
      totalMessages: totalMessages[0]?.total || 0,
    });
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
