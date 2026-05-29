import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Users, BookOpen, Clock, Upload, Search,
  ChevronLeft, ChevronRight, Trash2, Edit3, Check, X, LogOut,
  Eye, EyeOff, Shield, Database, TrendingUp, Star, Award,
  FileText, CheckCircle, AlertCircle, RefreshCw, Zap, Lock,
  Package, Layers, ChevronDown, ArrowUpRight, UserX, UserCheck,
  MoreHorizontal, Filter, Download, Sparkles,
} from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard.jsx';
import { useToast } from '../hooks/useToast.jsx';
import { useApi } from '../hooks/useApi.js';

/* ── Constants ──────────────────────────────────────────────────── */
const PLANS   = ['FREE','STARTER','BASIC','PRO','PREMIUM'];
const SUBJECTS = {
  primary: ['Mathematics','English','Shona','Ndebele','Science','Social Studies','Environmental Science','Art & Craft'],
  olevel:  ['Mathematics','English Language','English Literature','History','Geography','Biology','Chemistry','Physics','Combined Science','Agriculture','Commerce','Accounting','Economics','Business Studies','Computer Science','Food & Nutrition','Fashion & Fabrics','Art','Shona','Ndebele'],
  alevel:  ['Mathematics','Pure Mathematics','Statistics','Further Mathematics','Physics','Chemistry','Biology','History','Geography','Economics','Business Studies','Accounting','Computer Science','English Literature'],
};
const GRADES = {
  primary: ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7'],
  olevel:  ['Form 1','Form 2','Form 3','Form 4'],
  alevel:  ['Lower 6','Upper 6'],
};
const CAT_LABEL = { paper:'Past Paper', textbook:'Textbook', syllabus:'Syllabus', marking_scheme:'Marking Scheme' };
const LVL_LABEL = { primary:'Primary', olevel:'O-Level', alevel:'A-Level' };
const CAT_COLOR = { paper:'#9b8fff', textbook:'#00d4ff', syllabus:'#00c896', marking_scheme:'#ffb800' };
const CAT_BG    = { paper:'rgba(99,91,255,0.10)', textbook:'rgba(0,212,255,0.10)', syllabus:'rgba(0,200,150,0.10)', marking_scheme:'rgba(255,184,0,0.10)' };
const PLAN_COLOR = { FREE:'#888', STARTER:'#00d4ff', BASIC:'#00c896', PRO:'#9b8fff', PREMIUM:'#ffb800' };
const PLAN_BG    = { FREE:'rgba(255,255,255,.06)', STARTER:'rgba(0,212,255,.10)', BASIC:'rgba(0,200,150,.10)', PRO:'rgba(155,143,255,.10)', PREMIUM:'rgba(255,184,0,.10)' };
const years = () => { const c = new Date().getFullYear(); return Array.from({ length: 20 }, (_, i) => String(c - i)); };

/* ── Design tokens ──────────────────────────────────────────────── */
const T = {
  surface: 'rgba(255,255,255,0.032)',
  surface2: 'rgba(255,255,255,0.055)',
  border: 'rgba(255,255,255,0.072)',
  border2: 'rgba(255,255,255,0.13)',
  muted: 'rgba(240,242,255,0.38)',
  muted2: 'rgba(240,242,255,0.22)',
  indigo: '#635bff',
  indigoBg: 'rgba(99,91,255,0.09)',
  indigoBorder: 'rgba(99,91,255,0.22)',
  red: '#ff4d6a',
  redBg: 'rgba(255,77,106,0.09)',
  redBorder: 'rgba(255,77,106,0.22)',
  green: '#00c896',
  greenBg: 'rgba(0,200,150,0.09)',
  greenBorder: 'rgba(0,200,150,0.22)',
  amber: '#ffb800',
  amberBg: 'rgba(255,184,0,0.09)',
  amberBorder: 'rgba(255,184,0,0.22)',
};

/* ── Small Components ───────────────────────────────────────────── */
function Badge({ label, color, bg, dot }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'3px 9px', borderRadius:99, fontSize:11, fontWeight:700,
      color:color||'#9b8fff', background:bg||T.indigoBg, letterSpacing:'.2px',
      border:`1px solid ${color||'#9b8fff'}22`,
    }}>
      {dot && <span style={{ width:5, height:5, borderRadius:'50%', background:color, flexShrink:0 }} />}
      {label}
    </span>
  );
}

function StatCard({ icon: Icon, val, label, color='#9b8fff', bg=T.indigoBg, border=T.indigoBorder, barColor, delay=0 }) {
  return (
    <motion.div
      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.45, delay, ease:[0.4,0,.2,1] }}
    >
      <SpotlightCard glowColor={`${color}12`} className="glass-card" style={{ padding:'20px 18px', cursor:'default' }}>
        {barColor && <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:barColor, borderRadius:'16px 16px 0 0', opacity:.85 }} />}
        <div style={{ width:36, height:36, borderRadius:10, background:bg, border:`1px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
          <Icon size={15} style={{ color }} />
        </div>
        <div style={{ fontSize:28, fontWeight:900, letterSpacing:'-1.2px', marginBottom:2, color }}>{val ?? '—'}</div>
        <div style={{ fontSize:11.5, color:T.muted, fontWeight:500 }}>{label}</div>
      </SpotlightCard>
    </motion.div>
  );
}

function FormGroup({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <label style={{ fontSize:10.5, fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', color:T.muted }}>{label}</label>
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant='ghost', size='md', disabled, style: extra }) {
  const [hov, setHov] = useState(false);
  const base = {
    display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
    borderRadius:9, fontWeight:600, cursor:disabled?'not-allowed':'pointer',
    transition:'all .16s', border:'1px solid transparent',
    fontFamily:'inherit', whiteSpace:'nowrap', opacity:disabled?.42:1,
    letterSpacing:'-.01em',
  };
  const sizes = {
    xs:{ padding:'4px 9px', fontSize:11.5, borderRadius:6 },
    sm:{ padding:'6px 12px', fontSize:12.5, borderRadius:8 },
    md:{ padding:'9px 16px', fontSize:13.5 },
  };
  const vars = {
    primary:{ background:'linear-gradient(135deg,#635bff,#9b8fff)', color:'#fff', border:'none', boxShadow:hov?'0 8px 28px rgba(99,91,255,.52)':'0 4px 16px rgba(99,91,255,.36)', transform:hov?'translateY(-1px)':'none' },
    ghost:  { background:hov?T.surface2:T.surface, color:'#f0f2ff', borderColor:hov?T.border2:T.border },
    danger: { background:hov?T.redBg:'rgba(255,77,106,.06)', color:'#ff8fa3', borderColor:T.redBorder },
    success:{ background:hov?T.greenBg:'rgba(0,200,150,.06)', color:'#00e5aa', borderColor:T.greenBorder },
    amber:  { background:hov?T.amberBg:'rgba(255,184,0,.06)', color:'#ffd166', borderColor:T.amberBorder },
  };
  return (
    <button
      onClick={disabled?undefined:onClick}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{ ...base, ...sizes[size], ...vars[variant], ...extra }}
    >
      {children}
    </button>
  );
}

function Modal({ open, onClose, title, children, footer, width=480 }) {
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          onClick={onClose}
          style={{ position:'fixed', inset:0, zIndex:500, background:'rgba(2,2,12,.85)', backdropFilter:'blur(20px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
        >
          <motion.div
            initial={{ opacity:0, y:24, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:12, scale:0.97 }}
            transition={{ duration:0.22, ease:[0.34,1.15,.64,1] }}
            onClick={e=>e.stopPropagation()}
            style={{
              background:'rgba(8,8,22,0.95)', backdropFilter:'blur(48px)',
              border:'1px solid rgba(255,255,255,.12)',
              borderRadius:20, padding:28, width, maxWidth:'95vw',
              boxShadow:'0 40px 90px rgba(0,0,0,.75), 0 0 60px rgba(99,91,255,.06)',
              display:'flex', flexDirection:'column', gap:20,
            }}
          >
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h3 style={{ fontSize:17, fontWeight:800, letterSpacing:'-0.3px' }}>{title}</h3>
              <button onClick={onClose} style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:7, color:T.muted, cursor:'pointer', padding:'4px 6px', display:'flex', transition:'all .15s' }}>
                <X size={15}/>
              </button>
            </div>
            <div>{children}</div>
            {footer && <div style={{ display:'flex', justifyContent:'flex-end', gap:8, paddingTop:4 }}>{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Bulk Action Bar ─────────────────────────────────────────────── */
function BulkBar({ count, onDelete, onClear, label='items' }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
          style={{ overflow:'hidden' }}
        >
          <div style={{
            display:'flex', alignItems:'center', gap:12, flexWrap:'wrap',
            background:'linear-gradient(135deg,rgba(99,91,255,.08),rgba(155,143,255,.06))',
            border:'1px solid rgba(99,91,255,.22)',
            borderRadius:10, padding:'9px 14px', fontSize:13,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <div style={{ width:20, height:20, borderRadius:6, background:'rgba(99,91,255,.25)', border:'1px solid rgba(99,91,255,.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Check size={11} style={{ color:'#9b8fff' }} />
              </div>
              <span style={{ fontWeight:700, color:'#c4baff' }}>{count} {label} selected</span>
            </div>
            <div style={{ display:'flex', gap:6, marginLeft:'auto' }}>
              <Btn variant="danger" size="xs" onClick={onDelete}><Trash2 size={11}/> Delete Selected</Btn>
              <Btn variant="ghost" size="xs" onClick={onClear}><X size={11}/> Clear</Btn>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LOGIN SCREEN
   ══════════════════════════════════════════════════════════════════ */
function LoginScreen({ onLogin }) {
  const toast = useToast();
  const [user, setUser]   = useState('');
  const [pass, setPass]   = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]  = useState(false);
  const [err, setErr]          = useState('');

  async function doLogin(e) {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const res  = await fetch('/api/login', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ username:user, password:pass }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Invalid credentials');
      localStorage.setItem('fundo_token', data.token);
      onLogin(data.token);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <motion.div
        initial={{ opacity:0, y:24, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:0.5, ease:[0.4,0,.2,1] }}
        style={{ width:400, maxWidth:'100%', position:'relative', zIndex:1 }}
      >
        {/* Ambient glow */}
        <div style={{ position:'absolute', inset:-60, background:'radial-gradient(circle at 50% 50%, rgba(99,91,255,.12) 0%, transparent 70%)', pointerEvents:'none', borderRadius:'50%' }} />

        <div style={{
          background:'rgba(255,255,255,.028)',
          backdropFilter:'blur(48px) saturate(200%)',
          border:'1px solid rgba(255,255,255,.12)',
          borderRadius:22, padding:'44px 40px',
          boxShadow:'0 44px 90px rgba(0,0,0,.6), 0 0 100px rgba(99,91,255,.08)',
          position:'relative', overflow:'hidden',
        }}>
          {/* Top shimmer line */}
          <div style={{ position:'absolute', top:0, left:'12%', right:'12%', height:1, background:'linear-gradient(90deg,transparent,rgba(99,91,255,.55),rgba(155,143,255,.55),transparent)' }} />

          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
            <div style={{
              width:44, height:44, borderRadius:13,
              background:'linear-gradient(135deg,#635bff,#9b8fff,#00d4ff)',
              display:'flex', alignItems:'center', justifyContent:'center',
              border:'1px solid rgba(99,91,255,.5)', overflow:'hidden',
              boxShadow:'0 4px 20px rgba(99,91,255,.38)', position:'relative', flexShrink:0,
            }}>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,.18),transparent)' }} />
              <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', position:'relative', zIndex:1 }} onError={e=>e.target.style.display='none'} />
            </div>
            <div>
              <div style={{ fontSize:17, fontWeight:900, letterSpacing:'-0.4px' }}>Fundo AI</div>
              <div style={{ fontSize:11, color:T.muted, fontWeight:500 }}>Admin Dashboard</div>
            </div>
          </div>

          <h2 style={{ fontSize:24, fontWeight:900, letterSpacing:'-0.7px', marginBottom:6 }}>Welcome back</h2>
          <p style={{ fontSize:13.5, color:T.muted, lineHeight:1.6, marginBottom:26 }}>
            Sign in to manage resources and students.
          </p>

          <AnimatePresence>
            {err && (
              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden', marginBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, color:'#ff8fa3', fontSize:12.5, padding:'10px 13px', background:T.redBg, border:`1px solid ${T.redBorder}`, borderRadius:9 }}>
                  <AlertCircle size={13} style={{ flexShrink:0 }} /> {err}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={doLogin} style={{ display:'flex', flexDirection:'column', gap:13 }}>
            <FormGroup label="Username">
              <input type="text" value={user} onChange={e=>setUser(e.target.value)} placeholder="Admin username" autoComplete="username" required />
            </FormGroup>
            <FormGroup label="Password">
              <div style={{ position:'relative' }}>
                <input
                  type={showPass?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password" required style={{ paddingRight:42 }}
                />
                <button type="button" onClick={()=>setShowPass(p=>!p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:T.muted, cursor:'pointer', padding:0, display:'flex' }}>
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </FormGroup>
            <motion.button
              type="submit" disabled={loading}
              whileHover={!loading?{ y:-1, boxShadow:'0 10px 34px rgba(99,91,255,.56)' }:{}}
              style={{ marginTop:8, padding:'13px', background:'linear-gradient(135deg,#635bff,#9b8fff)', color:'#fff', fontSize:15, fontWeight:700, border:'none', borderRadius:10, cursor:loading?'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:loading?.7:1, boxShadow:'0 4px 22px rgba(99,91,255,.42)', position:'relative', overflow:'hidden' }}
            >
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,.12),transparent)', borderRadius:'inherit' }} />
              {loading
                ? <><span className="spinner" style={{ width:16, height:16, position:'relative' }}/> Signing in…</>
                : <><Lock size={14} style={{ position:'relative' }}/><span style={{ position:'relative' }}>Sign In</span></>}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   RESOURCES TAB
   ══════════════════════════════════════════════════════════════════ */
function ResourcesTab({ api, upload, toast }) {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage]   = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch]         = useState('');
  const [catFilter, setCatFilter]   = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading]   = useState(false);
  const fileInputRef = useRef();
  const [files, setFiles]   = useState([]);
  const [dragging, setDragging] = useState(false);
  const [upLevel, setUpLevel]       = useState('olevel');
  const [upCategory, setUpCategory] = useState('paper');
  const [upGrade, setUpGrade]       = useState('Form 1');
  const [upSubject, setUpSubject]   = useState('');
  const [upYear, setUpYear]         = useState('');
  const [upCurriculum, setUpCurriculum] = useState('');
  const [uploading, setUploading]   = useState(false);
  const [upProgress, setUpProgress] = useState({ done:0, total:0, label:'' });
  const [showUpProgress, setShowUpProgress] = useState(false);
  const [editModal, setEditModal]   = useState(false);
  const [editData, setEditData]     = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingId, setDeletingId]   = useState('');
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
    try { const d = await api('GET','/api/stats'); setStats(d); } catch {}
  }
  async function loadMaterials(searchOverride) {
    setLoading(true);
    const q = new URLSearchParams({ page, limit:20, search:searchOverride??search, ...(catFilter&&{category:catFilter}), ...(levelFilter&&{level:levelFilter}) });
    try { const d = await api('GET',`/api/materials?${q}`); setItems(d.items); setTotal(d.total); setPages(d.pages); }
    catch(e) { toast(e.message,'error'); }
    setLoading(false);
  }

  function toggleSelect(id) { setSelectedIds(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]); }
  function toggleAll(c) { setSelectedIds(c?items.map(i=>i._id):[]); }

  async function bulkDelete() {
    if (!selectedIds.length||!window.confirm(`Delete ${selectedIds.length} resource(s)?`)) return;
    try { await api('DELETE','/api/materials',{ids:selectedIds}); toast(`${selectedIds.length} deleted`,'success'); setSelectedIds([]); loadMaterials(); loadStats(); }
    catch(e) { toast(e.message,'error'); }
  }

  function openEdit(m) {
    setEditData({ id:m._id, title:m.title, category:m.category, level:m.level, grade:m.grade||'', subject:m.subject, year:m.year||'', approved:m.approved });
    setEditModal(true);
  }
  async function saveEdit() {
    try { await api('PATCH',`/api/materials/${editData.id}`,{ title:editData.title, category:editData.category, level:editData.level, grade:editData.grade, subject:editData.subject, year:editData.year, approved:editData.approved }); toast('Updated','success'); setEditModal(false); loadMaterials(); loadStats(); }
    catch(e) { toast(e.message,'error'); }
  }
  async function confirmDelete() {
    try { await api('DELETE',`/api/materials/${deletingId}`); toast('Deleted','success'); setDeleteModal(false); loadMaterials(); loadStats(); }
    catch(e) { toast(e.message,'error'); }
  }

  async function doUpload() {
    if (!files.length) { toast('No files selected','error'); return; }
    if (!upSubject) { toast('Select a subject','error'); return; }
    setUploading(true); setShowUpProgress(true);
    const subjectFull = upCurriculum ? `${upSubject} (${upCurriculum})` : upSubject;
    const total = files.length; let done=0, ok=0, fail=0;
    for (const f of files) {
      setUpProgress({ done, total, label:`Uploading ${done+1} of ${total}…` });
      const fd = new FormData();
      fd.append('file',f,f.name); fd.append('title',f.name.replace(/\.[^.]+$/,''));
      fd.append('category',upCategory); fd.append('level',upLevel);
      fd.append('grade',upGrade); fd.append('subject',subjectFull); fd.append('year',upYear);
      try { await upload('/api/materials/upload',fd); ok++; } catch { fail++; }
      done++;
    }
    setUpProgress({ done:total, total, label:`Done — ${ok} uploaded${fail?`, ${fail} failed`:''}` });
    if (ok) toast(`${ok} file(s) uploaded`,'success');
    if (fail) toast(`${fail} file(s) failed`,'error');
    setFiles([]); setUploading(false);
    setTimeout(()=>setShowUpProgress(false),3500);
    loadMaterials(); loadStats();
  }

  const subjects = SUBJECTS[upLevel] || [];
  const grades   = GRADES[upLevel]   || [];

  return (
    <div style={{ display:'grid', gridTemplateColumns:'268px 1fr', minHeight:'calc(100vh - 104px)' }}>
      {/* ── Sidebar ── */}
      <div className="admin-sidebar-desktop" style={{
        borderRight:`1px solid ${T.border}`, padding:'18px 14px',
        background:'rgba(255,255,255,.009)', display:'flex', flexDirection:'column', gap:12,
        position:'sticky', top:104, height:'calc(100vh - 104px)', overflowY:'auto',
      }}>
        <div style={{ fontSize:10, fontWeight:800, letterSpacing:'1.2px', color:T.muted2, textTransform:'uppercase' }}>Upload Resources</div>

        {stats && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
            {[{ l:'Total', v:stats.total, c:'#9b8fff' },{ l:'Live', v:stats.approved, c:'#00c896' },{ l:'Pending', v:stats.pending, c:'#ffb800' }].map(s=>(
              <div key={s.l} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:'9px 10px' }}>
                <div style={{ fontSize:19, fontWeight:900, color:s.c, letterSpacing:'-0.9px' }}>{s.v}</div>
                <div style={{ fontSize:10, color:T.muted2, fontWeight:600 }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)}
          onDrop={e=>{e.preventDefault();setDragging(false);setFiles(prev=>[...prev,...[...e.dataTransfer.files]].slice(0,100));}}
          onClick={()=>fileInputRef.current?.click()}
          style={{
            border:`1.5px dashed ${dragging?'rgba(99,91,255,.65)':'rgba(99,91,255,.22)'}`,
            borderRadius:11, padding:'20px 10px', textAlign:'center', cursor:'pointer',
            background:dragging?'rgba(99,91,255,.06)':'rgba(99,91,255,.015)',
            transition:'all .2s', position:'relative', overflow:'hidden',
          }}
        >
          <motion.div animate={{ y:[0,-5,0] }} transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut' }}>
            <Upload size={20} style={{ color:'#9b8fff', marginBottom:7 }} />
          </motion.div>
          <div style={{ fontSize:12, fontWeight:600, marginBottom:2 }}>{files.length?`${files.length} file(s) ready`:'Drop files or click'}</div>
          <div style={{ fontSize:10, color:T.muted }}>PDF, DOC — up to 80MB</div>
          <input ref={fileInputRef} type="file" multiple style={{ display:'none' }} onChange={e=>{setFiles(prev=>[...prev,...[...e.target.files]].slice(0,100));e.target.value='';}} />
        </div>

        {files.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:4, maxHeight:140, overflowY:'auto' }}>
            {files.map((f,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:6, background:T.surface, border:`1px solid ${T.border}`, borderRadius:7, padding:'5px 8px' }}>
                <FileText size={10} style={{ color:'#9b8fff', flexShrink:0 }} />
                <span style={{ flex:1, fontSize:10, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color:T.muted }}>{f.name}</span>
                <button onClick={()=>setFiles(p=>p.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', color:T.muted2, cursor:'pointer', padding:0, display:'flex' }}><X size={9}/></button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          {[
            { label:'Category', val:upCategory, set:setUpCategory, opts:[['paper','Past Paper'],['textbook','Textbook'],['syllabus','Syllabus'],['marking_scheme','Marking Scheme']] },
            { label:'Level', val:upLevel, set:v=>{setUpLevel(v);setUpSubject('');setUpGrade(GRADES[v]?.[0]||'');}, opts:[['primary','Primary'],['olevel','O-Level'],['alevel','A-Level']] },
          ].map(({label,val,set,opts})=>(
            <div key={label}>
              <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:'1px', textTransform:'uppercase', color:T.muted2, marginBottom:3 }}>{label}</div>
              <select value={val} onChange={e=>set(e.target.value)} style={{ fontSize:12, padding:'8px 11px' }}>
                {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ))}
          <div>
            <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:'1px', textTransform:'uppercase', color:T.muted2, marginBottom:3 }}>Subject</div>
            <select value={upSubject} onChange={e=>setUpSubject(e.target.value)} style={{ fontSize:12, padding:'8px 11px' }}>
              <option value="">— Select —</option>
              {subjects.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
            <div>
              <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:'1px', textTransform:'uppercase', color:T.muted2, marginBottom:3 }}>Grade</div>
              <select value={upGrade} onChange={e=>setUpGrade(e.target.value)} style={{ fontSize:11, padding:'8px 9px' }}>
                {grades.map(g=><option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:'1px', textTransform:'uppercase', color:T.muted2, marginBottom:3 }}>Year</div>
              <select value={upYear} onChange={e=>setUpYear(e.target.value)} style={{ fontSize:11, padding:'8px 9px' }}>
                <option value="">None</option>
                {years().map(y=><option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:'1px', textTransform:'uppercase', color:T.muted2, marginBottom:3 }}>Curriculum</div>
            <select value={upCurriculum} onChange={e=>setUpCurriculum(e.target.value)} style={{ fontSize:12, padding:'8px 11px' }}>
              <option value="">General</option><option value="ZIMSEC">ZIMSEC</option><option value="Cambridge">Cambridge</option>
            </select>
          </div>
        </div>

        <AnimatePresence>
          {showUpProgress && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden' }}>
              <div style={{ background:T.indigoBg, border:`1px solid ${T.indigoBorder}`, borderRadius:9, padding:'9px 11px' }}>
                <div style={{ fontSize:11, fontWeight:600, marginBottom:6 }}>{upProgress.label}</div>
                <div style={{ height:3, background:'rgba(255,255,255,.07)', borderRadius:99, overflow:'hidden' }}>
                  <motion.div animate={{ width:`${upProgress.total?(upProgress.done/upProgress.total)*100:0}%` }} transition={{ duration:.3 }} style={{ height:'100%', background:'linear-gradient(135deg,#635bff,#9b8fff)', borderRadius:99 }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Btn variant="primary" onClick={doUpload} disabled={uploading||!files.length} style={{ width:'100%', fontSize:13 }}>
          {uploading ? <><span className="spinner" style={{ width:13, height:13 }}/> Uploading…</> : <><Upload size={13}/> Upload Files</>}
        </Btn>
      </div>

      {/* ── Main content ── */}
      <div style={{ padding:'18px 22px', display:'flex', flexDirection:'column', gap:14 }}>
        {stats && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:9 }}>
            <StatCard icon={Database}    val={stats.total}    label="Total Resources"  barColor="linear-gradient(90deg,#635bff,#9b8fff)" delay={0} />
            <StatCard icon={CheckCircle} val={stats.approved} label="Live Materials"   color="#00c896" bg={T.greenBg} border={T.greenBorder} barColor="linear-gradient(90deg,#00c896,#00d4ff)" delay={0.05} />
            <StatCard icon={Clock}       val={stats.pending}  label="Pending Review"   color="#ffb800" bg={T.amberBg} border={T.amberBorder} barColor="linear-gradient(90deg,#ffb800,#ff8c42)" delay={0.1} />
            <StatCard icon={Layers}      val={stats.byCategory?.length??0} label="Categories"  color="#00d4ff" bg="rgba(0,212,255,.09)" border="rgba(0,212,255,.2)" delay={0.15} />
          </div>
        )}

        {/* Toolbar */}
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:180 }}>
            <Search size={13} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:T.muted2, pointerEvents:'none' }} />
            <input type="text" value={search} onChange={e=>onSearchChange(e.target.value)} placeholder="Search resources…" style={{ paddingLeft:34 }} />
          </div>
          <select value={catFilter} onChange={e=>{setCatFilter(e.target.value);setPage(1);}} style={{ width:'auto', fontSize:12.5 }}>
            <option value="">All categories</option>
            {Object.entries(CAT_LABEL).map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
          <select value={levelFilter} onChange={e=>{setLevelFilter(e.target.value);setPage(1);}} style={{ width:'auto', fontSize:12.5 }}>
            <option value="">All levels</option>
            {Object.entries(LVL_LABEL).map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
          <Btn variant="ghost" onClick={()=>{loadMaterials();loadStats();}}><RefreshCw size={12}/></Btn>
        </div>

        <BulkBar count={selectedIds.length} label="resources" onDelete={bulkDelete} onClear={()=>setSelectedIds([])} />

        {/* Table */}
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:`1px solid ${T.border}`, background:'rgba(255,255,255,.013)' }}>
            <span style={{ fontSize:13.5, fontWeight:700 }}>Resources <span style={{ color:'#9b8fff', fontWeight:800 }}>{total}</span></span>
          </div>
          {loading ? (
            <div style={{ padding:48, textAlign:'center' }}><span className="spinner"/></div>
          ) : items.length===0 ? (
            <div style={{ padding:'52px 20px', textAlign:'center', color:T.muted }}>
              <Database size={34} style={{ marginBottom:12, opacity:.35 }} />
              <div style={{ fontSize:14.5, fontWeight:700, color:'#f0f2ff', marginBottom:4 }}>No resources found</div>
              <div style={{ fontSize:12.5 }}>Try different filters or upload some materials.</div>
            </div>
          ) : (
            <>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width:34 }}>
                      <input type="checkbox" checked={selectedIds.length===items.length&&items.length>0} onChange={e=>toggleAll(e.target.checked)} />
                    </th>
                    {['Title','Category','Level','Subject','Year','Status',''].map(h=><th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {items.map((m,idx)=>(
                    <motion.tr
                      key={m._id}
                      className={selectedIds.includes(m._id)?'row-selected':''}
                      initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:idx*.018 }}
                    >
                      <td><input type="checkbox" checked={selectedIds.includes(m._id)} onChange={()=>toggleSelect(m._id)} /></td>
                      <td style={{ maxWidth:195 }}>
                        <div style={{ fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:185, fontSize:12.5 }} title={m.title}>{m.title}</div>
                        <a href={m.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:10.5, color:T.muted2, textDecoration:'none' }}>↗ view file</a>
                      </td>
                      <td><Badge label={CAT_LABEL[m.category]||m.category} color={CAT_COLOR[m.category]} bg={CAT_BG[m.category]} dot /></td>
                      <td style={{ color:T.muted, fontSize:12.5 }}>{LVL_LABEL[m.level]||m.level}</td>
                      <td style={{ fontSize:12.5 }}>{m.subject}</td>
                      <td>{m.year?<span style={{ background:T.surface2, borderRadius:5, padding:'2px 7px', fontSize:11, color:T.muted }}>{m.year}</span>:<span style={{ color:T.muted2 }}>—</span>}</td>
                      <td><Badge label={m.approved?'Live':'Pending'} color={m.approved?T.green:T.amber} bg={m.approved?T.greenBg:T.amberBg} dot /></td>
                      <td>
                        <div style={{ display:'flex', gap:4 }}>
                          <Btn variant="ghost" size="xs" onClick={()=>openEdit(m)}><Edit3 size={10}/></Btn>
                          <Btn variant="danger" size="xs" onClick={()=>{setDeletingId(m._id);setDeletingName(m.title);setDeleteModal(true);}}><Trash2 size={10}/></Btn>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', borderTop:`1px solid ${T.border}`, background:'rgba(255,255,255,.01)', fontSize:12.5, color:T.muted }}>
                <span>{total} resources · Page {page} of {pages}</span>
                <div style={{ display:'flex', gap:4 }}>
                  <Btn variant="ghost" size="xs" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}><ChevronLeft size={12}/></Btn>
                  <Btn variant="ghost" size="xs" disabled={page>=pages} onClick={()=>setPage(p=>Math.min(pages,p+1))}><ChevronRight size={12}/></Btn>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={editModal} onClose={()=>setEditModal(false)} title="Edit Resource" footer={<><Btn variant="ghost" onClick={()=>setEditModal(false)}>Cancel</Btn><Btn variant="primary" onClick={saveEdit}>Save Changes</Btn></>}>
        <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
          <FormGroup label="Title"><input value={editData.title||''} onChange={e=>setEditData(d=>({...d,title:e.target.value}))}/></FormGroup>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:9 }}>
            <FormGroup label="Category">
              <select value={editData.category||'paper'} onChange={e=>setEditData(d=>({...d,category:e.target.value}))}>
                {Object.entries(CAT_LABEL).map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Level">
              <select value={editData.level||'olevel'} onChange={e=>setEditData(d=>({...d,level:e.target.value}))}>
                {Object.entries(LVL_LABEL).map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Grade"><input value={editData.grade||''} onChange={e=>setEditData(d=>({...d,grade:e.target.value}))}/></FormGroup>
            <FormGroup label="Year">
              <select value={editData.year||''} onChange={e=>setEditData(d=>({...d,year:e.target.value}))}>
                <option value="">None</option>
                {years().map(y=><option key={y} value={y}>{y}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Subject">
              <select value={editData.subject||''} onChange={e=>setEditData(d=>({...d,subject:e.target.value}))}>
                <option value="">— Select —</option>
                {(SUBJECTS[editData.level]||[]).map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Status">
              <select value={String(editData.approved)} onChange={e=>setEditData(d=>({...d,approved:e.target.value==='true'}))}>
                <option value="true">Live</option>
                <option value="false">Pending</option>
              </select>
            </FormGroup>
          </div>
        </div>
      </Modal>

      <Modal open={deleteModal} onClose={()=>setDeleteModal(false)} title="Delete Resource" footer={<><Btn variant="ghost" onClick={()=>setDeleteModal(false)}>Cancel</Btn><Btn variant="danger" onClick={confirmDelete}><Trash2 size={13}/> Delete</Btn></>}>
        <p style={{ fontSize:13.5, color:T.muted, lineHeight:1.65 }}>
          Delete <strong style={{ color:'#f0f2ff' }}>{deletingName}</strong>? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ANALYTICS TAB
   ══════════════════════════════════════════════════════════════════ */
function AnalyticsTab({ api, toast }) {
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ load(); },[]);
  async function load() { setLoading(true); try { setData(await api('GET','/api/analytics')); } catch(e){ toast(e.message,'error'); } setLoading(false); }

  const getLast7 = () => Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(6-i)); return d.toISOString().slice(0,10); });
  const planColors = { FREE:'rgba(200,200,200,.3)', STARTER:'#00d4ff', BASIC:'#00c896', PRO:'#9b8fff', PREMIUM:'#ffb800' };

  if (loading) return <div style={{ padding:64, textAlign:'center' }}><span className="spinner"/></div>;
  if (!data) return null;

  const last7 = getLast7();
  const trend  = data.signupTrend||[];
  const maxT   = Math.max(...trend.map(t=>t.count),1);
  const maxP   = Math.max(...(data.planBreakdown||[]).map(p=>p.count),1);

  return (
    <div style={{ padding:24, display:'flex', flexDirection:'column', gap:22 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(165px,1fr))', gap:10 }}>
        {[
          { icon:Users,     val:data.users?.total,         label:'Total Users',    color:'#9b8fff', bg:T.indigoBg,  border:T.indigoBorder,  bar:'linear-gradient(90deg,#635bff,#9b8fff)' },
          { icon:TrendingUp,val:data.users?.today,         label:'Joined Today',   color:T.green,  bg:T.greenBg,   border:T.greenBorder,   bar:'linear-gradient(90deg,#00c896,#00d4ff)' },
          { icon:BarChart3, val:data.users?.week,          label:'This Week',      color:T.amber,  bg:T.amberBg,   border:T.amberBorder,   bar:'linear-gradient(90deg,#ffb800,#ff8c42)' },
          { icon:Star,      val:data.users?.month,         label:'This Month',     color:'#00d4ff', bg:'rgba(0,212,255,.09)', border:'rgba(0,212,255,.2)', bar:'linear-gradient(90deg,#00d4ff,#635bff)' },
          { icon:Database,  val:data.materials?.total,     label:'Live Materials', color:'#9b8fff', bg:T.indigoBg,  border:T.indigoBorder,  bar:'linear-gradient(90deg,#635bff,#9b8fff)' },
          { icon:Clock,     val:data.materials?.pending,   label:'Pending',        color:T.amber,  bg:T.amberBg,   border:T.amberBorder,   bar:'linear-gradient(90deg,#ffb800,#ff8c42)' },
          { icon:Upload,    val:data.materials?.community, label:'Community',      color:T.green,  bg:T.greenBg,   border:T.greenBorder,   bar:'linear-gradient(90deg,#00c896,#00d4ff)' },
        ].map((s,i)=>(
          <StatCard key={s.label} icon={s.icon} val={s.val} label={s.label} color={s.color} bg={s.bg} border={s.border} barColor={s.bar} delay={i*.038} />
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Trend chart */}
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, overflow:'hidden' }}>
          <div style={{ padding:'12px 16px', borderBottom:`1px solid ${T.border}`, fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span>Signup Trend <span style={{ color:T.muted, fontWeight:500, fontSize:11.5 }}>(last 7 days)</span></span>
            <TrendingUp size={13} style={{ color:T.muted2 }} />
          </div>
          <div style={{ padding:'18px 16px', display:'flex', alignItems:'flex-end', gap:6, height:130 }}>
            {last7.map(day=>{
              const t = trend.find(x=>x._id===day)||{count:0};
              const pct = (t.count/maxT)*100;
              return (
                <div key={day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, height:'100%', justifyContent:'flex-end' }}>
                  <span style={{ fontSize:8.5, color:T.muted2, height:13 }}>{t.count||''}</span>
                  <motion.div
                    initial={{ height:0 }} animate={{ height:`${Math.max(pct*.75, t.count?5:2)}px` }}
                    transition={{ duration:.85, delay:.2, ease:[.4,0,.2,1] }}
                    style={{ width:'100%', background:t.count?'linear-gradient(180deg,#635bff,#9b8fff)':'rgba(255,255,255,.05)', borderRadius:'3px 3px 0 0', minHeight:2 }}
                  />
                  <span style={{ fontSize:8.5, color:T.muted2 }}>{day.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plan breakdown */}
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, overflow:'hidden' }}>
          <div style={{ padding:'12px 16px', borderBottom:`1px solid ${T.border}`, fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span>Plan Distribution</span>
            <Award size={13} style={{ color:T.muted2 }} />
          </div>
          <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:10 }}>
            {['FREE','STARTER','BASIC','PRO','PREMIUM'].map(plan=>{
              const p = (data.planBreakdown||[]).find(x=>x._id===plan)||{count:0};
              return (
                <div key={plan} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:11.5, fontWeight:700, width:66, flexShrink:0, color:PLAN_COLOR[plan] }}>{plan}</span>
                  <div style={{ flex:1, background:'rgba(255,255,255,.05)', borderRadius:99, height:7, overflow:'hidden' }}>
                    <motion.div
                      initial={{ width:0 }} animate={{ width:`${Math.round((p.count/maxP)*100)}%` }}
                      transition={{ duration:1.1, delay:.3, ease:[.4,0,.2,1] }}
                      style={{ height:'100%', background:planColors[plan], borderRadius:99 }}
                    />
                  </div>
                  <span style={{ fontSize:11.5, color:T.muted, width:24, textAlign:'right', flexShrink:0 }}>{p.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {[
          { title:'Top Uploaders', icon:Upload, rows:data.topUploaders, valKey:'uploadCount', nameKey:'name', subKey:'plan', valColor:'#9b8fff' },
          { title:'Recent Signups', icon:Users, rows:data.recentSignups, nameKey:'name', subKey:'plan', showBadge:true },
        ].map(({ title, icon:Icon, rows, valKey, nameKey, subKey, valColor, showBadge })=>(
          <div key={title} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:`1px solid ${T.border}`, fontSize:13, fontWeight:700, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span>{title}</span>
              <Icon size={13} style={{ color:T.muted2 }} />
            </div>
            {(rows||[]).length===0
              ? <div style={{ padding:'18px 16px', color:T.muted, fontSize:13 }}>No data yet</div>
              : (rows||[]).map((u,i)=>(
                <motion.div
                  key={u.phone||i}
                  initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*.035 }}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 16px', borderBottom:i<rows.length-1?`1px solid ${T.border}`:'none', transition:'background .12s', cursor:'default' }}
                  onMouseEnter={e=>e.currentTarget.style.background=T.indigoBg}
                  onMouseLeave={e=>e.currentTarget.style.background=''}
                >
                  {valKey && <div style={{ fontSize:11, color:T.muted2, width:16, textAlign:'center', fontWeight:600 }}>{i+1}</div>}
                  <div style={{ width:30, height:30, borderRadius:'50%', background:T.indigoBg, border:`1px solid ${T.indigoBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12.5, fontWeight:700, flexShrink:0, color:'#9b8fff' }}>
                    {u.name?u.name[0].toUpperCase():'?'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u[nameKey]||u.phone}</div>
                    <div style={{ fontSize:10.5, marginTop:1 }}>{showBadge?<Badge label={u[subKey]} color={PLAN_COLOR[u[subKey]]} bg={PLAN_BG[u[subKey]]} />:<span style={{ color:T.muted }}>{u[subKey]}</span>}</div>
                  </div>
                  {valKey && <div style={{ fontSize:14, fontWeight:800, color:valColor, flexShrink:0 }}>{u[valKey]}</div>}
                  {showBadge&&!valKey && <div style={{ fontSize:10.5, color:T.muted2 }}>{new Date(u.createdAt).toLocaleDateString()}</div>}
                </motion.div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   USERS TAB  — with bulk select + delete
   ══════════════════════════════════════════════════════════════════ */
function UsersTab({ api, toast }) {
  const [users, setUsers]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);
  const [search, setSearch]   = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [planModal, setPlanModal]     = useState(false);
  const [planPhone, setPlanPhone]     = useState('');
  const [newPlan, setNewPlan]         = useState('FREE');
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingPhone, setDeletingPhone] = useState('');
  const [deletingName, setDeletingName]   = useState('');
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const searchTimer = useRef();

  useEffect(()=>{ loadUsers(); },[page, planFilter]);

  function onSearch(v) {
    setSearch(v);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(()=>{ setPage(1); loadUsers(v); }, 320);
  }

  async function loadUsers(s) {
    setLoading(true);
    const q = new URLSearchParams({ page, limit:30, search:s??search, ...(planFilter&&{plan:planFilter}) });
    try { const d = await api('GET',`/api/users?${q}`); setUsers(d.users); setTotal(d.total); setPages(d.pages); }
    catch(e) { toast(e.message,'error'); }
    setLoading(false);
  }

  function toggleSelect(phone) {
    setSelectedPhones(prev=>prev.includes(phone)?prev.filter(x=>x!==phone):[...prev,phone]);
  }
  function toggleAll(checked) {
    setSelectedPhones(checked ? users.map(u=>u.phone) : []);
  }

  async function savePlan() {
    try { await api('PATCH',`/api/users/${planPhone}/plan`,{plan:newPlan}); toast('Plan updated','success'); setPlanModal(false); loadUsers(); }
    catch(e) { toast(e.message,'error'); }
  }

  async function confirmDelete() {
    try { await api('DELETE',`/api/users/${deletingPhone}`); toast('Student deleted','success'); setDeleteModal(false); loadUsers(); }
    catch(e) { toast(e.message,'error'); }
  }

  async function confirmBulkDelete() {
    try {
      const d = await api('DELETE','/api/users',{ phones: selectedPhones });
      toast(`${d.deleted} student(s) deleted`,'success');
      setSelectedPhones([]); setBulkDeleteModal(false); loadUsers();
    } catch(e) { toast(e.message,'error'); }
  }

  const allSelected = users.length > 0 && selectedPhones.length === users.length;

  return (
    <div style={{ padding:22, display:'flex', flexDirection:'column', gap:14 }}>
      {/* Header row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexWrap:'wrap' }}>
        <div>
          <h2 style={{ fontSize:18, fontWeight:800, letterSpacing:'-0.3px' }}>Students</h2>
          <p style={{ fontSize:12.5, color:T.muted, marginTop:2 }}>{total} registered users</p>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:180 }}>
          <Search size={13} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:T.muted2, pointerEvents:'none' }} />
          <input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Search by phone, name, school…" style={{ paddingLeft:34 }} />
        </div>
        <select value={planFilter} onChange={e=>{setPlanFilter(e.target.value);setPage(1);}} style={{ width:'auto', fontSize:12.5 }}>
          <option value="">All plans</option>
          {PLANS.map(p=><option key={p} value={p}>{p}</option>)}
        </select>
        <Btn variant="ghost" onClick={()=>loadUsers()}><RefreshCw size={12}/></Btn>
      </div>

      {/* Bulk action bar */}
      <BulkBar
        count={selectedPhones.length}
        label="students"
        onDelete={()=>setBulkDeleteModal(true)}
        onClear={()=>setSelectedPhones([])}
      />

      {/* Table */}
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, overflow:'hidden' }}>
        <div style={{ padding:'12px 16px', borderBottom:`1px solid ${T.border}`, background:'rgba(255,255,255,.013)', fontSize:13.5, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span>Users <span style={{ color:'#9b8fff', fontWeight:800 }}>{total}</span></span>
          {selectedPhones.length > 0 && (
            <span style={{ fontSize:12, color:T.muted, fontWeight:500 }}>{selectedPhones.length} selected</span>
          )}
        </div>

        {loading ? (
          <div style={{ padding:48, textAlign:'center' }}><span className="spinner"/></div>
        ) : users.length===0 ? (
          <div style={{ padding:'52px 20px', textAlign:'center', color:T.muted }}>
            <Users size={34} style={{ marginBottom:12, opacity:.35 }} />
            <div style={{ fontSize:14.5, fontWeight:700, color:'#f0f2ff', marginBottom:4 }}>No users found</div>
            <div style={{ fontSize:12.5 }}>Try a different search or plan filter.</div>
          </div>
        ) : (
          <>
            <div style={{ overflowX:'auto' }}>
              <table className="data-table" style={{ minWidth:700 }}>
                <thead>
                  <tr>
                    <th style={{ width:34 }}>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={e=>toggleAll(e.target.checked)}
                        title={allSelected?'Deselect all':'Select all'}
                      />
                    </th>
                    {['Phone','Name','Plan','School / Grade','Uploads','Joined','Actions'].map(h=><th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u,i)=>(
                    <motion.tr
                      key={u.phone}
                      className={selectedPhones.includes(u.phone)?'row-selected':''}
                      initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*.018 }}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedPhones.includes(u.phone)}
                          onChange={()=>toggleSelect(u.phone)}
                        />
                      </td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ width:28, height:28, borderRadius:'50%', background:T.indigoBg, border:`1px solid ${T.indigoBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#9b8fff', flexShrink:0 }}>
                            {u.name?u.name[0].toUpperCase():'?'}
                          </div>
                          <span style={{ fontFamily:'monospace', fontSize:11.5, color:T.muted }}>{u.phone}</span>
                        </div>
                      </td>
                      <td>
                        {u.name
                          ? <span style={{ fontSize:12.5, fontWeight:600 }}>{u.name}</span>
                          : <span style={{ color:T.muted2 }}>—</span>}
                      </td>
                      <td><Badge label={u.plan} color={PLAN_COLOR[u.plan]} bg={PLAN_BG[u.plan]} dot /></td>
                      <td style={{ fontSize:12, color:T.muted }}>
                        {u.school || u.grade
                          ? <span>{u.school || ''}{u.school && u.grade ? ' · ' : ''}{u.grade || ''}</span>
                          : <span style={{ color:T.muted2 }}>—</span>}
                      </td>
                      <td>
                        <span style={{ fontSize:13, fontWeight:700, color:'#9b8fff' }}>{u.uploadCount||0}</span>
                      </td>
                      <td style={{ fontSize:11.5, color:T.muted }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display:'flex', gap:4 }}>
                          <Btn
                            variant="ghost" size="xs"
                            onClick={()=>{ setPlanPhone(u.phone); setNewPlan(u.plan); setPlanModal(true); }}
                            style={{ fontSize:11 }}
                          >
                            <UserCheck size={10}/> Plan
                          </Btn>
                          <Btn
                            variant="danger" size="xs"
                            onClick={()=>{ setDeletingPhone(u.phone); setDeletingName(u.name||u.phone); setDeleteModal(true); }}
                          >
                            <Trash2 size={10}/>
                          </Btn>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', borderTop:`1px solid ${T.border}`, background:'rgba(255,255,255,.01)', fontSize:12.5, color:T.muted }}>
              <span>{total} students · Page {page} of {pages}</span>
              <div style={{ display:'flex', gap:4 }}>
                <Btn variant="ghost" size="xs" disabled={page<=1} onClick={()=>setPage(p=>p-1)}><ChevronLeft size={12}/></Btn>
                <Btn variant="ghost" size="xs" disabled={page>=pages} onClick={()=>setPage(p=>p+1)}><ChevronRight size={12}/></Btn>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Change Plan Modal */}
      <Modal open={planModal} onClose={()=>setPlanModal(false)} title="Change Student Plan" footer={<><Btn variant="ghost" onClick={()=>setPlanModal(false)}>Cancel</Btn><Btn variant="primary" onClick={savePlan}>Save Plan</Btn></>}>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <p style={{ fontSize:13, color:T.muted }}>Updating plan for <strong style={{ color:'#9b8fff', fontFamily:'monospace' }}>{planPhone}</strong></p>
          <FormGroup label="New Plan">
            <select value={newPlan} onChange={e=>setNewPlan(e.target.value)}>
              {PLANS.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
          </FormGroup>
        </div>
      </Modal>

      {/* Single Delete Modal */}
      <Modal open={deleteModal} onClose={()=>setDeleteModal(false)} title="Delete Student" footer={<><Btn variant="ghost" onClick={()=>setDeleteModal(false)}>Cancel</Btn><Btn variant="danger" onClick={confirmDelete}><Trash2 size={13}/> Delete</Btn></>}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:T.redBg, border:`1px solid ${T.redBorder}`, borderRadius:10 }}>
            <AlertCircle size={18} style={{ color:'#ff4d6a', flexShrink:0 }} />
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'#ff8fa3', marginBottom:2 }}>This cannot be undone</div>
              <div style={{ fontSize:12, color:T.muted }}>All data for this student will be permanently removed.</div>
            </div>
          </div>
          <p style={{ fontSize:13.5, color:T.muted, lineHeight:1.65 }}>
            Delete student <strong style={{ color:'#f0f2ff' }}>{deletingName}</strong>?
          </p>
        </div>
      </Modal>

      {/* Bulk Delete Modal */}
      <Modal open={bulkDeleteModal} onClose={()=>setBulkDeleteModal(false)} title="Delete Students" footer={<><Btn variant="ghost" onClick={()=>setBulkDeleteModal(false)}>Cancel</Btn><Btn variant="danger" onClick={confirmBulkDelete}><Trash2 size={13}/> Delete {selectedPhones.length} Students</Btn></>}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:T.redBg, border:`1px solid ${T.redBorder}`, borderRadius:10 }}>
            <AlertCircle size={18} style={{ color:'#ff4d6a', flexShrink:0 }} />
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'#ff8fa3', marginBottom:2 }}>This cannot be undone</div>
              <div style={{ fontSize:12, color:T.muted }}>All data for these students will be permanently removed.</div>
            </div>
          </div>
          <p style={{ fontSize:13.5, color:T.muted, lineHeight:1.65 }}>
            You are about to delete <strong style={{ color:'#f0f2ff' }}>{selectedPhones.length} student{selectedPhones.length!==1?'s':''}</strong>. Are you sure?
          </p>
        </div>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PENDING TAB
   ══════════════════════════════════════════════════════════════════ */
function PendingTab({ api, toast }) {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{ load(); },[]);
  async function load() {
    setLoading(true);
    try { const d=await api('GET','/api/materials?page=1&limit=100'); setItems((d.items||[]).filter(m=>!m.approved)); }
    catch(e){ toast(e.message,'error'); }
    setLoading(false);
  }
  async function approve(id) { try { await api('POST',`/api/materials/${id}/approve`); toast('Approved','success'); load(); } catch(e){ toast(e.message,'error'); } }
  async function reject(id)  { if (!window.confirm('Delete?')) return; try { await api('DELETE',`/api/materials/${id}`); toast('Rejected & deleted','info'); load(); } catch(e){ toast(e.message,'error'); } }
  async function approveAll() {
    if (!window.confirm(`Approve all ${items.length}?`)) return;
    await Promise.all(items.map(m=>api('POST',`/api/materials/${m._id}/approve`).catch(()=>{})));
    toast(`${items.length} approved`,'success'); load();
  }

  return (
    <div style={{ padding:22, display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ fontSize:18, fontWeight:800, letterSpacing:'-0.3px' }}>Pending Review</h2>
          <p style={{ fontSize:12.5, color:T.muted, marginTop:2 }}>{items.length} submission{items.length!==1?'s':''} awaiting approval</p>
        </div>
        {items.length>0 && (
          <Btn variant="success" onClick={approveAll}><CheckCircle size={13}/> Approve All</Btn>
        )}
      </div>
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:48, textAlign:'center' }}><span className="spinner"/></div>
        ) : items.length===0 ? (
          <div style={{ padding:'64px 20px', textAlign:'center' }}>
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:220, damping:12 }}>
              <CheckCircle size={44} style={{ color:T.green, marginBottom:16 }} />
            </motion.div>
            <div style={{ fontSize:16, fontWeight:800, marginBottom:5, letterSpacing:'-0.2px' }}>All caught up!</div>
            <div style={{ fontSize:13, color:T.muted }}>No pending materials to review.</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>{['Title','Category','Level','Subject','Submitted By','Date','Actions'].map(h=><th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {items.map((m,i)=>(
                <motion.tr key={m._id} initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*.025 }}>
                  <td style={{ maxWidth:200 }}><div style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:180, fontSize:12.5, fontWeight:600 }}>{m.title}</div></td>
                  <td><Badge label={CAT_LABEL[m.category]||m.category} color={CAT_COLOR[m.category]} bg={CAT_BG[m.category]} dot /></td>
                  <td style={{ fontSize:12.5, color:T.muted }}>{LVL_LABEL[m.level]||m.level}</td>
                  <td style={{ fontSize:12.5 }}>{m.subject}</td>
                  <td style={{ fontFamily:'monospace', fontSize:11, color:T.muted }}>{m.uploadedBy||'—'}</td>
                  <td style={{ fontSize:11.5, color:T.muted2 }}>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display:'flex', gap:5 }}>
                      <Btn variant="success" size="xs" onClick={()=>approve(m._id)}><Check size={10}/> Approve</Btn>
                      <Btn variant="danger"  size="xs" onClick={()=>reject(m._id)}><X size={10}/> Reject</Btn>
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

/* ══════════════════════════════════════════════════════════════════
   MAIN ADMIN PAGE
   ══════════════════════════════════════════════════════════════════ */
const TABS = [
  { id:'resources', label:'Resources', icon:Database },
  { id:'analytics', label:'Analytics', icon:BarChart3 },
  { id:'users',     label:'Students',  icon:Users },
  { id:'pending',   label:'Pending',   icon:Clock },
];

export default function AdminPage() {
  const toast = useToast();
  const [token, setToken]         = useState(()=>localStorage.getItem('fundo_token')||'');
  const [activeTab, setActiveTab] = useState('resources');
  const [pendingCount, setPendingCount] = useState(0);
  const { api, upload } = useApi(token);

  useEffect(()=>{
    if (!token) return;
    api('GET','/api/stats').then(d=>setPendingCount(d.pending||0)).catch(()=>{});
  },[token]);

  function logout() { localStorage.removeItem('fundo_token'); setToken(''); }

  if (!token) return <LoginScreen onLogin={t=>setToken(t)} />;

  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1 }}>
      {/* Gradient top line */}
      <div style={{ position:'fixed', top:0, left:0, right:0, height:1, zIndex:999, background:'linear-gradient(90deg,transparent,#635bff 25%,#9b8fff 50%,#00d4ff 75%,transparent)' }} />

      {/* Top bar */}
      <motion.div
        initial={{ y:-20, opacity:0 }} animate={{ y:0, opacity:1 }}
        transition={{ duration:0.45, ease:[0.4,0,.2,1] }}
        style={{
          position:'sticky', top:0, zIndex:200,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 22px', height:56,
          background:'rgba(3,3,10,0.9)', backdropFilter:'blur(48px) saturate(220%)',
          borderBottom:`1px solid ${T.border}`,
          boxShadow:'0 6px 32px rgba(0,0,0,.38)',
        }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:32, height:32, borderRadius:9,
            background:'linear-gradient(135deg,#635bff,#9b8fff,#00d4ff)',
            display:'flex', alignItems:'center', justifyContent:'center',
            border:'1px solid rgba(99,91,255,.5)', overflow:'hidden', flexShrink:0,
            boxShadow:'0 3px 16px rgba(99,91,255,.3)', position:'relative',
          }}>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,.18),transparent)' }} />
            <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', position:'relative', zIndex:1 }} onError={e=>e.target.style.display='none'} />
          </div>
          <div>
            <div style={{ fontSize:13.5, fontWeight:900, letterSpacing:'-0.3px' }}>Fundo AI</div>
            <div style={{ fontSize:9.5, color:T.muted2, fontWeight:500 }}>Admin Dashboard</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <div style={{ background:T.indigoBg, border:`1px solid ${T.indigoBorder}`, borderRadius:7, padding:'4px 11px', fontSize:11.5, color:'#9b8fff', fontWeight:700, display:'flex', alignItems:'center', gap:5 }}>
            <Shield size={10}/> Admin
          </div>
          <Btn variant="ghost" size="sm" onClick={logout}><LogOut size={12}/> Logout</Btn>
        </div>
      </motion.div>

      {/* Tab nav */}
      <div style={{
        display:'flex', gap:0, padding:'0 22px',
        background:'rgba(3,3,10,.85)', borderBottom:`1px solid ${T.border}`,
        backdropFilter:'blur(24px)', position:'sticky', top:56, zIndex:100,
      }}>
        {TABS.map(tab=>(
          <button
            key={tab.id} onClick={()=>setActiveTab(tab.id)}
            style={{
              padding:'11px 16px', fontSize:12.5, fontWeight:600,
              color:activeTab===tab.id?'#f0f2ff':T.muted,
              cursor:'pointer', border:'none', background:'none',
              borderBottom:`2px solid ${activeTab===tab.id?'#635bff':'transparent'}`,
              transition:'all .18s', fontFamily:'inherit',
              display:'flex', alignItems:'center', gap:7,
              letterSpacing:'-.01em',
            }}
          >
            <tab.icon size={14} style={{ opacity:activeTab===tab.id?.9:.55 }} />
            {tab.label}
            {tab.id==='pending' && pendingCount>0 && (
              <span style={{ background:T.amberBg, color:T.amber, borderRadius:99, padding:'1px 7px', fontSize:9.5, fontWeight:800, border:`1px solid ${T.amberBorder}` }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
          transition={{ duration:0.16, ease:[0.4,0,.2,1] }}
        >
          {activeTab==='resources' && <ResourcesTab api={api} upload={upload} toast={toast} />}
          {activeTab==='analytics' && <AnalyticsTab api={api} toast={toast} />}
          {activeTab==='users'     && <UsersTab api={api} toast={toast} />}
          {activeTab==='pending'   && <PendingTab api={api} toast={toast} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
