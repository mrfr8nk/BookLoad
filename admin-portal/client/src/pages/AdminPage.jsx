import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Users, BookOpen, Clock, Upload, Search,
  ChevronLeft, ChevronRight, Trash2, Edit3, Check, X, LogOut,
  Eye, EyeOff, Shield, Database, TrendingUp, Star, Award,
  FileText, CheckCircle, AlertCircle, RefreshCw, Zap, Lock,
  Package, Layers, ChevronDown, ArrowUpRight,
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
const CAT_COLOR = { paper:'#a5b4fc', textbook:'#67e8f9', syllabus:'#6ee7b7', marking_scheme:'#fcd34d' };
const CAT_BG    = { paper:'rgba(99,102,241,0.12)', textbook:'rgba(6,182,212,0.12)', syllabus:'rgba(16,185,129,0.12)', marking_scheme:'rgba(245,158,11,0.12)' };
const PLAN_COLOR = { FREE:'#ccc', STARTER:'#67e8f9', BASIC:'#6ee7b7', PRO:'#c4b5fd', PREMIUM:'#fcd34d' };
const PLAN_BG    = { FREE:'rgba(255,255,255,.07)', STARTER:'rgba(6,182,212,.12)', BASIC:'rgba(16,185,129,.12)', PRO:'rgba(139,92,246,.12)', PREMIUM:'rgba(245,158,11,.12)' };
const years = () => { const c = new Date().getFullYear(); return Array.from({ length: 20 }, (_, i) => String(c - i)); };

/* ── Small Components ───────────────────────────────────────────── */
function Badge({ label, color, bg }) {
  return (
    <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700, color:color||'#a5b4fc', background:bg||'rgba(99,102,241,.12)', letterSpacing:'.2px' }}>
      {label}
    </span>
  );
}

function StatCard({ icon: Icon, val, label, color='#a5b4fc', bg='rgba(99,102,241,.1)', border='rgba(99,102,241,.2)', barColor, delay=0 }) {
  return (
    <motion.div
      initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.5, delay, ease:[0.4,0,.2,1] }}
    >
      <SpotlightCard
        glowColor={`${color}14`}
        className="glass-card"
        style={{ padding:'22px 20px', cursor:'default' }}
      >
        {barColor && <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:barColor, borderRadius:'16px 16px 0 0' }} />}
        <div style={{ width:38, height:38, borderRadius:11, background:bg, border:`1px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14, boxShadow:`0 0 20px ${color}18` }}>
          <Icon size={16} style={{ color }} />
        </div>
        <div style={{ fontSize:30, fontWeight:900, letterSpacing:'-1.3px', marginBottom:3, color }}>{val ?? '—'}</div>
        <div style={{ fontSize:12, color:'rgba(238,240,255,.46)', fontWeight:500 }}>{label}</div>
      </SpotlightCard>
    </motion.div>
  );
}

function FormGroup({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontSize:10.5, fontWeight:800, letterSpacing:'1px', textTransform:'uppercase', color:'rgba(238,240,255,.4)' }}>{label}</label>
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant='ghost', size='md', disabled, style: extra }) {
  const [hov, setHov] = useState(false);
  const base = { display:'inline-flex', alignItems:'center', justifyContent:'center', gap:7, borderRadius:10, fontWeight:600, cursor:disabled?'not-allowed':'pointer', transition:'all .18s', border:'1px solid transparent', fontFamily:'inherit', whiteSpace:'nowrap', opacity:disabled?.4:1 };
  const sizes = { xs:{ padding:'5px 10px', fontSize:11, borderRadius:7 }, sm:{ padding:'7px 13px', fontSize:12, borderRadius:9 }, md:{ padding:'10px 18px', fontSize:13.5 } };
  const vars = {
    primary: { background:'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', color:'#fff', border:'none', boxShadow:hov?'0 10px 32px rgba(99,102,241,.55)':'0 4px 20px rgba(99,102,241,.4)', transform:hov?'translateY(-1px)':'none' },
    ghost:   { background:hov?'rgba(255,255,255,.07)':'rgba(255,255,255,.04)', color:'#eef0ff', borderColor:hov?'rgba(255,255,255,.18)':'rgba(255,255,255,.08)' },
    danger:  { background:hov?'rgba(239,68,68,.22)':'rgba(239,68,68,.1)', color:'#fca5a5', borderColor:'rgba(239,68,68,.25)' },
    success: { background:hov?'rgba(16,185,129,.22)':'rgba(16,185,129,.1)', color:'#6ee7b7', borderColor:'rgba(16,185,129,.25)' },
  };
  return (
    <button onClick={disabled?undefined:onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ ...base, ...sizes[size], ...vars[variant], ...extra }}>
      {children}
    </button>
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
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          onClick={onClose}
          style={{ position:'fixed', inset:0, zIndex:500, background:'rgba(3,3,16,.8)', backdropFilter:'blur(16px)', display:'flex', alignItems:'center', justifyContent:'center' }}
        >
          <motion.div
            initial={{ opacity:0, y:28, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:16, scale:0.96 }}
            transition={{ duration:0.24, ease:[0.34,1.2,.64,1] }}
            onClick={e=>e.stopPropagation()}
            style={{ background:'#0c0c24', border:'1px solid rgba(255,255,255,.16)', borderRadius:24, padding:32, width:500, maxWidth:'95vw', boxShadow:'0 48px 100px rgba(0,0,0,.7), 0 0 80px rgba(99,102,241,.07)', display:'flex', flexDirection:'column', gap:18 }}
          >
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h3 style={{ fontSize:18, fontWeight:900, letterSpacing:'-0.4px' }}>{title}</h3>
              <button onClick={onClose} style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, color:'rgba(238,240,255,.6)', cursor:'pointer', padding:'4px 6px', display:'flex' }}><X size={16}/></button>
            </div>
            <div>{children}</div>
            {footer && <div style={{ display:'flex', justifyContent:'flex-end', gap:10, paddingTop:4 }}>{footer}</div>}
          </motion.div>
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
  const [err, setErr]   = useState('');
  const [focused, setFocused]  = useState('');

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
    <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <motion.div
        initial={{ opacity:0, y:28, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:0.55, ease:[0.4,0,.2,1] }}
        style={{ width:420, maxWidth:'95vw', position:'relative', zIndex:1 }}
      >
        <SpotlightCard
          glowColor="rgba(99,102,241,0.12)"
          style={{
            background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.14)',
            borderRadius:26, padding:'48px 44px',
            backdropFilter:'blur(40px) saturate(180%)',
            boxShadow:'0 48px 100px rgba(0,0,0,.65), 0 0 120px rgba(99,102,241,.09)',
            overflow:'hidden',
          }}
        >
          {/* Top glow line */}
          <div style={{ position:'absolute', top:0, left:'15%', right:'15%', height:1, background:'linear-gradient(90deg,transparent,rgba(99,102,241,.6),transparent)' }} />

          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:36 }}>
            <motion.div
              whileHover={{ scale:1.06, rotate:4 }}
              style={{ width:46, height:46, borderRadius:13, background:'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(99,102,241,.45)', overflow:'hidden', flexShrink:0, boxShadow:'0 4px 24px rgba(99,102,241,.4)', position:'relative' }}
            >
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,.2),transparent)' }} />
              <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', position:'relative', zIndex:1 }} onError={e=>e.target.style.display='none'} />
            </motion.div>
            <div>
              <div style={{ fontSize:18, fontWeight:900, letterSpacing:'-0.4px' }}>Fundo AI</div>
              <div style={{ fontSize:11.5, color:'rgba(238,240,255,.4)', fontWeight:500 }}>Admin Dashboard</div>
            </div>
          </div>

          <h2 style={{ fontSize:26, fontWeight:900, letterSpacing:'-0.9px', marginBottom:8 }}>Welcome back</h2>
          <p style={{ fontSize:14, color:'rgba(238,240,255,.46)', lineHeight:1.65, marginBottom:28 }}>
            Sign in to manage resources, analytics, and users.
          </p>

          <AnimatePresence>
            {err && (
              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden', marginBottom:18 }}>
                <div style={{ display:'flex', alignItems:'center', gap:9, color:'#fca5a5', fontSize:13, padding:'11px 15px', background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.22)', borderRadius:10, lineHeight:1.5 }}>
                  <AlertCircle size={14} style={{ flexShrink:0 }} /> {err}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={doLogin} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <FormGroup label="Username">
              <input
                type="text" value={user} onChange={e=>setUser(e.target.value)}
                placeholder="Admin username" autoComplete="username" required
                onFocus={()=>setFocused('user')} onBlur={()=>setFocused('')}
              />
            </FormGroup>
            <FormGroup label="Password">
              <div style={{ position:'relative' }}>
                <input
                  type={showPass?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password" required
                  style={{ paddingRight:46 }}
                  onFocus={()=>setFocused('pass')} onBlur={()=>setFocused('')}
                />
                <button type="button" onClick={()=>setShowPass(p=>!p)} style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(238,240,255,.4)', cursor:'pointer', padding:0, display:'flex' }}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </FormGroup>
            <motion.button
              type="submit" disabled={loading}
              whileHover={!loading ? { y:-2, boxShadow:'0 12px 40px rgba(99,102,241,.6)' } : {}}
              style={{ marginTop:10, padding:'14px', background:'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', color:'#fff', fontSize:15.5, fontWeight:700, border:'none', borderRadius:12, cursor:loading?'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:9, opacity:loading?.7:1, boxShadow:'0 6px 28px rgba(99,102,241,.45)', position:'relative', overflow:'hidden' }}
            >
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,.14),transparent)', borderRadius:'inherit' }} />
              {loading ? <><span className="spinner" style={{ width:18, height:18 }}/> Signing in…</> : <><Lock size={16} style={{ position:'relative' }}/><span style={{ position:'relative' }}>Sign In</span></>}
            </motion.button>
          </form>
        </SpotlightCard>
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
  const [search, setSearch]     = useState('');
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
    <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', minHeight:'calc(100vh - 112px)' }}>
      {/* ── Sidebar ── */}
      <div style={{ borderRight:'1px solid rgba(255,255,255,.08)', padding:'20px 16px', background:'rgba(255,255,255,.012)', display:'flex', flexDirection:'column', gap:14, position:'sticky', top:112, height:'calc(100vh - 112px)', overflowY:'auto' }}>
        <div style={{ fontSize:10, fontWeight:800, letterSpacing:'1.4px', color:'rgba(238,240,255,.35)', textTransform:'uppercase' }}>Upload Resources</div>

        {/* Stats mini */}
        {stats && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
            {[{ l:'Total', v:stats.total, c:'#a5b4fc' },{ l:'Live', v:stats.approved, c:'#6ee7b7' },{ l:'Pending', v:stats.pending, c:'#fcd34d' }].map(s=>(
              <div key={s.l} style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', borderRadius:11, padding:'10px 11px' }}>
                <div style={{ fontSize:20, fontWeight:900, color:s.c, letterSpacing:'-1px' }}>{s.v}</div>
                <div style={{ fontSize:10, color:'rgba(238,240,255,.38)', fontWeight:600 }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)}
          onDrop={e=>{e.preventDefault();setDragging(false);setFiles(prev=>[...prev,...[...e.dataTransfer.files]].slice(0,100));}}
          onClick={()=>fileInputRef.current?.click()}
          style={{ border:`1.5px dashed ${dragging?'rgba(99,102,241,.7)':'rgba(99,102,241,.28)'}`, borderRadius:12, padding:'24px 12px', textAlign:'center', cursor:'pointer', background:dragging?'rgba(99,102,241,.07)':'rgba(99,102,241,.02)', transition:'all .22s', position:'relative', overflow:'hidden' }}
        >
          <motion.div animate={{ y:[0,-6,0] }} transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut' }}>
            <Upload size={22} style={{ color:'#a5b4fc', marginBottom:8 }} />
          </motion.div>
          <div style={{ fontSize:12.5, fontWeight:600, marginBottom:3 }}>{files.length?`${files.length} file(s) ready`:'Drop files or click'}</div>
          <div style={{ fontSize:10.5, color:'rgba(238,240,255,.38)' }}>PDF, DOC, PPTX — up to 80MB</div>
          <input ref={fileInputRef} type="file" multiple style={{ display:'none' }} onChange={e=>{setFiles(prev=>[...prev,...[...e.target.files]].slice(0,100));e.target.value='';}} />
        </div>

        {files.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:5, maxHeight:150, overflowY:'auto' }}>
            {files.map((f,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:7, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', borderRadius:8, padding:'6px 9px' }}>
                <FileText size={11} style={{ color:'#a5b4fc', flexShrink:0 }} />
                <span style={{ flex:1, fontSize:10.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color:'rgba(238,240,255,.65)' }}>{f.name}</span>
                <button onClick={()=>setFiles(p=>p.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', color:'rgba(238,240,255,.35)', cursor:'pointer', padding:0, display:'flex' }}><X size={10}/></button>
              </div>
            ))}
          </div>
        )}

        {/* Fields */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {[
            { label:'Category', val:upCategory, set:setUpCategory, opts:[['paper','Past Paper'],['textbook','Textbook'],['syllabus','Syllabus'],['marking_scheme','Marking Scheme']] },
            { label:'Level', val:upLevel, set:v=>{setUpLevel(v);setUpSubject('');setUpGrade(GRADES[v]?.[0]||'');}, opts:[['primary','Primary'],['olevel','O-Level'],['alevel','A-Level']] },
          ].map(({label,val,set,opts})=>(
            <div key={label}>
              <div style={{ fontSize:10, fontWeight:800, letterSpacing:'.9px', textTransform:'uppercase', color:'rgba(238,240,255,.38)', marginBottom:4 }}>{label}</div>
              <select value={val} onChange={e=>set(e.target.value)} style={{ fontSize:12 }}>
                {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ))}
          <div>
            <div style={{ fontSize:10, fontWeight:800, letterSpacing:'.9px', textTransform:'uppercase', color:'rgba(238,240,255,.38)', marginBottom:4 }}>Subject</div>
            <select value={upSubject} onChange={e=>setUpSubject(e.target.value)} style={{ fontSize:12 }}>
              <option value="">— Select —</option>
              {subjects.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
            <div>
              <div style={{ fontSize:10, fontWeight:800, letterSpacing:'.9px', textTransform:'uppercase', color:'rgba(238,240,255,.38)', marginBottom:4 }}>Grade</div>
              <select value={upGrade} onChange={e=>setUpGrade(e.target.value)} style={{ fontSize:11 }}>
                {grades.map(g=><option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:10, fontWeight:800, letterSpacing:'.9px', textTransform:'uppercase', color:'rgba(238,240,255,.38)', marginBottom:4 }}>Year</div>
              <select value={upYear} onChange={e=>setUpYear(e.target.value)} style={{ fontSize:11 }}>
                <option value="">None</option>
                {years().map(y=><option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div style={{ fontSize:10, fontWeight:800, letterSpacing:'.9px', textTransform:'uppercase', color:'rgba(238,240,255,.38)', marginBottom:4 }}>Curriculum</div>
            <select value={upCurriculum} onChange={e=>setUpCurriculum(e.target.value)} style={{ fontSize:12 }}>
              <option value="">General</option><option value="ZIMSEC">ZIMSEC</option><option value="Cambridge">Cambridge</option>
            </select>
          </div>
        </div>

        <AnimatePresence>
          {showUpProgress && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden' }}>
              <div style={{ background:'rgba(99,102,241,.07)', border:'1px solid rgba(99,102,241,.18)', borderRadius:10, padding:'10px 12px' }}>
                <div style={{ fontSize:11.5, fontWeight:600, marginBottom:7 }}>{upProgress.label}</div>
                <div style={{ height:4, background:'rgba(255,255,255,.07)', borderRadius:99, overflow:'hidden' }}>
                  <motion.div animate={{ width:`${upProgress.total?(upProgress.done/upProgress.total)*100:0}%` }} transition={{ duration:.3 }} style={{ height:'100%', background:'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', borderRadius:99 }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Btn variant="primary" onClick={doUpload} disabled={uploading||!files.length} style={{ width:'100%' }}>
          {uploading ? <><span className="spinner" style={{ width:14, height:14 }}/> Uploading…</> : <><Upload size={14}/> Upload Files</>}
        </Btn>
      </div>

      {/* ── Main content ── */}
      <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:16 }}>
        {stats && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
            <StatCard icon={Database}    val={stats.total}    label="Total Resources" barColor="linear-gradient(135deg,#6366f1,#8b5cf6)" delay={0} />
            <StatCard icon={CheckCircle} val={stats.approved} label="Live Materials"  color="#6ee7b7" bg="rgba(16,185,129,.1)" border="rgba(16,185,129,.2)" barColor="linear-gradient(135deg,#10b981,#06b6d4)" delay={0.05} />
            <StatCard icon={Clock}       val={stats.pending}  label="Pending Review"  color="#fcd34d" bg="rgba(245,158,11,.1)"  border="rgba(245,158,11,.2)"  barColor="linear-gradient(135deg,#f59e0b,#f97316)" delay={0.1} />
            <StatCard icon={Layers}      val={stats.byCategory?.length??0} label="Categories" color="#c4b5fd" bg="rgba(139,92,246,.1)" border="rgba(139,92,246,.2)" delay={0.15} />
          </div>
        )}

        {/* Toolbar */}
        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'rgba(238,240,255,.35)', pointerEvents:'none' }} />
            <input type="text" value={search} onChange={e=>onSearchChange(e.target.value)} placeholder="Search resources…" style={{ paddingLeft:38 }} />
          </div>
          <select value={catFilter} onChange={e=>{setCatFilter(e.target.value);setPage(1);}} style={{ width:'auto', fontSize:13 }}>
            <option value="">All categories</option>
            {Object.entries(CAT_LABEL).map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
          <select value={levelFilter} onChange={e=>{setLevelFilter(e.target.value);setPage(1);}} style={{ width:'auto', fontSize:13 }}>
            <option value="">All levels</option>
            {Object.entries(LVL_LABEL).map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
          <Btn variant="ghost" onClick={()=>{loadMaterials();loadStats();}}><RefreshCw size={13}/></Btn>
        </div>

        <AnimatePresence>
          {selectedIds.length>0 && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(99,102,241,.08)', border:'1px solid rgba(99,102,241,.2)', borderRadius:10, padding:'10px 16px', fontSize:13 }}>
                <span style={{ fontWeight:700, color:'#a5b4fc' }}>{selectedIds.length} selected</span>
                <Btn variant="danger" size="xs" onClick={bulkDelete}><Trash2 size={11}/> Delete Selected</Btn>
                <Btn variant="ghost" size="xs" onClick={()=>setSelectedIds([])}><X size={11}/> Clear</Btn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,.07)', background:'rgba(255,255,255,.02)' }}>
            <span style={{ fontSize:14, fontWeight:700 }}>Resources · <span style={{ color:'#a5b4fc' }}>{total}</span></span>
          </div>
          {loading ? (
            <div style={{ padding:48, textAlign:'center' }}><span className="spinner"/></div>
          ) : items.length===0 ? (
            <div style={{ padding:'60px 20px', textAlign:'center', color:'rgba(238,240,255,.4)' }}>
              <Database size={36} style={{ marginBottom:14, opacity:.4 }} />
              <div style={{ fontSize:15, fontWeight:700, color:'#eef0ff', marginBottom:5 }}>No resources found</div>
              <div style={{ fontSize:13 }}>Try different filters or upload some materials.</div>
            </div>
          ) : (
            <>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width:36 }}><input type="checkbox" checked={selectedIds.length===items.length&&items.length>0} onChange={e=>toggleAll(e.target.checked)} /></th>
                    {['Title','Category','Level','Subject','Year','Status',''].map(h=><th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {items.map((m,idx)=>(
                    <motion.tr key={m._id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:idx*.02 }}>
                      <td><input type="checkbox" checked={selectedIds.includes(m._id)} onChange={()=>toggleSelect(m._id)} /></td>
                      <td style={{ maxWidth:200 }}>
                        <div style={{ fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:190, fontSize:13 }} title={m.title}>{m.title}</div>
                        <a href={m.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:'rgba(238,240,255,.38)', textDecoration:'none' }}>↗ CDN link</a>
                      </td>
                      <td><Badge label={CAT_LABEL[m.category]||m.category} color={CAT_COLOR[m.category]} bg={CAT_BG[m.category]} /></td>
                      <td>{LVL_LABEL[m.level]||m.level}</td>
                      <td>{m.subject}</td>
                      <td>{m.year?<span style={{ background:'rgba(255,255,255,.07)', borderRadius:5, padding:'2px 7px', fontSize:11, color:'rgba(238,240,255,.5)' }}>{m.year}</span>:<span style={{ color:'rgba(238,240,255,.2)' }}>—</span>}</td>
                      <td><Badge label={m.approved?'Live':'Pending'} color={m.approved?'#6ee7b7':'#fcd34d'} bg={m.approved?'rgba(16,185,129,.12)':'rgba(245,158,11,.12)'} /></td>
                      <td>
                        <div style={{ display:'flex', gap:5 }}>
                          <Btn variant="ghost" size="xs" onClick={()=>openEdit(m)}><Edit3 size={11}/></Btn>
                          <Btn variant="danger" size="xs" onClick={()=>{setDeletingId(m._id);setDeletingName(m.title);setDeleteModal(true);}}><Trash2 size={11}/></Btn>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 18px', borderTop:'1px solid rgba(255,255,255,.07)', background:'rgba(255,255,255,.015)', fontSize:13, color:'rgba(238,240,255,.42)' }}>
                <span>{total} resources · Page {page} of {pages}</span>
                <div style={{ display:'flex', gap:5 }}>
                  <Btn variant="ghost" size="xs" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}><ChevronLeft size={13}/></Btn>
                  <Btn variant="ghost" size="xs" disabled={page>=pages} onClick={()=>setPage(p=>Math.min(pages,p+1))}><ChevronRight size={13}/></Btn>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={editModal} onClose={()=>setEditModal(false)} title="Edit Resource" footer={<><Btn variant="ghost" onClick={()=>setEditModal(false)}>Cancel</Btn><Btn variant="primary" onClick={saveEdit}>Save Changes</Btn></>}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <FormGroup label="Title"><input value={editData.title||''} onChange={e=>setEditData(d=>({...d,title:e.target.value}))}/></FormGroup>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
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
        <p style={{ fontSize:14, color:'rgba(238,240,255,.58)', lineHeight:1.65 }}>
          Delete <strong style={{ color:'#eef0ff' }}>{deletingName}</strong>? This cannot be undone.
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
  const planColors = { FREE:'rgba(200,200,200,.35)', STARTER:'#06b6d4', BASIC:'#10b981', PRO:'#8b5cf6', PREMIUM:'#f59e0b' };

  if (loading) return <div style={{ padding:64, textAlign:'center' }}><span className="spinner"/></div>;
  if (!data) return null;

  const last7 = getLast7();
  const trend  = data.signupTrend||[];
  const maxT   = Math.max(...trend.map(t=>t.count),1);
  const maxP   = Math.max(...(data.planBreakdown||[]).map(p=>p.count),1);

  return (
    <div style={{ padding:28, display:'flex', flexDirection:'column', gap:24 }}>
      {/* Stat grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(175px,1fr))', gap:12 }}>
        {[
          { icon:Users,    val:data.users?.total,    label:'Total Users',   color:'#a5b4fc', bg:'rgba(99,102,241,.1)',  border:'rgba(99,102,241,.2)',  bar:'linear-gradient(135deg,#6366f1,#8b5cf6)' },
          { icon:TrendingUp,val:data.users?.today,   label:'Joined Today',  color:'#6ee7b7', bg:'rgba(16,185,129,.1)', border:'rgba(16,185,129,.2)', bar:'linear-gradient(135deg,#10b981,#06b6d4)' },
          { icon:BarChart3, val:data.users?.week,    label:'This Week',     color:'#fcd34d', bg:'rgba(245,158,11,.1)', border:'rgba(245,158,11,.2)', bar:'linear-gradient(135deg,#f59e0b,#f97316)' },
          { icon:Star,      val:data.users?.month,   label:'This Month',    color:'#c4b5fd', bg:'rgba(139,92,246,.1)', border:'rgba(139,92,246,.2)', bar:'linear-gradient(135deg,#8b5cf6,#6366f1)' },
          { icon:Database,  val:data.materials?.total,   label:'Live Materials',color:'#a5b4fc', bg:'rgba(99,102,241,.1)', border:'rgba(99,102,241,.2)', bar:'linear-gradient(135deg,#6366f1,#8b5cf6)' },
          { icon:Clock,     val:data.materials?.pending, label:'Pending',      color:'#fcd34d', bg:'rgba(245,158,11,.1)', border:'rgba(245,158,11,.2)', bar:'linear-gradient(135deg,#f59e0b,#f97316)' },
          { icon:Upload,    val:data.materials?.community,label:'Community',   color:'#6ee7b7', bg:'rgba(16,185,129,.1)', border:'rgba(16,185,129,.2)', bar:'linear-gradient(135deg,#10b981,#06b6d4)' },
        ].map((s,i)=>(
          <StatCard key={s.label} icon={s.icon} val={s.val} label={s.label} color={s.color} bg={s.bg} border={s.border} barColor={s.bar} delay={i*.04} />
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
        {/* Trend */}
        <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,.07)', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span>Signup Trend <span style={{ color:'rgba(238,240,255,.4)', fontWeight:500, fontSize:12 }}>(7 days)</span></span>
            <TrendingUp size={14} style={{ color:'rgba(238,240,255,.35)' }} />
          </div>
          <div style={{ padding:'20px 18px', display:'flex', alignItems:'flex-end', gap:7, height:140 }}>
            {last7.map(day=>{
              const t = trend.find(x=>x._id===day)||{count:0};
              const pct = (t.count/maxT)*100;
              return (
                <div key={day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, height:'100%', justifyContent:'flex-end' }}>
                  <span style={{ fontSize:9, color:'rgba(238,240,255,.38)', height:14 }}>{t.count||''}</span>
                  <motion.div
                    initial={{ height:0 }} animate={{ height:`${Math.max(pct*.76, t.count?5:3)}px` }}
                    transition={{ duration:.9, delay:.2, ease:[.4,0,.2,1] }}
                    style={{ width:'100%', background:t.count?'linear-gradient(180deg,#6366f1,#8b5cf6)':'rgba(255,255,255,.06)', borderRadius:'4px 4px 0 0', minHeight:3 }}
                  />
                  <span style={{ fontSize:9, color:'rgba(238,240,255,.3)' }}>{day.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plan breakdown */}
        <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,.07)', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span>Plan Distribution</span>
            <Award size={14} style={{ color:'rgba(238,240,255,.35)' }} />
          </div>
          <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:12 }}>
            {['FREE','STARTER','BASIC','PRO','PREMIUM'].map(plan=>{
              const p = (data.planBreakdown||[]).find(x=>x._id===plan)||{count:0};
              return (
                <div key={plan} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:12.5, fontWeight:700, width:70, flexShrink:0, color:PLAN_COLOR[plan] }}>{plan}</span>
                  <div style={{ flex:1, background:'rgba(255,255,255,.06)', borderRadius:99, height:8, overflow:'hidden' }}>
                    <motion.div
                      initial={{ width:0 }} animate={{ width:`${Math.round((p.count/maxP)*100)}%` }}
                      transition={{ duration:1.1, delay:.35, ease:[.4,0,.2,1] }}
                      style={{ height:'100%', background:planColors[plan], borderRadius:99 }}
                    />
                  </div>
                  <span style={{ fontSize:12, color:'rgba(238,240,255,.4)', width:28, textAlign:'right', flexShrink:0 }}>{p.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
        {[
          { title:'Top Uploaders', icon:Upload, rows:data.topUploaders, valKey:'uploadCount', nameKey:'name', subKey:'plan', valColor:'#a5b4fc' },
          { title:'Recent Signups', icon:Users, rows:data.recentSignups, nameKey:'name', subKey:'plan', showBadge:true },
        ].map(({ title, icon:Icon, rows, valKey, nameKey, subKey, valColor, showBadge })=>(
          <div key={title} style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, overflow:'hidden' }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,.07)', fontSize:13, fontWeight:700, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span>{title}</span>
              <Icon size={14} style={{ color:'rgba(238,240,255,.35)' }} />
            </div>
            {(rows||[]).length===0 ? (
              <div style={{ padding:'20px 18px', color:'rgba(238,240,255,.4)', fontSize:13 }}>No data yet</div>
            ) : (rows||[]).map((u,i)=>(
              <motion.div key={u.phone||i} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*.04 }}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 18px', borderBottom:i<rows.length-1?'1px solid rgba(255,255,255,.04)':'none', transition:'background .15s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(99,102,241,.04)'}
                onMouseLeave={e=>e.currentTarget.style.background=''}
              >
                {valKey && <div style={{ fontSize:11.5, color:'rgba(238,240,255,.35)', width:18, textAlign:'center', fontWeight:600 }}>{i+1}</div>}
                <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(99,102,241,.12)', border:'1px solid rgba(99,102,241,.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, flexShrink:0, color:'#a5b4fc' }}>
                  {u.name?u.name[0].toUpperCase():'?'}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u[nameKey]||u.phone}</div>
                  <div style={{ fontSize:11, marginTop:1 }}>{showBadge?<Badge label={u[subKey]} color={PLAN_COLOR[u[subKey]]} bg={PLAN_BG[u[subKey]]} />:<span style={{ color:'rgba(238,240,255,.38)' }}>{u[subKey]}</span>}</div>
                </div>
                {valKey && <div style={{ fontSize:15, fontWeight:800, color:valColor, flexShrink:0 }}>{u[valKey]}</div>}
                {showBadge&&!valKey && <div style={{ fontSize:11, color:'rgba(238,240,255,.32)' }}>{new Date(u.createdAt).toLocaleDateString()}</div>}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   USERS TAB
   ══════════════════════════════════════════════════════════════════ */
function UsersTab({ api, toast }) {
  const [users, setUsers]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [pages, setPages]   = useState(1);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [planModal, setPlanModal]   = useState(false);
  const [planPhone, setPlanPhone]   = useState('');
  const [newPlan, setNewPlan]       = useState('FREE');
  const searchTimer = useRef();

  useEffect(()=>{loadUsers();},[page, planFilter]);
  function onSearch(v) { setSearch(v); clearTimeout(searchTimer.current); searchTimer.current=setTimeout(()=>{setPage(1);loadUsers(v);},320); }
  async function loadUsers(s) {
    setLoading(true);
    const q = new URLSearchParams({ page, limit:30, search:s??search, ...(planFilter&&{plan:planFilter}) });
    try { const d = await api('GET',`/api/users?${q}`); setUsers(d.users); setTotal(d.total); setPages(d.pages); }
    catch(e) { toast(e.message,'error'); }
    setLoading(false);
  }
  async function savePlan() {
    try { await api('PATCH',`/api/users/${planPhone}/plan`,{plan:newPlan}); toast('Plan updated','success'); setPlanModal(false); loadUsers(); }
    catch(e) { toast(e.message,'error'); }
  }

  return (
    <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'rgba(238,240,255,.35)', pointerEvents:'none' }} />
          <input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Search by phone, name, school…" style={{ paddingLeft:38 }} />
        </div>
        <select value={planFilter} onChange={e=>{setPlanFilter(e.target.value);setPage(1);}} style={{ width:'auto', fontSize:13 }}>
          <option value="">All plans</option>
          {PLANS.map(p=><option key={p} value={p}>{p}</option>)}
        </select>
        <Btn variant="ghost" onClick={()=>loadUsers()}><RefreshCw size={13}/></Btn>
      </div>
      <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, overflow:'hidden' }}>
        <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,.07)', background:'rgba(255,255,255,.02)', fontSize:14, fontWeight:700 }}>
          Users · <span style={{ color:'#a5b4fc' }}>{total}</span>
        </div>
        {loading ? <div style={{ padding:48, textAlign:'center' }}><span className="spinner"/></div>
          : users.length===0 ? (
            <div style={{ padding:'60px 20px', textAlign:'center', color:'rgba(238,240,255,.4)' }}>
              <Users size={36} style={{ marginBottom:14, opacity:.4 }} />
              <div style={{ fontSize:15, fontWeight:700, color:'#eef0ff', marginBottom:5 }}>No users found</div>
            </div>
          ) : (
            <>
              <table className="data-table">
                <thead><tr>{['Phone','Name','Plan','School','Uploads','Joined',''].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {users.map((u,i)=>(
                    <motion.tr key={u.phone} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*.02 }}>
                      <td style={{ fontFamily:'monospace', fontSize:12, color:'rgba(238,240,255,.55)' }}>{u.phone}</td>
                      <td>{u.name?<span style={{ background:'rgba(255,255,255,.06)', borderRadius:5, padding:'2px 8px', fontSize:12 }}>{u.name}</span>:<span style={{ color:'rgba(238,240,255,.2)' }}>—</span>}</td>
                      <td><Badge label={u.plan} color={PLAN_COLOR[u.plan]} bg={PLAN_BG[u.plan]} /></td>
                      <td style={{ fontSize:12, color:'rgba(238,240,255,.48)' }}>{u.school||<span style={{ color:'rgba(238,240,255,.2)' }}>—</span>}</td>
                      <td style={{ fontSize:13, fontWeight:700, color:'#a5b4fc' }}>{u.uploadCount||0}</td>
                      <td style={{ fontSize:12, color:'rgba(238,240,255,.42)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td><Btn variant="ghost" size="xs" onClick={()=>{setPlanPhone(u.phone);setNewPlan(u.plan);setPlanModal(true);}}>Change Plan</Btn></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 18px', borderTop:'1px solid rgba(255,255,255,.07)', background:'rgba(255,255,255,.015)', fontSize:13, color:'rgba(238,240,255,.42)' }}>
                <span>{total} users · Page {page} of {pages}</span>
                <div style={{ display:'flex', gap:5 }}>
                  <Btn variant="ghost" size="xs" disabled={page<=1} onClick={()=>setPage(p=>p-1)}><ChevronLeft size={13}/></Btn>
                  <Btn variant="ghost" size="xs" disabled={page>=pages} onClick={()=>setPage(p=>p+1)}><ChevronRight size={13}/></Btn>
                </div>
              </div>
            </>
          )}
      </div>
      <Modal open={planModal} onClose={()=>setPlanModal(false)} title="Change User Plan" footer={<><Btn variant="ghost" onClick={()=>setPlanModal(false)}>Cancel</Btn><Btn variant="primary" onClick={savePlan}>Save Plan</Btn></>}>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <p style={{ fontSize:13, color:'rgba(238,240,255,.52)' }}>Updating plan for <strong style={{ color:'#a5b4fc', fontFamily:'monospace' }}>{planPhone}</strong></p>
          <FormGroup label="New Plan">
            <select value={newPlan} onChange={e=>setNewPlan(e.target.value)}>
              {PLANS.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
          </FormGroup>
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
  useEffect(()=>{load();},[]);
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
    <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ fontSize:18, fontWeight:800, letterSpacing:'-0.3px' }}>Pending Review</h2>
          <p style={{ fontSize:13, color:'rgba(238,240,255,.44)', marginTop:3 }}>{items.length} submission{items.length!==1?'s':''} awaiting approval</p>
        </div>
        {items.length>0 && <Btn variant="success" onClick={approveAll}><CheckCircle size={14}/> Approve All</Btn>}
      </div>
      <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, overflow:'hidden' }}>
        {loading ? <div style={{ padding:48, textAlign:'center' }}><span className="spinner"/></div>
          : items.length===0 ? (
            <div style={{ padding:'72px 20px', textAlign:'center' }}>
              <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:220, damping:12 }}>
                <CheckCircle size={48} style={{ color:'#6ee7b7', marginBottom:18 }} />
              </motion.div>
              <div style={{ fontSize:16, fontWeight:800, marginBottom:6, letterSpacing:'-0.3px' }}>All caught up!</div>
              <div style={{ fontSize:13, color:'rgba(238,240,255,.44)' }}>No pending materials to review.</div>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr>{['Title','Category','Level','Subject','Submitted By','Date','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {items.map((m,i)=>(
                  <motion.tr key={m._id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*.03 }}>
                    <td style={{ maxWidth:200 }}><div style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:180, fontSize:13, fontWeight:600 }}>{m.title}</div></td>
                    <td><Badge label={CAT_LABEL[m.category]||m.category} color={CAT_COLOR[m.category]} bg={CAT_BG[m.category]} /></td>
                    <td>{LVL_LABEL[m.level]||m.level}</td>
                    <td>{m.subject}</td>
                    <td style={{ fontFamily:'monospace', fontSize:12, color:'rgba(238,240,255,.48)' }}>{m.uploadedBy||'—'}</td>
                    <td style={{ fontSize:12, color:'rgba(238,240,255,.42)' }}>{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <Btn variant="success" size="xs" onClick={()=>approve(m._id)}><Check size={11}/> Approve</Btn>
                        <Btn variant="danger"  size="xs" onClick={()=>reject(m._id)}><X size={11}/> Reject</Btn>
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
  { id:'users',     label:'Users',     icon:Users },
  { id:'pending',   label:'Pending',   icon:Clock },
];

export default function AdminPage() {
  const toast = useToast();
  const [token, setToken]       = useState(()=>localStorage.getItem('fundo_token')||'');
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
      {/* Top bar */}
      <motion.div
        initial={{ y:-24, opacity:0 }} animate={{ y:0, opacity:1 }}
        transition={{ duration:0.5, ease:[0.4,0,.2,1] }}
        style={{
          position:'sticky', top:0, zIndex:200,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 24px', height:60,
          background:'rgba(4,4,18,0.88)', backdropFilter:'blur(40px) saturate(200%)',
          borderBottom:'1px solid rgba(255,255,255,.09)',
          boxShadow:'0 8px 40px rgba(0,0,0,.4), 0 1px 0 rgba(99,102,241,.07)',
        }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <motion.div
            whileHover={{ scale:1.06, rotate:3 }}
            style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(99,102,241,.45)', overflow:'hidden', flexShrink:0, boxShadow:'0 4px 20px rgba(99,102,241,.35)', position:'relative' }}
          >
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,.2),transparent)' }} />
            <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', position:'relative', zIndex:1 }} onError={e=>e.target.style.display='none'} />
          </motion.div>
          <div>
            <div style={{ fontSize:14, fontWeight:900, letterSpacing:'-0.3px' }}>Fundo AI</div>
            <div style={{ fontSize:10, color:'rgba(238,240,255,.4)', fontWeight:500 }}>Admin Dashboard</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ background:'rgba(99,102,241,.1)', border:'1px solid rgba(99,102,241,.22)', borderRadius:8, padding:'5px 12px', fontSize:12, color:'#a5b4fc', fontWeight:700 }}>
            <Shield size={11} style={{ display:'inline', marginRight:5, verticalAlign:'middle' }} />Admin
          </div>
          <Btn variant="ghost" size="sm" onClick={logout}><LogOut size={13}/> Logout</Btn>
        </div>
      </motion.div>

      {/* Tab nav */}
      <div style={{ display:'flex', gap:2, padding:'0 20px', background:'rgba(4,4,18,.75)', borderBottom:'1px solid rgba(255,255,255,.08)', backdropFilter:'blur(20px)', position:'sticky', top:60, zIndex:100 }}>
        {TABS.map(tab=>(
          <button
            key={tab.id} onClick={()=>setActiveTab(tab.id)}
            style={{
              padding:'13px 18px', fontSize:13, fontWeight:600,
              color:activeTab===tab.id?'#eef0ff':'rgba(238,240,255,.45)',
              cursor:'pointer', border:'none', background:'none',
              borderBottom:`2px solid ${activeTab===tab.id?'#6366f1':'transparent'}`,
              transition:'all .2s', fontFamily:'inherit',
              display:'flex', alignItems:'center', gap:8,
            }}
          >
            <tab.icon size={15} />
            {tab.label}
            {tab.id==='pending' && pendingCount>0 && (
              <span style={{ background:'rgba(245,158,11,.18)', color:'#fcd34d', borderRadius:99, padding:'2px 8px', fontSize:10, fontWeight:800 }}>
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
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
          transition={{ duration:0.18, ease:[0.4,0,.2,1] }}
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
