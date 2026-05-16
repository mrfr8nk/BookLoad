import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Users, BookOpen, Clock, Upload, Search, Filter,
  ChevronLeft, ChevronRight, Trash2, Edit3, Check, X, LogOut,
  Eye, EyeOff, Shield, Database, TrendingUp, Star, Award,
  FileText, CheckCircle, AlertCircle, RefreshCw, Zap, ArrowUpRight,
  MoreHorizontal, ChevronDown, Package, Layers, Plus, Lock
} from 'lucide-react';
import { motion as m } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import { useToast } from '../hooks/useToast.jsx';
import { useApi } from '../hooks/useApi.js';

const PLANS = ['FREE', 'STARTER', 'BASIC', 'PRO', 'PREMIUM'];
const SUBJECTS = {
  primary: ['Mathematics','English','Shona','Ndebele','Science','Social Studies','Environmental Science','Art & Craft'],
  olevel: ['Mathematics','English Language','English Literature','History','Geography','Biology','Chemistry','Physics','Combined Science','Agriculture','Commerce','Accounting','Economics','Business Studies','Computer Science','Food & Nutrition','Fashion & Fabrics','Art','Shona','Ndebele'],
  alevel: ['Mathematics','Pure Mathematics','Statistics','Further Mathematics','Physics','Chemistry','Biology','History','Geography','Economics','Business Studies','Accounting','Computer Science','English Literature'],
};
const GRADES = {
  primary: ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7'],
  olevel: ['Form 1','Form 2','Form 3','Form 4'],
  alevel: ['Lower 6','Upper 6'],
};
const CAT_LABEL = { paper:'Past Paper', textbook:'Textbook', syllabus:'Syllabus', marking_scheme:'Marking Scheme' };
const LVL_LABEL = { primary:'Primary', olevel:'O-Level', alevel:'A-Level' };
const CAT_COLOR = { paper:'#a5b4fc', textbook:'#67e8f9', syllabus:'#6ee7b7', marking_scheme:'#fcd34d' };
const CAT_BG = { paper:'rgba(99,102,241,0.12)', textbook:'rgba(6,182,212,0.12)', syllabus:'rgba(16,185,129,0.12)', marking_scheme:'rgba(245,158,11,0.12)' };
const PLAN_COLOR = { FREE:'#ccc', STARTER:'#67e8f9', BASIC:'#6ee7b7', PRO:'#c4b5fd', PREMIUM:'#fcd34d' };
const PLAN_BG = { FREE:'rgba(255,255,255,0.08)', STARTER:'rgba(6,182,212,0.12)', BASIC:'rgba(16,185,129,0.12)', PRO:'rgba(139,92,246,0.12)', PREMIUM:'rgba(245,158,11,0.12)' };

const years = () => { const cur = new Date().getFullYear(); return Array.from({ length: 20 }, (_, i) => String(cur - i)); };

function Badge({ label, color, bg }) {
  return <span style={{ display: 'inline-block', padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600, color: color || '#a5b4fc', background: bg || 'rgba(99,102,241,0.12)' }}>{label}</span>;
}

function StatCard({ icon: Icon, val, label, color = '#a5b4fc', bg = 'rgba(99,102,241,0.1)', border = 'rgba(99,102,241,0.2)', gradVariant = 'default', delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  const grads = { default: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', green: 'linear-gradient(135deg,#10b981,#06b6d4)', amber: 'linear-gradient(135deg,#f59e0b,#f97316)', red: 'linear-gradient(135deg,#ef4444,#ec4899)' };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      animate={{ y: hovered ? -3 : 0 }}
      style={{
        background: 'rgba(255,255,255,0.04)', border: `1px solid ${hovered ? 'rgba(99,102,241,0.28)' : 'rgba(255,255,255,0.09)'}`,
        borderRadius: 16, padding: '20px 22px', position: 'relative', overflow: 'hidden',
        transition: 'border-color .2s', cursor: 'default',
      }}
    >
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: grads[gradVariant], pointerEvents: 'none' }} />
      <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1.2px', marginBottom: 3, color }}>{val ?? '—'}</div>
      <div style={{ fontSize: 12, color: 'rgba(240,242,255,0.48)', fontWeight: 500 }}>{label}</div>
    </motion.div>
  );
}

function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(5,5,26,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.34, 1.2, 0.64, 1] }}
            onClick={e => e.stopPropagation()}
            style={{ background: '#10102a', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 22, padding: 32, width: 500, maxWidth: '95vw', boxShadow: '0 40px 80px rgba(0,0,0,0.7),0 0 80px rgba(99,102,241,0.08)', display: 'flex', flexDirection: 'column', gap: 18 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.4px' }}>{title}</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(240,242,255,0.45)', fontSize: 22, cursor: 'pointer', padding: 2, lineHeight: 1 }}><X size={20} /></button>
            </div>
            <div>{children}</div>
            {footer && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Btn({ children, onClick, variant = 'ghost', size = 'md', disabled, style: extraStyle }) {
  const [hov, setHov] = useState(false);
  const base = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 10, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all .18s', border: '1px solid transparent', fontFamily: 'inherit', whiteSpace: 'nowrap', opacity: disabled ? 0.4 : 1 };
  const sizes = { sm: { padding: '7px 12px', fontSize: 12, borderRadius: 8 }, md: { padding: '10px 18px', fontSize: 13.5 }, xs: { padding: '5px 10px', fontSize: 11, borderRadius: 6 } };
  const variants = {
    primary: { background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', color: '#fff', border: 'none', boxShadow: hov ? '0 8px 28px rgba(99,102,241,0.5)' : '0 4px 20px rgba(99,102,241,0.4)', transform: hov ? 'translateY(-1px)' : 'none' },
    ghost:   { background: hov ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)', color: '#f0f2ff', borderColor: hov ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.09)' },
    danger:  { background: hov ? 'rgba(239,68,68,0.22)' : 'rgba(239,68,68,0.12)', color: '#fca5a5', borderColor: 'rgba(239,68,68,0.25)' },
    success: { background: hov ? 'rgba(16,185,129,0.22)' : 'rgba(16,185,129,0.12)', color: '#6ee7b7', borderColor: 'rgba(16,185,129,0.25)' },
  };
  return (
    <button onClick={disabled ? undefined : onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ ...base, ...sizes[size], ...variants[variant], ...extraStyle }}>
      {children}
    </button>
  );
}

function FormGroup({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: 'rgba(240,242,255,0.45)' }}>{label}</label>
      {children}
    </div>
  );
}

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const toast = useToast();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function doLogin(e) {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: user, password: pass }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Invalid credentials');
      localStorage.setItem('fundo_token', data.token);
      onLogin(data.token);
    } catch (e) { setErr(e.message); }
    setLoading(false);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,5,26,0.92)', backdropFilter: 'blur(32px)' }}>
      <div className="bg-mesh" style={{ position: 'absolute' }} />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 24, padding: '48px 44px', width: 420, maxWidth: '95vw', backdropFilter: 'blur(24px)', boxShadow: '0 40px 80px rgba(0,0,0,0.6),0 0 120px rgba(99,102,241,0.1)', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(99,102,241,0.4)', overflow: 'hidden', flexShrink: 0 }}>
            <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.4px' }}>Fundo AI</div>
            <div style={{ fontSize: 12, color: 'rgba(240,242,255,0.45)' }}>Admin Dashboard</div>
          </div>
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.8px', marginBottom: 8 }}>Welcome back</h2>
        <p style={{ fontSize: 14, color: 'rgba(240,242,255,0.48)', lineHeight: 1.6, marginBottom: 28 }}>Sign in to manage resources, analytics, and users.</p>

        <AnimatePresence>
          {err && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fca5a5', fontSize: 13, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
                <AlertCircle size={14} /> {err}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={doLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormGroup label="Username">
            <input type="text" value={user} onChange={e => setUser(e.target.value)} placeholder="Admin username" autoComplete="username" required />
          </FormGroup>
          <FormGroup label="Password">
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" autoComplete="current-password" required style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(240,242,255,0.4)', cursor: 'pointer', padding: 0, display: 'flex' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormGroup>
          <motion.button
            type="submit" disabled={loading}
            whileHover={{ translateY: -1, boxShadow: '0 8px 28px rgba(99,102,241,0.5)' }}
            style={{ marginTop: 8, padding: '13px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, opacity: loading ? 0.7 : 1, boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
          >
            {loading ? <><span className="spinner" style={{ width: 17, height: 17 }} /> Signing in…</> : <><Lock size={16} /> Sign In</>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Resources Tab ─────────────────────────────────────────────────────────────
function ResourcesTab({ api, upload, toast }) {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Upload sidebar state
  const fileInputRef = useRef();
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [upLevel, setUpLevel] = useState('olevel');
  const [upCategory, setUpCategory] = useState('paper');
  const [upGrade, setUpGrade] = useState('Form 1');
  const [upSubject, setUpSubject] = useState('');
  const [upYear, setUpYear] = useState('');
  const [upCurriculum, setUpCurriculum] = useState('');
  const [uploading, setUploading] = useState(false);
  const [upProgress, setUpProgress] = useState({ done: 0, total: 0, label: '' });
  const [showUpProgress, setShowUpProgress] = useState(false);

  // Edit / delete modals
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [deletingName, setDeletingName] = useState('');

  const searchTimer = useRef();

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { loadMaterials(); }, [page, catFilter, levelFilter]);

  function onSearchChange(v) {
    setSearch(v);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => { setPage(1); loadMaterials(v); }, 320);
  }

  async function loadStats() {
    try { const d = await api('GET', '/api/stats'); setStats(d); } catch {}
  }

  async function loadMaterials(searchOverride) {
    setLoading(true);
    const q = new URLSearchParams({ page, limit: 20, search: searchOverride ?? search, ...(catFilter && { category: catFilter }), ...(levelFilter && { level: levelFilter }) });
    try {
      const d = await api('GET', `/api/materials?${q}`);
      setItems(d.items); setTotal(d.total); setPages(d.pages);
    } catch (e) { toast(e.message, 'error'); }
    setLoading(false);
  }

  function toggleSelect(id) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function toggleAll(checked) { setSelectedIds(checked ? items.map(i => i._id) : []); }

  async function bulkDelete() {
    if (!selectedIds.length || !window.confirm(`Delete ${selectedIds.length} resource(s)?`)) return;
    try { await api('DELETE', '/api/materials', { ids: selectedIds }); toast(`${selectedIds.length} deleted`, 'success'); setSelectedIds([]); loadMaterials(); loadStats(); }
    catch (e) { toast(e.message, 'error'); }
  }

  function openEdit(m) {
    setEditData({ id: m._id, title: m.title, category: m.category, level: m.level, grade: m.grade || '', subject: m.subject, year: m.year || '', approved: m.approved });
    setEditModal(true);
  }

  async function saveEdit() {
    try {
      await api('PATCH', `/api/materials/${editData.id}`, { title: editData.title, category: editData.category, level: editData.level, grade: editData.grade, subject: editData.subject, year: editData.year, approved: editData.approved });
      toast('Resource updated', 'success'); setEditModal(false); loadMaterials(); loadStats();
    } catch (e) { toast(e.message, 'error'); }
  }

  async function confirmDelete() {
    try { await api('DELETE', `/api/materials/${deletingId}`); toast('Deleted', 'success'); setDeleteModal(false); loadMaterials(); loadStats(); }
    catch (e) { toast(e.message, 'error'); }
  }

  async function doUpload() {
    if (!files.length) { toast('No files selected', 'error'); return; }
    if (!upSubject) { toast('Select a subject', 'error'); return; }
    setUploading(true); setShowUpProgress(true);
    const subjectFull = upCurriculum ? `${upSubject} (${upCurriculum})` : upSubject;
    const total = files.length; let done = 0, ok = 0, fail = 0;
    for (const f of files) {
      setUpProgress({ done, total, label: `Uploading ${done + 1} of ${total}…` });
      const fd = new FormData();
      fd.append('file', f, f.name);
      fd.append('title', f.name.replace(/\.[^.]+$/, ''));
      fd.append('category', upCategory); fd.append('level', upLevel);
      fd.append('grade', upGrade); fd.append('subject', subjectFull); fd.append('year', upYear);
      try { await upload('/api/materials/upload', fd); ok++; } catch { fail++; }
      done++;
    }
    setUpProgress({ done: total, total, label: `Done — ${ok} uploaded${fail ? `, ${fail} failed` : ''}` });
    if (ok) toast(`${ok} file(s) uploaded`, 'success');
    if (fail) toast(`${fail} file(s) failed`, 'error');
    setFiles([]); setUploading(false);
    setTimeout(() => setShowUpProgress(false), 3500);
    loadMaterials(); loadStats();
  }

  const subjects = SUBJECTS[upLevel] || [];
  const grades = GRADES[upLevel] || [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', minHeight: 'calc(100vh - 112px)' }}>
      {/* Sidebar */}
      <div style={{ borderRight: '1px solid rgba(255,255,255,0.09)', padding: '20px 18px', background: 'rgba(255,255,255,0.012)', display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 112, height: 'calc(100vh - 112px)', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.3px', color: 'rgba(240,242,255,0.4)', textTransform: 'uppercase' }}>Upload Resources</div>

        {/* Stats mini */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[{ label: 'Total', val: stats.total, color: '#a5b4fc' }, { label: 'Live', val: stats.approved, color: '#6ee7b7' }, { label: 'Pending', val: stats.pending, color: '#fcd34d' }].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 10, color: 'rgba(240,242,255,0.4)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); setFiles(prev => [...prev, ...[...e.dataTransfer.files]].slice(0, 100)); }}
          onClick={() => fileInputRef.current?.click()}
          style={{ border: `1.5px dashed ${dragging ? 'rgba(99,102,241,0.65)' : 'rgba(99,102,241,0.3)'}`, borderRadius: 12, padding: '28px 12px', textAlign: 'center', cursor: 'pointer', background: dragging ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.025)', transition: 'all .25s', position: 'relative', overflow: 'hidden' }}
        >
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
            <Upload size={24} style={{ color: '#a5b4fc', marginBottom: 8 }} />
          </motion.div>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 3 }}>{files.length ? `${files.length} file(s) ready` : 'Drop files or click'}</div>
          <div style={{ fontSize: 10.5, color: 'rgba(240,242,255,0.4)' }}>PDF, DOC, PPTX — up to 80MB</div>
          <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={e => { setFiles(prev => [...prev, ...[...e.target.files]].slice(0, 100)); e.target.value = ''; }} />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 160, overflowY: 'auto' }}>
            {files.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '7px 9px' }}>
                <FileText size={12} style={{ color: '#a5b4fc', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 10.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'rgba(240,242,255,0.7)' }}>{f.name}</span>
                <button onClick={() => setFiles(p => p.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'rgba(240,242,255,0.35)', cursor: 'pointer', padding: 0, display: 'flex' }}><X size={11} /></button>
              </div>
            ))}
          </div>
        )}

        {/* Upload fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Category', val: upCategory, set: setUpCategory, opts: [['paper','Past Paper'],['textbook','Textbook'],['syllabus','Syllabus'],['marking_scheme','Marking Scheme']] },
            { label: 'Level', val: upLevel, set: v => { setUpLevel(v); setUpSubject(''); setUpGrade(GRADES[v]?.[0]||''); }, opts: [['primary','Primary'],['olevel','O-Level'],['alevel','A-Level']] },
          ].map(({ label, val, set, opts }) => (
            <div key={label}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: 'rgba(240,242,255,0.4)', marginBottom: 4 }}>{label}</div>
              <select value={val} onChange={e => set(e.target.value)} style={{ fontSize: 12 }}>
                {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ))}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: 'rgba(240,242,255,0.4)', marginBottom: 4 }}>Subject</div>
            <select value={upSubject} onChange={e => setUpSubject(e.target.value)} style={{ fontSize: 12 }}>
              <option value="">— Select —</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: 'rgba(240,242,255,0.4)', marginBottom: 4 }}>Grade</div>
              <select value={upGrade} onChange={e => setUpGrade(e.target.value)} style={{ fontSize: 11 }}>
                {grades.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: 'rgba(240,242,255,0.4)', marginBottom: 4 }}>Year</div>
              <select value={upYear} onChange={e => setUpYear(e.target.value)} style={{ fontSize: 11 }}>
                <option value="">None</option>
                {years().map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: 'rgba(240,242,255,0.4)', marginBottom: 4 }}>Curriculum</div>
            <select value={upCurriculum} onChange={e => setUpCurriculum(e.target.value)} style={{ fontSize: 12 }}>
              <option value="">General</option>
              <option value="ZIMSEC">ZIMSEC</option>
              <option value="Cambridge">Cambridge</option>
            </select>
          </div>
        </div>

        {/* Progress */}
        <AnimatePresence>
          {showUpProgress && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
              <div style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, marginBottom: 6 }}>{upProgress.label}</div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div animate={{ width: `${upProgress.total ? (upProgress.done / upProgress.total) * 100 : 0}%` }} transition={{ duration: 0.3 }} style={{ height: '100%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', borderRadius: 99 }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Btn variant="primary" onClick={doUpload} disabled={uploading || !files.length} style={{ width: '100%' }}>
          {uploading ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Uploading…</> : <><Upload size={14} /> Upload Files</>}
        </Btn>
      </div>

      {/* Main content */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Stats row */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            <StatCard icon={Database} val={stats.total} label="Total Resources" delay={0} />
            <StatCard icon={CheckCircle} val={stats.approved} label="Live Materials" color="#6ee7b7" bg="rgba(16,185,129,0.1)" border="rgba(16,185,129,0.2)" gradVariant="green" delay={0.05} />
            <StatCard icon={Clock} val={stats.pending} label="Pending Review" color="#fcd34d" bg="rgba(245,158,11,0.1)" border="rgba(245,158,11,0.2)" gradVariant="amber" delay={0.1} />
            <StatCard icon={Layers} val={stats.byCategory?.length ?? 0} label="Categories" color="#c4b5fd" bg="rgba(139,92,246,0.1)" border="rgba(139,92,246,0.2)" delay={0.15} />
          </div>
        )}

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,242,255,0.35)', pointerEvents: 'none' }} />
            <input type="text" value={search} onChange={e => onSearchChange(e.target.value)} placeholder="Search resources…" style={{ paddingLeft: 38 }} />
          </div>
          <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }} style={{ width: 'auto', fontSize: 13 }}>
            <option value="">All categories</option>
            {Object.entries(CAT_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select value={levelFilter} onChange={e => { setLevelFilter(e.target.value); setPage(1); }} style={{ width: 'auto', fontSize: 13 }}>
            <option value="">All levels</option>
            {Object.entries(LVL_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <Btn variant="ghost" size="md" onClick={() => { loadMaterials(); loadStats(); }}><RefreshCw size={14} /></Btn>
        </div>

        {/* Bulk bar */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, padding: '10px 16px', fontSize: 13 }}>
                <span style={{ fontWeight: 700, color: '#a5b4fc' }}>{selectedIds.length} selected</span>
                <Btn variant="danger" size="xs" onClick={bulkDelete}><Trash2 size={11} /> Delete Selected</Btn>
                <Btn variant="ghost" size="xs" onClick={() => setSelectedIds([])}><X size={11} /> Clear</Btn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Resources · {total}</span>
          </div>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" /></div>
          ) : items.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'rgba(240,242,255,0.4)' }}>
              <Database size={36} style={{ marginBottom: 14, opacity: 0.4 }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f0f2ff', marginBottom: 5 }}>No resources found</div>
              <div style={{ fontSize: 13 }}>Try different filters or upload some materials.</div>
            </div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ width: 36, padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'rgba(240,242,255,0.4)', letterSpacing: '.7px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.015)' }}>
                      <input type="checkbox" checked={selectedIds.length === items.length && items.length > 0} onChange={e => toggleAll(e.target.checked)} />
                    </th>
                    {['Title', 'Category', 'Level', 'Subject', 'Year', 'Status', ''].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'rgba(240,242,255,0.4)', letterSpacing: '.7px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.015)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((m, idx) => (
                    <motion.tr
                      key={m._id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >
                      <td style={{ padding: '10px 16px' }}>
                        <input type="checkbox" checked={selectedIds.includes(m._id)} onChange={() => toggleSelect(m._id)} />
                      </td>
                      <td style={{ padding: '10px 16px', maxWidth: 200 }}>
                        <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 190, fontSize: 13 }} title={m.title}>{m.title}</div>
                        <a href={m.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'rgba(240,242,255,0.4)', textDecoration: 'none' }}>↗ CDN link</a>
                      </td>
                      <td style={{ padding: '10px 16px' }}><Badge label={CAT_LABEL[m.category] || m.category} color={CAT_COLOR[m.category]} bg={CAT_BG[m.category]} /></td>
                      <td style={{ padding: '10px 16px', fontSize: 13 }}>{LVL_LABEL[m.level] || m.level}</td>
                      <td style={{ padding: '10px 16px', fontSize: 13 }}>{m.subject}</td>
                      <td style={{ padding: '10px 16px' }}>{m.year ? <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.07)', borderRadius: 4, padding: '2px 7px', fontSize: 11, color: 'rgba(240,242,255,0.5)' }}>{m.year}</span> : <span style={{ color: 'rgba(240,242,255,0.2)' }}>—</span>}</td>
                      <td style={{ padding: '10px 16px' }}><Badge label={m.approved ? 'Live' : 'Pending'} color={m.approved ? '#6ee7b7' : '#fcd34d'} bg={m.approved ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)'} /></td>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <Btn variant="ghost" size="xs" onClick={() => openEdit(m)}><Edit3 size={11} /> Edit</Btn>
                          <Btn variant="danger" size="xs" onClick={() => { setDeletingId(m._id); setDeletingName(m.title); setDeleteModal(true); }}><Trash2 size={11} /></Btn>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.015)', fontSize: 13, color: 'rgba(240,242,255,0.45)' }}>
                <span>{total} resources · Page {page} of {pages}</span>
                <div style={{ display: 'flex', gap: 5 }}>
                  <Btn variant="ghost" size="xs" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft size={13} /></Btn>
                  <Btn variant="ghost" size="xs" disabled={page >= pages} onClick={() => setPage(p => Math.min(pages, p + 1))}><ChevronRight size={13} /></Btn>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Resource" footer={<><Btn variant="ghost" onClick={() => setEditModal(false)}>Cancel</Btn><Btn variant="primary" onClick={saveEdit}>Save Changes</Btn></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FormGroup label="Title"><input value={editData.title || ''} onChange={e => setEditData(d => ({ ...d, title: e.target.value }))} /></FormGroup>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FormGroup label="Category">
              <select value={editData.category || 'paper'} onChange={e => setEditData(d => ({ ...d, category: e.target.value }))}>
                {Object.entries(CAT_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Level">
              <select value={editData.level || 'olevel'} onChange={e => setEditData(d => ({ ...d, level: e.target.value }))}>
                {Object.entries(LVL_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Grade"><input value={editData.grade || ''} onChange={e => setEditData(d => ({ ...d, grade: e.target.value }))} /></FormGroup>
            <FormGroup label="Year">
              <select value={editData.year || ''} onChange={e => setEditData(d => ({ ...d, year: e.target.value }))}>
                <option value="">None</option>
                {years().map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Subject">
              <select value={editData.subject || ''} onChange={e => setEditData(d => ({ ...d, subject: e.target.value }))}>
                <option value="">— Select —</option>
                {(SUBJECTS[editData.level] || []).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Status">
              <select value={String(editData.approved)} onChange={e => setEditData(d => ({ ...d, approved: e.target.value === 'true' }))}>
                <option value="true">Live</option>
                <option value="false">Pending</option>
              </select>
            </FormGroup>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Resource" footer={<><Btn variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Btn><Btn variant="danger" onClick={confirmDelete}><Trash2 size={13} /> Delete</Btn></>}>
        <p style={{ fontSize: 14, color: 'rgba(240,242,255,0.6)', lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: '#f0f2ff' }}>{deletingName}</strong>? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

// ── Analytics Tab ─────────────────────────────────────────────────────────────
function AnalyticsTab({ api, toast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { const d = await api('GET', '/api/analytics'); setData(d); }
    catch (e) { toast(e.message, 'error'); }
    setLoading(false);
  }

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  };

  const planOrder = ['FREE', 'STARTER', 'BASIC', 'PRO', 'PREMIUM'];
  const planColors = { FREE: 'rgba(200,200,200,0.35)', STARTER: '#06b6d4', BASIC: '#10b981', PRO: '#8b5cf6', PREMIUM: '#f59e0b' };

  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}><span className="spinner" /></div>;
  if (!data) return null;

  const last7 = getLast7Days();
  const trend = data.signupTrend || [];
  const maxTrend = Math.max(...trend.map(t => t.count), 1);
  const maxPlan = Math.max(...(data.planBreakdown || []).map(p => p.count), 1);

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* User stats */}
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)' }} />
          User Overview
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {[
            { icon: Users, val: data.users?.total, label: 'Total Users', color: '#a5b4fc', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' },
            { icon: TrendingUp, val: data.users?.today, label: 'Joined Today', color: '#6ee7b7', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', gradVariant: 'green' },
            { icon: BarChart3, val: data.users?.week, label: 'This Week', color: '#fcd34d', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', gradVariant: 'amber' },
            { icon: Star, val: data.users?.month, label: 'This Month', color: '#c4b5fd', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' },
            { icon: Database, val: data.materials?.total, label: 'Live Materials', color: '#a5b4fc', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' },
            { icon: Clock, val: data.materials?.pending, label: 'Pending', color: '#fcd34d', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', gradVariant: 'amber' },
            { icon: Upload, val: data.materials?.community, label: 'Community', color: '#6ee7b7', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', gradVariant: 'green' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              whileHover={{ y: -3, borderColor: 'rgba(99,102,241,0.28)' }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: '22px 20px', transition: 'border-color .2s' }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1.2px', color: s.color, marginBottom: 4 }}>{s.val ?? '—'}</div>
              <div style={{ fontSize: 12, color: 'rgba(240,242,255,0.48)', fontWeight: 500 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Signup Trend + Plan Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* Trend */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Signup Trend (7 days)</span>
            <TrendingUp size={15} style={{ color: 'rgba(240,242,255,0.4)' }} />
          </div>
          <div style={{ padding: '18px', display: 'flex', alignItems: 'flex-end', gap: 6, height: 130 }}>
            {last7.map(day => {
              const t = trend.find(x => x._id === day) || { count: 0 };
              const pct = (t.count / maxTrend) * 100;
              return (
                <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 9, color: 'rgba(240,242,255,0.4)' }}>{t.count || ''}</span>
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: `${Math.max(pct * 0.7, t.count ? 4 : 2)}px` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ width: '100%', background: t.count ? 'linear-gradient(180deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.06)', borderRadius: '4px 4px 0 0', minHeight: 3 }}
                  />
                  <span style={{ fontSize: 9, color: 'rgba(240,242,255,0.35)' }}>{day.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plan breakdown */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Plan Distribution</span>
            <Award size={15} style={{ color: 'rgba(240,242,255,0.4)' }} />
          </div>
          <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 11 }}>
            {planOrder.map(plan => {
              const p = (data.planBreakdown || []).find(x => x._id === plan) || { count: 0 };
              return (
                <div key={plan} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, width: 72, flexShrink: 0 }}>{plan}</span>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round((p.count / maxPlan) * 100)}%` }} transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }} style={{ height: '100%', background: planColors[plan], borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(240,242,255,0.4)', width: 30, textAlign: 'right', flexShrink: 0 }}>{p.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {[
          { title: 'Top Uploaders', icon: Upload, rows: data.topUploaders, valKey: 'uploadCount', nameKey: 'name', subKey: 'plan', valColor: '#a5b4fc' },
          { title: 'Recent Signups', icon: Users, rows: data.recentSignups, nameKey: 'name', subKey: 'plan', showBadge: true },
        ].map(({ title, icon: Icon, rows, valKey, nameKey, subKey, valColor, showBadge }) => (
          <div key={title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{title}</span>
              <Icon size={15} style={{ color: 'rgba(240,242,255,0.4)' }} />
            </div>
            <div>
              {(rows || []).length === 0 ? (
                <div style={{ padding: '20px 18px', color: 'rgba(240,242,255,0.4)', fontSize: 13 }}>No data yet</div>
              ) : (
                (rows || []).map((u, i) => (
                  <motion.div
                    key={u.phone || i}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                  >
                    {valKey && <div style={{ fontSize: 12, color: 'rgba(240,242,255,0.4)', width: 20, textAlign: 'center' }}>{i + 1}</div>}
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>
                      {u.name ? u.name[0].toUpperCase() : '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u[nameKey] || u.phone}</div>
                      <div style={{ fontSize: 11, color: 'rgba(240,242,255,0.4)', marginTop: 1 }}>
                        {showBadge ? <Badge label={u[subKey]} color={PLAN_COLOR[u[subKey]]} bg={PLAN_BG[u[subKey]]} /> : u[subKey]}
                      </div>
                    </div>
                    {valKey && <div style={{ fontSize: 14, fontWeight: 700, color: valColor, flexShrink: 0 }}>{u[valKey]}</div>}
                    {showBadge && !valKey && <div style={{ fontSize: 11, color: 'rgba(240,242,255,0.35)' }}>{new Date(u.createdAt).toLocaleDateString()}</div>}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Users Tab ─────────────────────────────────────────────────────────────────
function UsersTab({ api, toast }) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [planModal, setPlanModal] = useState(false);
  const [planPhone, setPlanPhone] = useState('');
  const [newPlan, setNewPlan] = useState('FREE');
  const searchTimer = useRef();

  useEffect(() => { loadUsers(); }, [page, planFilter]);

  function onSearch(v) {
    setSearch(v);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => { setPage(1); loadUsers(v); }, 320);
  }

  async function loadUsers(searchOverride) {
    setLoading(true);
    const q = new URLSearchParams({ page, limit: 30, search: searchOverride ?? search, ...(planFilter && { plan: planFilter }) });
    try { const d = await api('GET', `/api/users?${q}`); setUsers(d.users); setTotal(d.total); setPages(d.pages); }
    catch (e) { toast(e.message, 'error'); }
    setLoading(false);
  }

  async function savePlan() {
    try { await api('PATCH', `/api/users/${planPhone}/plan`, { plan: newPlan }); toast('Plan updated', 'success'); setPlanModal(false); loadUsers(); }
    catch (e) { toast(e.message, 'error'); }
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,242,255,0.35)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => onSearch(e.target.value)} placeholder="Search by phone, name, school…" style={{ paddingLeft: 38 }} />
        </div>
        <select value={planFilter} onChange={e => { setPlanFilter(e.target.value); setPage(1); }} style={{ width: 'auto', fontSize: 13 }}>
          <option value="">All plans</option>
          {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <Btn variant="ghost" onClick={() => loadUsers()}><RefreshCw size={14} /></Btn>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', fontSize: 14, fontWeight: 700 }}>
          Users · {total}
        </div>
        {loading ? <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" /></div> : users.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'rgba(240,242,255,0.4)' }}>
            <Users size={36} style={{ marginBottom: 14, opacity: 0.4 }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f0f2ff', marginBottom: 5 }}>No users found</div>
          </div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Phone', 'Name', 'Plan', 'School', 'Uploads', 'Joined', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'rgba(240,242,255,0.4)', letterSpacing: '.7px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.015)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <motion.tr
                    key={u.phone}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: 12, color: 'rgba(240,242,255,0.6)' }}>{u.phone}</td>
                    <td style={{ padding: '10px 16px' }}>{u.name ? <span style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 5, padding: '2px 7px', fontSize: 12 }}>{u.name}</span> : <span style={{ color: 'rgba(240,242,255,0.2)' }}>—</span>}</td>
                    <td style={{ padding: '10px 16px' }}><Badge label={u.plan} color={PLAN_COLOR[u.plan]} bg={PLAN_BG[u.plan]} /></td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: 'rgba(240,242,255,0.5)' }}>{u.school || <span style={{ color: 'rgba(240,242,255,0.2)' }}>—</span>}</td>
                    <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#a5b4fc' }}>{u.uploadCount || 0}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: 'rgba(240,242,255,0.45)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <Btn variant="ghost" size="xs" onClick={() => { setPlanPhone(u.phone); setNewPlan(u.plan); setPlanModal(true); }}>Change Plan</Btn>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.015)', fontSize: 13, color: 'rgba(240,242,255,0.45)' }}>
              <span>{total} users · Page {page} of {pages}</span>
              <div style={{ display: 'flex', gap: 5 }}>
                <Btn variant="ghost" size="xs" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={13} /></Btn>
                <Btn variant="ghost" size="xs" disabled={page >= pages} onClick={() => setPage(p => p + 1)}><ChevronRight size={13} /></Btn>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal open={planModal} onClose={() => setPlanModal(false)} title="Change User Plan" footer={<><Btn variant="ghost" onClick={() => setPlanModal(false)}>Cancel</Btn><Btn variant="primary" onClick={savePlan}>Save Plan</Btn></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13, color: 'rgba(240,242,255,0.55)' }}>Updating plan for <strong style={{ color: '#a5b4fc', fontFamily: 'monospace' }}>{planPhone}</strong></p>
          <FormGroup label="New Plan">
            <select value={newPlan} onChange={e => setNewPlan(e.target.value)}>
              {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </FormGroup>
        </div>
      </Modal>
    </div>
  );
}

// ── Pending Tab ───────────────────────────────────────────────────────────────
function PendingTab({ api, toast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const d = await api('GET', '/api/materials?page=1&limit=100');
      setItems((d.items || []).filter(m => !m.approved));
    } catch (e) { toast(e.message, 'error'); }
    setLoading(false);
  }

  async function approve(id) {
    try { await api('POST', `/api/materials/${id}/approve`); toast('Approved ✓', 'success'); load(); }
    catch (e) { toast(e.message, 'error'); }
  }

  async function reject(id) {
    if (!window.confirm('Delete this submission?')) return;
    try { await api('DELETE', `/api/materials/${id}`); toast('Rejected & deleted', 'info'); load(); }
    catch (e) { toast(e.message, 'error'); }
  }

  async function approveAll() {
    if (!window.confirm(`Approve all ${items.length} pending submissions?`)) return;
    await Promise.all(items.map(m => api('POST', `/api/materials/${m._id}/approve`).catch(() => {})));
    toast(`${items.length} approved`, 'success'); load();
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Pending Review</h2>
          <p style={{ fontSize: 13, color: 'rgba(240,242,255,0.45)', marginTop: 3 }}>{items.length} submission{items.length !== 1 ? 's' : ''} awaiting approval</p>
        </div>
        {items.length > 0 && <Btn variant="success" onClick={approveAll}><CheckCircle size={14} /> Approve All</Btn>}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" /></div>
          : items.length === 0 ? (
            <div style={{ padding: '72px 20px', textAlign: 'center' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
                <CheckCircle size={44} style={{ color: '#6ee7b7', marginBottom: 18 }} />
              </motion.div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>All caught up!</div>
              <div style={{ fontSize: 13, color: 'rgba(240,242,255,0.45)' }}>No pending materials to review.</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Title', 'Category', 'Level', 'Subject', 'Submitted By', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'rgba(240,242,255,0.4)', letterSpacing: '.7px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.015)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((m, i) => (
                  <motion.tr
                    key={m._id}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 500, maxWidth: 200 }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{m.title}</div>
                    </td>
                    <td style={{ padding: '10px 16px' }}><Badge label={CAT_LABEL[m.category] || m.category} color={CAT_COLOR[m.category]} bg={CAT_BG[m.category]} /></td>
                    <td style={{ padding: '10px 16px', fontSize: 13 }}>{LVL_LABEL[m.level] || m.level}</td>
                    <td style={{ padding: '10px 16px', fontSize: 13 }}>{m.subject}</td>
                    <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: 12, color: 'rgba(240,242,255,0.5)' }}>{m.uploadedBy || '—'}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: 'rgba(240,242,255,0.45)' }}>{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Btn variant="success" size="xs" onClick={() => approve(m._id)}><Check size={11} /> Approve</Btn>
                        <Btn variant="danger" size="xs" onClick={() => reject(m._id)}><X size={11} /> Reject</Btn>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'resources', label: 'Resources', icon: Database },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'users',     label: 'Users',     icon: Users },
  { id: 'pending',   label: 'Pending',   icon: Clock },
];

export default function AdminPage() {
  const toast = useToast();
  const [token, setToken] = useState(() => localStorage.getItem('fundo_token') || '');
  const [activeTab, setActiveTab] = useState('resources');
  const [pendingCount, setPendingCount] = useState(0);
  const { api, upload } = useApi(token);

  useEffect(() => {
    if (!token) return;
    api('GET', '/api/stats').then(d => setPendingCount(d.pending || 0)).catch(() => {});
  }, [token]);

  function logout() {
    localStorage.removeItem('fundo_token');
    setToken('');
  }

  if (!token) return <LoginScreen onLogin={t => setToken(t)} />;

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="bg-mesh" />
      <div className="bg-grid" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Top Nav */}
        <motion.div
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'sticky', top: 0, zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 28px', height: 60,
            background: 'rgba(5,5,26,0.82)', backdropFilter: 'blur(28px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(99,102,241,0.35)', overflow: 'hidden', flexShrink: 0 }}>
              <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.3px' }}>Fundo AI</div>
              <div style={{ fontSize: 10, color: 'rgba(240,242,255,0.4)' }}>Admin Dashboard</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 8, padding: '5px 12px', fontSize: 12, color: 'rgba(240,242,255,0.5)' }}>
              <Shield size={11} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              <strong style={{ color: '#f0f2ff', fontWeight: 700 }}>Admin</strong>
            </div>
            <Btn variant="ghost" size="sm" onClick={logout}><LogOut size={13} /> Logout</Btn>
          </div>
        </motion.div>

        {/* Tab nav */}
        <div style={{
          display: 'flex', gap: 2, padding: '0 20px',
          background: 'rgba(5,5,26,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)', position: 'sticky', top: 60, zIndex: 100,
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '13px 18px', fontSize: 13, fontWeight: 600,
                color: activeTab === tab.id ? '#f0f2ff' : 'rgba(240,242,255,0.48)',
                cursor: 'pointer', border: 'none', background: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? '#6366f1' : 'transparent'}`,
                transition: 'all .2s', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <tab.icon size={15} />
              {tab.label}
              {tab.id === 'pending' && pendingCount > 0 && (
                <span style={{ background: 'rgba(245,158,11,0.2)', color: '#fcd34d', borderRadius: 99, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {activeTab === 'resources' && <ResourcesTab api={api} upload={upload} toast={toast} />}
            {activeTab === 'analytics' && <AnalyticsTab api={api} toast={toast} />}
            {activeTab === 'users'     && <UsersTab api={api} toast={toast} />}
            {activeTab === 'pending'   && <PendingTab api={api} toast={toast} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
