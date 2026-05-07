/**
 * ╔══════════════════════════════════════════╗
 * ║   FUNDO AI — MongoDB + Plan System        ║
 * ╚══════════════════════════════════════════╝
 */

import mongoose from 'mongoose';

// ─── Connection ────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://darexmucheri:cMd7EoTwGglJGXwR@cluster0.uwf6z.mongodb.net/fun?retryWrites=true&w=majority&appName=Cluster0';
let dbReady = false;

export async function connectDB() {
  if (!MONGO_URI) { console.warn('⚠️  MONGO_URI not set — plan system disabled'); return; }
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    dbReady = true;
    console.log('✅  MongoDB connected — plan system active');
  } catch (e) {
    console.warn('⚠️  MongoDB connect failed:', e.message?.substring(0, 100));
  }
}
export const isDbReady = () => dbReady;

// ─── Plan definitions ──────────────────────────────────────────────────────────
export const PLANS = {
  FREE:    { label: 'Free',    chat: 25,       images: 3,        pdf: 1,        pdfPeriod: 'day',   price: 0  },
  STARTER: { label: 'Starter', chat: 75,       images: 8,        pdf: 3,        pdfPeriod: 'month', price: 1  },
  BASIC:   { label: 'Basic',   chat: 300,      images: 20,       pdf: 10,       pdfPeriod: 'month', price: 3  },
  PRO:     { label: 'Pro',     chat: 1000,     images: 50,       pdf: 50,       pdfPeriod: 'month', price: 10 },
  PREMIUM: { label: 'Premium', chat: Infinity, images: Infinity, pdf: Infinity, pdfPeriod: 'month', price: 20 },
};
export const PLAN_CREDITS = { FREE: 0, STARTER: 200, BASIC: 1000, PRO: 5000, PREMIUM: 20000 };

// ─── Helpers ───────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().slice(0, 10);   // YYYY-MM-DD
const monthStr = () => new Date().toISOString().slice(0, 7);    // YYYY-MM

// ─── User schema ───────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  phone:         { type: String, required: true, unique: true, index: true },
  plan:          { type: String, default: 'FREE', enum: ['FREE', 'STARTER', 'BASIC', 'PRO', 'PREMIUM'] },
  credits:       { type: Number, default: 0 },
  uploadCount:   { type: Number, default: 0 },   // total approved material uploads
  extraProjects: { type: Number, default: 0 },   // bonus project PDFs earned (3 uploads = 1)
  extraMessages: { type: Number, default: 0 },   // bonus chat messages earned from uploads
  extraImages:   { type: Number, default: 0 },   // bonus image generations earned from uploads
  // ── Referral system ──────────────────────────────────────────────────────────
  referralCode:  { type: String, default: '', index: true },
  referredBy:    { type: String, default: '' },  // phone of referrer
  referralCount: { type: Number, default: 0 },   // how many people this user referred
  referredUsers: { type: [String], default: [] }, // phones referred (duplicate guard)
  // ── Limit exhaustion timestamps (ms since epoch, 0 = not hit today) ─────────
  exhaustedChatAt:  { type: Number, default: 0 },
  exhaustedImageAt: { type: Number, default: 0 },
  usage: {
    chatToday:        { type: Number, default: 0 },
    imagesToday:      { type: Number, default: 0 },
    pdfToday:         { type: Number, default: 0 },
    pdfMonth:         { type: Number, default: 0 },
    mediaDownloads:   { type: Number, default: 0 },
    lastDayReset:     { type: String, default: '' },
    lastMonthReset:   { type: String, default: '' },
    lastDownloadReset:{ type: String, default: '' },
  },
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

// ─── Payment schema ────────────────────────────────────────────────────────────
const paymentSchema = new mongoose.Schema({
  phone:     { type: String, required: true },
  reference: { type: String, required: true, unique: true },
  plan:      { type: String, required: true },
  amount:    { type: Number, required: true },
  ecocash:   { type: String, default: '' },
  status:    { type: String, default: 'pending', enum: ['pending', 'paid', 'failed'] },
  pollUrl:   { type: String, default: '' },
}, { timestamps: true });

export const PaymentModel = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

// ─── App config schema (global flags, e.g. disable project 24-h wait) ─────────
const appConfigSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true, index: true },
  value: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export const AppConfigModel = mongoose.models.AppConfig || mongoose.model('AppConfig', appConfigSchema);

export async function getConfig(key, fallback = null) {
  if (!dbReady) return fallback;
  try {
    const doc = await AppConfigModel.findOne({ key });
    return doc ? doc.value : fallback;
  } catch (_) { return fallback; }
}

export async function setConfig(key, value) {
  if (!dbReady) return false;
  try {
    await AppConfigModel.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true }
    );
    return true;
  } catch (_) { return false; }
}

// ─── Material schema ───────────────────────────────────────────────────────────
const materialSchema = new mongoose.Schema({
  category:   { type: String, required: true, enum: ['syllabus', 'paper', 'textbook', 'marking_scheme'] },
  level:      { type: String, required: true }, // 'primary' | 'olevel' | 'alevel'
  grade:      { type: String, default: '' },    // 'Grade 7' | 'Form 4' | '' (for A-Level)
  subject:    { type: String, required: true },
  title:      { type: String, required: true },
  url:        { type: String, required: true },
  mimeType:   { type: String, default: 'application/pdf' },
  fileSize:   { type: Number, default: 0 },
  uploadedBy: { type: String, default: '' },    // phone number
  approved:   { type: Boolean, default: false },
  approvedBy: { type: String, default: '' },
}, { timestamps: true });

export const MaterialModel = mongoose.models.Material || mongoose.model('Material', materialSchema);

export async function getMaterials(category, level, grade, subject) {
  if (!dbReady) return [];
  try {
    const query = { approved: true, category, level };
    // Escape regex special chars so subject names with parens etc. don't break the query
    const escapedSubject = subject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match subject: "Physics" matches "Physics", "Physics (ZIMSEC)", "Physics (Cambridge)" etc.
    query.subject = new RegExp(escapedSubject, 'i');
    // For A-Level the bot stores grade='A-Level' but portal may store '' — skip grade filter
    // For Primary/O-Level, grade distinguishes Form 1 from Form 4 etc. so keep the filter
    if (grade && grade !== 'A-Level') query.grade = grade;
    return await MaterialModel.find(query).sort({ createdAt: -1 }).limit(50);
  } catch (e) { return []; }
}

export async function addMaterial(data) {
  if (!dbReady) return null;
  try { return await MaterialModel.create(data); } catch (e) { return null; }
}

export async function approveMaterial(id, approvedBy = '') {
  if (!dbReady) return false;
  try {
    const m = await MaterialModel.findByIdAndUpdate(id, { approved: true, approvedBy }, { new: false });
    if (m && m.uploadedBy) {
      const user = await UserModel.findOneAndUpdate(
        { phone: m.uploadedBy },
        { $inc: { uploadCount: 1 } },
        { upsert: true, new: true }
      );
      if (user && user.uploadCount % 3 === 0) {
        await UserModel.findOneAndUpdate({ phone: m.uploadedBy }, { $inc: { extraProjects: 1, extraMessages: 10, extraImages: 2 } });
      }
    }
    return !!m;
  } catch (e) { return false; }
}

export async function approveAllMaterials(approvedBy = '') {
  if (!dbReady) return { count: 0, uploaders: [] };
  try {
    const pending = await MaterialModel.find({ approved: false });
    if (!pending.length) return { count: 0, uploaders: [] };
    const uploaders = [];
    for (const m of pending) {
      await MaterialModel.findByIdAndUpdate(m._id, { approved: true, approvedBy });
      if (m.uploadedBy) {
        uploaders.push({ phone: m.uploadedBy, title: m.title, id: String(m._id) });
        const user = await UserModel.findOneAndUpdate(
          { phone: m.uploadedBy },
          { $inc: { uploadCount: 1 } },
          { upsert: true, new: true }
        );
        if (user && user.uploadCount % 3 === 0) {
          await UserModel.findOneAndUpdate({ phone: m.uploadedBy }, { $inc: { extraProjects: 1, extraMessages: 10, extraImages: 2 } });
        }
      }
    }
    return { count: pending.length, uploaders };
  } catch (e) { return { count: 0, uploaders: [] }; }
}

export async function recordManualPayment(phone, plan) {
  if (!dbReady) return false;
  try {
    const ref = `MANUAL-${phone}-${Date.now()}`;
    await PaymentModel.create({ phone, reference: ref, plan, amount: PLANS[plan]?.price || 0, status: 'pending' }).catch(() => {});
    return true;
  } catch (_) { return false; }
}

export async function rejectMaterial(id) {
  if (!dbReady) return false;
  try { await MaterialModel.findByIdAndDelete(id); return true; } catch (e) { return false; }
}

export async function getPendingMaterials() {
  if (!dbReady) return [];
  try { return await MaterialModel.find({ approved: false }).sort({ createdAt: -1 }).limit(10); } catch (e) { return []; }
}

export async function getMaterialById(id) {
  if (!dbReady) return null;
  try { return await MaterialModel.findById(id); } catch (e) { return null; }
}

export async function listAllMaterials({ level, category, page = 0, pageSize = 10 } = {}) {
  if (!dbReady) return [];
  try {
    const query = { approved: true };
    if (level) query.level = level;
    if (category) query.category = category;
    return await MaterialModel.find(query).sort({ level: 1, category: 1, createdAt: -1 }).skip(page * pageSize).limit(pageSize);
  } catch (e) { return []; }
}

export async function countAllMaterials({ level, category } = {}) {
  if (!dbReady) return 0;
  try {
    const query = { approved: true };
    if (level) query.level = level;
    if (category) query.category = category;
    return await MaterialModel.countDocuments(query);
  } catch (e) { return 0; }
}

export async function deleteMaterialById(id) {
  if (!dbReady) return false;
  try { await MaterialModel.findByIdAndDelete(id); return true; } catch (e) { return false; }
}

export async function renameMaterialById(id, newTitle) {
  if (!dbReady) return false;
  try {
    const r = await MaterialModel.findByIdAndUpdate(id, { title: newTitle });
    return !!r;
  } catch (e) { return false; }
}

export async function getAllUserPhones() {
  if (!dbReady) return [];
  try { return (await UserModel.find({}, 'phone')).map(u => u.phone).filter(Boolean); } catch (e) { return []; }
}

export async function getAllUsersInfo({ limit = 0 } = {}) {
  if (!dbReady) return [];
  try {
    let q = UserModel.find({}, 'phone plan createdAt uploadCount referralCount').sort({ createdAt: -1 });
    if (limit > 0) q = q.limit(limit);
    return await q;
  } catch (e) { return []; }
}

export async function getUploaderStats(phone) {
  if (!dbReady) return { uploadCount: 0, extraProjects: 0 };
  try {
    const user = await UserModel.findOne({ phone });
    return { uploadCount: user?.uploadCount || 0, extraProjects: user?.extraProjects || 0 };
  } catch (e) { return { uploadCount: 0, extraProjects: 0 }; }
}

export async function useExtraProject(phone) {
  if (!dbReady) return false;
  try {
    const res = await UserModel.findOneAndUpdate(
      { phone, extraProjects: { $gt: 0 } },
      { $inc: { extraProjects: -1 } },
      { new: true }
    );
    return !!res;
  } catch (e) { return false; }
}

// ─── Media download limit (free users: 5/day) ─────────────────────────────────
export function checkDownloadLimit(user) {
  if (!user) return false;
  const p = PLANS[user.plan] || PLANS.FREE;
  if (p.price > 0) return false; // paid users: unlimited downloads
  return (user.usage.mediaDownloads || 0) >= 5;
}

export async function incrementDownload(user) {
  if (!user) return;
  user.usage.mediaDownloads = (user.usage.mediaDownloads || 0) + 1;
  await user.save().catch(() => {});
}

// ─── Get or create user ────────────────────────────────────────────────────────
export async function getUser(phone) {
  if (!dbReady) return null;
  try {
    return await UserModel.findOneAndUpdate(
      { phone },
      { $setOnInsert: { phone } },
      { upsert: true, new: true }
    );
  } catch (e) { console.warn('getUser err:', e.message?.substring(0, 60)); return null; }
}

// ─── Reset daily / monthly counters if needed ──────────────────────────────────
export async function resetUsageIfNeeded(user) {
  if (!user) return;
  const today = todayStr(), month = monthStr();
  const set = {};
  if (user.usage.lastDayReset !== today) {
    user.usage.chatToday      = 0;
    user.usage.imagesToday    = 0;
    user.usage.mediaDownloads = 0;
    if (user.plan === 'FREE') user.usage.pdfToday = 0;
    user.usage.lastDayReset      = today;
    user.usage.lastDownloadReset = today;
    // Reset exhaustion timestamps for the new day
    user.exhaustedChatAt  = 0;
    user.exhaustedImageAt = 0;
    set['usage.chatToday']        = 0;
    set['usage.imagesToday']      = 0;
    set['usage.mediaDownloads']   = 0;
    set['usage.lastDayReset']     = today;
    set['usage.lastDownloadReset']= today;
    set['exhaustedChatAt']        = 0;
    set['exhaustedImageAt']       = 0;
    if (user.plan === 'FREE') set['usage.pdfToday'] = 0;
  }
  if (user.usage.lastMonthReset !== month) {
    user.usage.pdfMonth        = 0;
    if (user.plan !== 'FREE') user.usage.pdfToday = 0;
    user.usage.lastMonthReset  = month;
    set['usage.pdfMonth']      = 0;
    set['usage.lastMonthReset']= month;
    if (user.plan !== 'FREE') set['usage.pdfToday'] = 0;
  }
  if (Object.keys(set).length) {
    try { await UserModel.updateOne({ phone: user.phone }, { $set: set }); }
    catch (_) { try { user.markModified('usage'); await user.save(); } catch (_) {} }
  }
}

// ─── Check limit — returns plan name if exceeded, null if OK ──────────────────
export function checkLimit(user, type) {
  if (!user) return null;
  const p = PLANS[user.plan] || PLANS.FREE;
  const u = user.usage;
  if (type === 'chat') {
    if (u.chatToday >= p.chat && (user.extraMessages || 0) <= 0) return user.plan;
  }
  if (type === 'image') {
    if (u.imagesToday >= p.images && (user.extraImages || 0) <= 0) return user.plan;
  }
  if (type === 'pdf') {
    const used = p.pdfPeriod === 'day' ? u.pdfToday : u.pdfMonth;
    if (used >= p.pdf) return user.plan;
  }
  return null;
}

// ─── Increment usage counter (ATOMIC — prevents bypass under concurrent load) ─
export async function incrementUsage(user, type) {
  if (!user) return;
  const p = PLANS[user.plan] || PLANS.FREE;
  const inc = {};
  let useExtra = false;

  if (type === 'chat') {
    if (user.usage.chatToday >= p.chat && (user.extraMessages || 0) > 0) {
      inc.extraMessages = -1;
      useExtra = true;
    }
    inc['usage.chatToday'] = 1;
    if (useExtra) user.extraMessages = Math.max(0, (user.extraMessages || 0) - 1);
    user.usage.chatToday = (user.usage.chatToday || 0) + 1;
  }
  if (type === 'image') {
    if (user.usage.imagesToday >= p.images && (user.extraImages || 0) > 0) {
      inc.extraImages = -1;
      useExtra = true;
    }
    inc['usage.imagesToday'] = 1;
    if (useExtra) user.extraImages = Math.max(0, (user.extraImages || 0) - 1);
    user.usage.imagesToday = (user.usage.imagesToday || 0) + 1;
  }
  if (type === 'pdf') {
    inc['usage.pdfToday'] = 1;
    inc['usage.pdfMonth'] = 1;
    user.usage.pdfToday = (user.usage.pdfToday || 0) + 1;
    user.usage.pdfMonth = (user.usage.pdfMonth || 0) + 1;
  }

  // Atomic DB update — guarantees the counter persists even if the in-memory
  // doc is stale or another concurrent handler holds a different copy.
  try {
    await UserModel.updateOne({ phone: user.phone }, { $inc: inc });
  } catch (_) {
    // Fall back to .save() with markModified so nested path is tracked
    try { user.markModified('usage'); await user.save(); } catch (_) {}
  }
}

// ─── Activate plan after payment ───────────────────────────────────────────────
export async function activatePlan(phone, plan) {
  if (!dbReady) return;
  await UserModel.findOneAndUpdate(
    { phone },
    { plan, credits: PLAN_CREDITS[plan] || 0 },
    { upsert: true }
  ).catch(() => {});
  await PaymentModel.findOneAndUpdate(
    { phone, status: 'pending' },
    { status: 'paid' }
  ).catch(() => {});
}

// ─── Initiate Paynow EcoCash push payment ──────────────────────────────────────
export async function initiatePaynow(phone, plan, ecocash) {
  const ID  = process.env.PAYNOW_ID  || '';
  const KEY = process.env.PAYNOW_KEY || '';
  if (!ID || !KEY) return { ok: false, error: 'Paynow credentials not configured' };

  try {
    const { Paynow } = await import('paynow');
    const pn = new Paynow(ID, KEY);
    pn.resultUrl = 'https://fundoai.gleeze.com/paynow/result';
    pn.returnUrl = 'https://fundoai.gleeze.com/paynow/return';

    const amount = PLANS[plan]?.price ?? 0;
    const ref    = `FUNDO-${phone}-${Date.now()}`;
    const pmt    = pn.createPayment(ref, `${ecocash}@ecocash.co.zw`);
    pmt.add(`Fundo AI ${PLANS[plan]?.label ?? plan} Plan`, amount);

    const resp = await pn.sendMobile(pmt, ecocash, 'ecocash');
    if (resp.success) {
      await PaymentModel.create({ phone, reference: ref, plan, amount, ecocash, pollUrl: resp.pollUrl }).catch(() => {});
      return { ok: true, pollUrl: resp.pollUrl, reference: ref };
    }
    return { ok: false, error: resp.error || 'Paynow rejected the request' };
  } catch (e) {
    return { ok: false, error: e.message?.substring(0, 100) };
  }
}

// ─── Poll a Paynow transaction ─────────────────────────────────────────────────
export async function pollPaynow(pollUrl) {
  const ID  = process.env.PAYNOW_ID  || '';
  const KEY = process.env.PAYNOW_KEY || '';
  if (!ID || !KEY || !pollUrl) return 'unknown';
  try {
    const { Paynow } = await import('paynow');
    const pn = new Paynow(ID, KEY);
    const st = await pn.pollTransaction(pollUrl);
    return (st.status || 'unknown').toLowerCase();
  } catch (_) { return 'unknown'; }
}

// ─── Referral system ───────────────────────────────────────────────────────────
function makeReferralCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'REF-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function generateReferralCode(phone) {
  if (!dbReady) return null;
  try {
    const user = await UserModel.findOne({ phone });
    if (!user) return null;
    if (user.referralCode) return user.referralCode;
    let code, exists;
    do {
      code = makeReferralCode();
      exists = await UserModel.findOne({ referralCode: code });
    } while (exists);
    await UserModel.updateOne({ phone }, { $set: { referralCode: code } });
    return code;
  } catch (e) { return null; }
}

export async function processReferral(newPhone, referralCode) {
  if (!dbReady) return { ok: false, reason: 'db_off' };
  try {
    const code = (referralCode || '').trim().toUpperCase();
    const referrer = await UserModel.findOne({ referralCode: code });
    if (!referrer) return { ok: false, reason: 'invalid_code' };
    if (referrer.phone === newPhone) return { ok: false, reason: 'self_referral' };
    if (referrer.referredUsers.includes(newPhone)) return { ok: false, reason: 'already_referred' };
    const newUser = await UserModel.findOne({ phone: newPhone });
    if (newUser?.referredBy) return { ok: false, reason: 'already_referred' };
    // Reward referrer: +5 messages, +2 images, +1 project
    await UserModel.updateOne(
      { phone: referrer.phone },
      { $inc: { referralCount: 1, extraMessages: 5, extraImages: 2, extraProjects: 1 }, $push: { referredUsers: newPhone } }
    );
    // Mark new user as referred
    await UserModel.findOneAndUpdate(
      { phone: newPhone },
      { $set: { referredBy: referrer.phone } },
      { upsert: true }
    );
    return { ok: true, referrerPhone: referrer.phone };
  } catch (e) { return { ok: false, reason: 'error' }; }
}

export async function getTopUploaders(limit = 10) {
  if (!dbReady) return [];
  try {
    return await UserModel.find({ uploadCount: { $gt: 0 } })
      .sort({ uploadCount: -1 })
      .limit(limit)
      .select('phone uploadCount referralCount plan');
  } catch (e) { return []; }
}

// Record when user first hits a daily limit (only sets once per day; cleared at daily reset)
export async function recordLimitExhaustion(phone, type) {
  if (!dbReady) return;
  const field = type === 'chat' ? 'exhaustedChatAt' : type === 'image' ? 'exhaustedImageAt' : null;
  if (!field) return;
  try {
    // Only set if not already set (value is 0) — don't overwrite the original hit time
    await UserModel.updateOne({ phone, [field]: 0 }, { $set: { [field]: Date.now() } });
  } catch (_) {}
}

// ─── Gift Code System (file-based) ────────────────────────────────────────────
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename2 = fileURLToPath(import.meta.url);
const __dirname2  = path.dirname(__filename2);
const GIFT_CODES_FILE = path.join(__dirname2, 'data', 'giftcodes.json');

function loadGiftCodes() {
  try {
    if (fs.existsSync(GIFT_CODES_FILE)) return JSON.parse(fs.readFileSync(GIFT_CODES_FILE, 'utf8'));
  } catch (_) {}
  return {};
}

function saveGiftCodes(codes) {
  try { fs.writeFileSync(GIFT_CODES_FILE, JSON.stringify(codes, null, 2), 'utf8'); } catch (_) {}
}

function randomCode(len = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < len; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function generateGiftCode(plan, customCode = null, maxUses = 1) {
  const validPlans = ['STARTER', 'BASIC', 'PRO', 'PREMIUM'];
  if (!validPlans.includes(plan.toUpperCase())) return null;
  const codes = loadGiftCodes();
  const code = (customCode || randomCode()).toUpperCase();
  const limit = (maxUses && maxUses > 0) ? maxUses : 1;
  codes[code] = {
    plan: plan.toUpperCase(),
    maxUses: limit,
    usedCount: 0,
    usedBy: [],
    createdAt: Date.now(),
  };
  saveGiftCodes(codes);
  return code;
}

export async function redeemGiftCode(code, phone) {
  const codes = loadGiftCodes();
  const entry = codes[code.toUpperCase()];
  if (!entry) return { ok: false, error: 'Invalid gift code. Please check and try again!' };
  const usedCount = entry.usedCount ?? (entry.used ? 1 : 0);
  const maxUses   = entry.maxUses ?? 1;
  if (usedCount >= maxUses) return { ok: false, error: 'This gift code has already been fully redeemed.' };
  const usedBy = Array.isArray(entry.usedBy) ? entry.usedBy : (entry.usedBy ? [entry.usedBy] : []);
  if (usedBy.includes(phone)) return { ok: false, error: 'You have already redeemed this gift code.' };
  entry.usedCount = usedCount + 1;
  entry.usedBy    = [...usedBy, phone];
  entry.used      = entry.usedCount >= maxUses;
  entry.usedAt    = Date.now();
  saveGiftCodes(codes);
  await activatePlan(phone, entry.plan);
  return { ok: true, plan: entry.plan };
}

export function listGiftCodes() {
  return loadGiftCodes();
}
