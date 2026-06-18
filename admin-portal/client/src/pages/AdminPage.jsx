import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Users, BookOpen, Clock, Upload, Search,
  ChevronLeft, ChevronRight, Trash2, Edit3, Check, X, LogOut,
  Eye, EyeOff, Shield, Database, TrendingUp, Star, Award,
  FileText, CheckCircle, AlertCircle, RefreshCw, Zap, Lock,
  Layers, UserCheck, BookMarked, Activity,
} from 'lucide-react';
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
const CAT_BADGE = { paper:'badge badge-purple', textbook:'badge badge-blue', syllabus:'badge badge-green', marking_scheme:'badge badge-amber' };
const PLAN_BADGE = { FREE:'badge badge-gray', STARTER:'badge badge-blue', BASIC:'badge badge-green', PRO:'badge badge-purple', PREMIUM:'badge badge-amber' };
const years = () => { const c=new Date().getFullYear(); return Array.from({length:20},(_,i)=>String(c-i)); };

/* ── Small reusable components ─────────────────────────────────── */
function FormGroup({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <label style={{ fontSize:11, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:'var(--gray-500)' }}>{label}</label>
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, val, label, color='#7c3aed', bgColor='#f5f3ff', delay=0 }) {
  return (
    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4, delay, ease:[.4,0,.2,1] }}>
      <div className="card" style={{ padding:'20px', position:'relative', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:bgColor, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon size={18} style={{ color }} />
          </div>
        </div>
        <div style={{ fontSize:28, fontWeight:800, letterSpacing:'-1px', color:'var(--gray-900)', lineHeight:1 }}>{val ?? '—'}</div>
        <div style={{ fontSize:12.5, color:'var(--gray-500)', marginTop:5, fontWeight:500 }}>{label}</div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${color}60,${color})`, opacity:.6, borderRadius:'0 0 12px 12px' }} />
      </div>
    </motion.div>
  );
}

function Btn({ children, onClick, variant='ghost', size='md', disabled, style: extra, type='button' }) {
  const cls = {
    ghost: 'btn btn-ghost',
    primary: 'btn btn-purple',
    outline: 'btn btn-outline',
    danger: 'btn btn-danger',
    success: 'btn btn-success',
  }[variant] || 'btn btn-ghost';
  const szCls = size==='sm'?' btn-sm':size==='xs'?' btn-xs':'';
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      className={cls+szCls}
      disabled={disabled}
      style={extra}
    >
      {children}
    </button>
  );
}

function Modal({ open, onClose, title, children, footer, width=460 }) {
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
          style={{ position:'fixed', inset:0, zIndex:500, background:'rgba(0,0,0,.45)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
        >
          <motion.div
            initial={{ opacity:0, y:16, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:8, scale:0.97 }}
            transition={{ duration:.2, ease:[.34,1.1,.64,1] }}
            onClick={e=>e.stopPropagation()}
            className="card"
            style={{ width, maxWidth:'95vw', padding:28, display:'flex', flexDirection:'column', gap:20, boxShadow:'var(--shadow-lg)' }}
          >
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h3 style={{ fontSize:16, fontWeight:800 }}>{title}</h3>
              <button onClick={onClose} style={{ background:'none', border:'1.5px solid var(--gray-200)', borderRadius:6, color:'var(--gray-500)', cursor:'pointer', padding:'3px 5px', display:'flex', transition:'all .15s' }}
                onMouseEnter={e=>{e.currentTarget.style.background='var(--gray-100)';}} onMouseLeave={e=>{e.currentTarget.style.background='none';}}>
                <X size={14}/>
              </button>
            </div>
            <div>{children}</div>
            {footer && <div style={{ display:'flex', justifyContent:'flex-end', gap:8, paddingTop:4, borderTop:'1px solid var(--gray-100)' }}>{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BulkBar({ count, label='items', onDelete, onClear }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden' }}>
          <div style={{
            display:'flex', alignItems:'center', gap:10, flexWrap:'wrap',
            background:'var(--purple-bg)', border:'1.5px solid var(--purple-border)',
            borderRadius:10, padding:'9px 14px', fontSize:13,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <div style={{ width:20, height:20, borderRadius:6, background:'var(--purple)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Check size={11} style={{ color:'#fff' }} />
              </div>
              <span style={{ fontWeight:700, color:'var(--purple-text)' }}>{count} {label} selected</span>
            </div>
            <div style={{ display:'flex', gap:6, marginLeft:'auto' }}>
              <Btn variant="danger" size="xs" onClick={onDelete}><Trash2 size={10}/> Delete Selected</Btn>
              <Btn variant="ghost" size="xs" onClick={onClear}><X size={10}/> Clear</Btn>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LOGIN
   ══════════════════════════════════════════════════════════════════ */
function LoginScreen({ onLogin }) {
  const toast = useToast();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function doLogin(e) {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const res  = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ username:user, password:pass }) });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(data.error || 'Invalid credentials');
      localStorage.setItem('fundo_token', data.token);
      onLogin(data.token);
    } catch(e) { setErr(e.message); }
    setLoading(false);
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--gray-50)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.45, ease:[.4,0,.2,1] }} style={{ width:420, maxWidth:'100%' }}>
        {/* Brand header */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{
            width:56, height:56, borderRadius:16, margin:'0 auto 16px',
            background:'linear-gradient(135deg,#7c3aed,#8b5cf6)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 8px 24px rgba(124,58,237,.3)', overflow:'hidden',
          }}>
            <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="Fundo" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';e.target.parentNode.innerHTML='<span style="font-size:24px;font-weight:900;color:#fff">F</span>';}} />
          </div>
          <h1 style={{ fontSize:26, fontWeight:900, color:'var(--gray-900)', letterSpacing:'-.5px', marginBottom:4 }}>Welcome back</h1>
          <p style={{ fontSize:14, color:'var(--gray-500)' }}>Sign in to the Fundo AI admin portal</p>
        </div>

        <div className="card" style={{ padding:32, boxShadow:'var(--shadow-md)' }}>
          <AnimatePresence>
            {err && (
              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden', marginBottom:18 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--red)', fontSize:13, padding:'10px 13px', background:'var(--red-bg)', border:'1.5px solid var(--red-border)', borderRadius:8 }}>
                  <AlertCircle size={14} style={{ flexShrink:0 }} /> {err}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={doLogin} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <FormGroup label="Username">
              <input type="text" value={user} onChange={e=>setUser(e.target.value)} placeholder="Enter your username" autoComplete="username" required />
            </FormGroup>
            <FormGroup label="Password">
              <div style={{ position:'relative' }}>
                <input type={showPass?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required style={{ paddingRight:40 }} />
                <button type="button" onClick={()=>setShowPass(p=>!p)} style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--gray-400)', cursor:'pointer', padding:0, display:'flex' }}>
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </FormGroup>
            <button
              type="submit" disabled={loading}
              className="btn btn-purple"
              style={{ marginTop:4, padding:'11px', fontSize:15, width:'100%', justifyContent:'center', gap:8 }}
            >
              {loading ? <><span className="spinner spinner-sm"/> Signing in…</> : <><Lock size={15}/> Sign In</>}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', marginTop:20, fontSize:12, color:'var(--gray-400)' }}>
          Fundo AI · Admin Portal
        </p>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   RESOURCES TAB
   ══════════════════════════════════════════════════════════════════ */
function ResourcesTab({ api, upload, toast }) {
  const [stats, setStats]   = useState(null);
  const [items, setItems]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [pages, setPages]   = useState(1);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter]   = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const [deleteModal, setDeleteModal]   = useState(false);
  const [deletingId, setDeletingId]     = useState('');
  const [deletingName, setDeletingName] = useState('');
  const searchTimer = useRef();

  useEffect(()=>{ loadStats(); },[]);
  useEffect(()=>{ loadMaterials(); },[page, catFilter, levelFilter]);

  function onSearchChange(v) {
    setSearch(v); clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(()=>{ setPage(1); loadMaterials(v); }, 320);
  }

  async function loadStats() { try { const d=await api('GET','/api/stats'); setStats(d); } catch {} }
  async function loadMaterials(s) {
    setLoading(true);
    const q = new URLSearchParams({ page, limit:20, search:s??search, ...(catFilter&&{category:catFilter}), ...(levelFilter&&{level:levelFilter}) });
    try { const d=await api('GET',`/api/materials?${q}`); setItems(d.items); setTotal(d.total); setPages(d.pages); }
    catch(e) { toast(e.message,'error'); }
    setLoading(false);
  }

  function toggleSelect(id) { setSelectedIds(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]); }
  function toggleAll(c)  { setSelectedIds(c?items.map(i=>i._id):[]); }

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
    try { await api('PATCH',`/api/materials/${editData.id}`,editData); toast('Updated','success'); setEditModal(false); loadMaterials(); loadStats(); }
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
    let done=0,ok=0,fail=0;
    for (const f of files) {
      setUpProgress({ done, total:files.length, label:`Uploading ${done+1} of ${files.length}…` });
      const fd = new FormData();
      fd.append('file',f,f.name); fd.append('title',f.name.replace(/\.[^.]+$/,'')); fd.append('category',upCategory);
      fd.append('level',upLevel); fd.append('grade',upGrade); fd.append('subject',subjectFull); fd.append('year',upYear);
      try { await upload('/api/materials/upload',fd); ok++; } catch { fail++; }
      done++;
    }
    setUpProgress({ done:files.length, total:files.length, label:`Done — ${ok} uploaded${fail?`, ${fail} failed`:''}` });
    if (ok) toast(`${ok} file(s) uploaded`,'success');
    if (fail) toast(`${fail} file(s) failed`,'error');
    setFiles([]); setUploading(false);
    setTimeout(()=>setShowUpProgress(false),3500);
    loadMaterials(); loadStats();
  }

  const subjects = SUBJECTS[upLevel] || [];
  const grades   = GRADES[upLevel]   || [];

  return (
    <div style={{ display:'flex', minHeight:'calc(100vh - 105px)' }}>
      {/* ── Upload Sidebar ── */}
      <aside style={{
        width:260, flexShrink:0, borderRight:'1px solid var(--gray-200)',
        background:'var(--gray-50)', padding:'20px 16px', display:'flex',
        flexDirection:'column', gap:14, overflowY:'auto',
        position:'sticky', top:105, height:'calc(100vh - 105px)',
      }}>
        <div style={{ fontSize:11.5, fontWeight:800, letterSpacing:'.6px', color:'var(--gray-400)', textTransform:'uppercase', paddingBottom:8, borderBottom:'1px solid var(--gray-200)' }}>Upload Materials</div>

        {stats && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
            {[{l:'Total',v:stats.total,c:'#7c3aed',bg:'#f5f3ff'},{l:'Live',v:stats.approved,c:'#059669',bg:'#ecfdf5'},{l:'Pending',v:stats.pending,c:'#d97706',bg:'#fffbeb'}].map(s=>(
              <div key={s.l} className="card" style={{ padding:'10px', textAlign:'center' }}>
                <div style={{ fontSize:20, fontWeight:900, color:s.c, letterSpacing:'-1px' }}>{s.v}</div>
                <div style={{ fontSize:10.5, color:'var(--gray-500)', fontWeight:600 }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)}
          onDrop={e=>{e.preventDefault();setDragging(false);setFiles(p=>[...p,...[...e.dataTransfer.files]].slice(0,100));}}
          onClick={()=>fileInputRef.current?.click()}
          style={{
            border:`2px dashed ${dragging?'#7c3aed':'#ddd6fe'}`, borderRadius:12,
            padding:'22px 12px', textAlign:'center', cursor:'pointer',
            background:dragging?'var(--purple-bg)':'#fff',
            transition:'all .2s',
          }}
        >
          <Upload size={22} style={{ color:'#7c3aed', marginBottom:8 }} />
          <div style={{ fontSize:12.5, fontWeight:700, color:'var(--gray-700)', marginBottom:2 }}>
            {files.length ? `${files.length} file(s) ready` : 'Drop files or click'}
          </div>
          <div style={{ fontSize:11, color:'var(--gray-400)' }}>PDF, DOC — up to 80MB</div>
          <input ref={fileInputRef} type="file" multiple style={{ display:'none' }} onChange={e=>{setFiles(p=>[...p,...[...e.target.files]].slice(0,100));e.target.value='';}} />
        </div>

        {files.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:4, maxHeight:120, overflowY:'auto' }}>
            {files.map((f,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:6, background:'#fff', border:'1px solid var(--gray-200)', borderRadius:7, padding:'5px 8px' }}>
                <FileText size={10} style={{ color:'#7c3aed', flexShrink:0 }} />
                <span style={{ flex:1, fontSize:10.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color:'var(--gray-600)' }}>{f.name}</span>
                <button onClick={()=>setFiles(p=>p.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', color:'var(--gray-400)', cursor:'pointer', padding:0, display:'flex' }}><X size={9}/></button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {[
            { label:'Category', val:upCategory, set:setUpCategory, opts:[['paper','Past Paper'],['textbook','Textbook'],['syllabus','Syllabus'],['marking_scheme','Marking Scheme']] },
            { label:'Level',    val:upLevel,    set:v=>{setUpLevel(v);setUpSubject('');setUpGrade(GRADES[v]?.[0]||'');}, opts:[['primary','Primary'],['olevel','O-Level'],['alevel','A-Level']] },
          ].map(({label,val,set,opts})=>(
            <FormGroup key={label} label={label}>
              <select value={val} onChange={e=>set(e.target.value)} style={{ fontSize:12.5 }}>
                {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </FormGroup>
          ))}
          <FormGroup label="Subject">
            <select value={upSubject} onChange={e=>setUpSubject(e.target.value)} style={{ fontSize:12.5 }}>
              <option value="">— Select —</option>
              {subjects.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </FormGroup>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
            <FormGroup label="Grade">
              <select value={upGrade} onChange={e=>setUpGrade(e.target.value)} style={{ fontSize:11.5 }}>
                {grades.map(g=><option key={g} value={g}>{g}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Year">
              <select value={upYear} onChange={e=>setUpYear(e.target.value)} style={{ fontSize:11.5 }}>
                <option value="">None</option>
                {years().map(y=><option key={y} value={y}>{y}</option>)}
              </select>
            </FormGroup>
          </div>
          <FormGroup label="Curriculum">
            <select value={upCurriculum} onChange={e=>setUpCurriculum(e.target.value)} style={{ fontSize:12.5 }}>
              <option value="">General</option><option value="ZIMSEC">ZIMSEC</option><option value="Cambridge">Cambridge</option>
            </select>
          </FormGroup>
        </div>

        <AnimatePresence>
          {showUpProgress && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden' }}>
              <div style={{ background:'var(--purple-bg)', border:'1.5px solid var(--purple-border)', borderRadius:9, padding:'10px 12px' }}>
                <div style={{ fontSize:11.5, fontWeight:600, color:'var(--purple-text)', marginBottom:7 }}>{upProgress.label}</div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width:`${upProgress.total?(upProgress.done/upProgress.total)*100:0}%` }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={doUpload} disabled={uploading||!files.length}
          className="btn btn-purple" style={{ width:'100%', justifyContent:'center', fontSize:13.5 }}
        >
          {uploading ? <><span className="spinner spinner-sm"/> Uploading…</> : <><Upload size={14}/> Upload Files</>}
        </button>
      </aside>

      {/* ── Main content ── */}
      <div style={{ flex:1, padding:'22px 24px', display:'flex', flexDirection:'column', gap:16, minWidth:0 }}>
        {stats && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            <StatCard icon={Database}    val={stats.total}    label="Total Resources" color="#7c3aed" bgColor="#f5f3ff" delay={0} />
            <StatCard icon={CheckCircle} val={stats.approved} label="Live Materials"  color="#059669" bgColor="#ecfdf5" delay={.05} />
            <StatCard icon={Clock}       val={stats.pending}  label="Pending Review"  color="#d97706" bgColor="#fffbeb" delay={.1} />
            <StatCard icon={Layers}      val={stats.byCategory?.length??0} label="Categories" color="#2563eb" bgColor="#eff6ff" delay={.15} />
          </div>
        )}

        {/* Toolbar */}
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--gray-400)', pointerEvents:'none' }} />
            <input value={search} onChange={e=>onSearchChange(e.target.value)} placeholder="Search resources…" style={{ paddingLeft:32 }} />
          </div>
          <select value={catFilter} onChange={e=>{setCatFilter(e.target.value);setPage(1);}} style={{ width:'auto', fontSize:13 }}>
            <option value="">All categories</option>
            {Object.entries(CAT_LABEL).map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
          <select value={levelFilter} onChange={e=>{setLevelFilter(e.target.value);setPage(1);}} style={{ width:'auto', fontSize:13 }}>
            <option value="">All levels</option>
            {Object.entries(LVL_LABEL).map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
          <Btn variant="ghost" size="sm" onClick={()=>{loadMaterials();loadStats();}}><RefreshCw size={13}/></Btn>
        </div>

        <BulkBar count={selectedIds.length} label="resources" onDelete={bulkDelete} onClear={()=>setSelectedIds([])} />

        <div className="card" style={{ overflow:'hidden', flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid var(--gray-100)', background:'var(--gray-50)' }}>
            <span style={{ fontSize:13.5, fontWeight:700, color:'var(--gray-900)' }}>
              Resources <span style={{ color:'#7c3aed', fontWeight:800 }}>{total}</span>
            </span>
          </div>
          {loading ? (
            <div style={{ padding:52, textAlign:'center' }}><span className="spinner"/></div>
          ) : items.length===0 ? (
            <div style={{ padding:'56px 20px', textAlign:'center', color:'var(--gray-400)' }}>
              <Database size={36} style={{ marginBottom:12, opacity:.3 }} />
              <div style={{ fontSize:15, fontWeight:700, color:'var(--gray-600)', marginBottom:4 }}>No resources found</div>
              <div style={{ fontSize:13 }}>Try different filters or upload some materials.</div>
            </div>
          ) : (
            <>
              <div style={{ overflowX:'auto' }}>
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
                    {items.map((m,i)=>(
                      <motion.tr key={m._id} className={selectedIds.includes(m._id)?'row-selected':''} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*.015 }}>
                        <td><input type="checkbox" checked={selectedIds.includes(m._id)} onChange={()=>toggleSelect(m._id)} /></td>
                        <td style={{ maxWidth:185 }}>
                          <div style={{ fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:175 }} title={m.title}>{m.title}</div>
                          <a href={m.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:'var(--gray-400)', textDecoration:'none' }}>↗ view</a>
                        </td>
                        <td><span className={CAT_BADGE[m.category]||'badge badge-gray'}>{CAT_LABEL[m.category]||m.category}</span></td>
                        <td style={{ color:'var(--gray-500)', fontSize:13 }}>{LVL_LABEL[m.level]||m.level}</td>
                        <td>{m.subject}</td>
                        <td>{m.year||<span style={{ color:'var(--gray-300)' }}>—</span>}</td>
                        <td><span className={m.approved?'badge badge-green':'badge badge-amber'}>{m.approved?'Live':'Pending'}</span></td>
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
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', borderTop:'1px solid var(--gray-100)', background:'var(--gray-50)', fontSize:12.5, color:'var(--gray-500)' }}>
                <span>Page {page} of {pages} · {total} resources</span>
                <div style={{ display:'flex', gap:4 }}>
                  <Btn variant="ghost" size="xs" disabled={page<=1} onClick={()=>setPage(p=>p-1)}><ChevronLeft size={12}/></Btn>
                  <Btn variant="ghost" size="xs" disabled={page>=pages} onClick={()=>setPage(p=>p+1)}><ChevronRight size={12}/></Btn>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Modal open={editModal} onClose={()=>setEditModal(false)} title="Edit Resource"
        footer={<><Btn variant="ghost" onClick={()=>setEditModal(false)}>Cancel</Btn><Btn variant="primary" onClick={saveEdit}>Save Changes</Btn></>}>
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
                <option value="">None</option>{years().map(y=><option key={y} value={y}>{y}</option>)}
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
                <option value="true">Live</option><option value="false">Pending</option>
              </select>
            </FormGroup>
          </div>
        </div>
      </Modal>

      <Modal open={deleteModal} onClose={()=>setDeleteModal(false)} title="Delete Resource"
        footer={<><Btn variant="ghost" onClick={()=>setDeleteModal(false)}>Cancel</Btn><Btn variant="danger" onClick={confirmDelete}><Trash2 size={13}/> Delete</Btn></>}>
        <p style={{ fontSize:13.5, color:'var(--gray-600)', lineHeight:1.65 }}>
          Delete <strong style={{ color:'var(--gray-900)' }}>{deletingName}</strong>? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ANALYTICS TAB
   ══════════════════════════════════════════════════════════════════ */
function AnalyticsTab({ api, toast }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ load(); },[]);
  async function load() { setLoading(true); try { setData(await api('GET','/api/analytics')); } catch(e){ toast(e.message,'error'); } setLoading(false); }

  const getLast7 = () => Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(6-i)); return d.toISOString().slice(0,10); });

  if (loading) return <div style={{ padding:72, textAlign:'center' }}><span className="spinner"/></div>;
  if (!data) return null;

  const last7  = getLast7();
  const trend  = data.signupTrend||[];
  const maxT   = Math.max(...trend.map(t=>t.count),1);
  const maxP   = Math.max(...(data.planBreakdown||[]).map(p=>p.count),1);
  const planColors = { FREE:'#9ca3af', STARTER:'#2563eb', BASIC:'#059669', PRO:'#7c3aed', PREMIUM:'#d97706' };

  return (
    <div style={{ padding:24, display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:12 }}>
        {[
          { icon:Users,     val:data.users?.total,       label:'Total Users',    color:'#7c3aed', bg:'#f5f3ff' },
          { icon:TrendingUp,val:data.users?.today,       label:'Joined Today',   color:'#059669', bg:'#ecfdf5' },
          { icon:BarChart3, val:data.users?.week,        label:'This Week',      color:'#d97706', bg:'#fffbeb' },
          { icon:Star,      val:data.users?.month,       label:'This Month',     color:'#2563eb', bg:'#eff6ff' },
          { icon:Database,  val:data.materials?.total,   label:'Live Materials', color:'#7c3aed', bg:'#f5f3ff' },
          { icon:Clock,     val:data.materials?.pending, label:'Pending',        color:'#d97706', bg:'#fffbeb' },
          { icon:Upload,    val:data.materials?.community,label:'Community',     color:'#059669', bg:'#ecfdf5' },
        ].map((s,i)=><StatCard key={s.label} icon={s.icon} val={s.val} label={s.label} color={s.color} bgColor={s.bg} delay={i*.03} />)}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Trend chart */}
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--gray-100)', fontSize:13, fontWeight:700, color:'var(--gray-900)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            Signup Trend <span style={{ fontSize:11.5, color:'var(--gray-400)', fontWeight:400 }}>last 7 days</span>
          </div>
          <div style={{ padding:'18px 16px', display:'flex', alignItems:'flex-end', gap:8, height:140 }}>
            {last7.map(day=>{
              const t = trend.find(x=>x._id===day)||{count:0};
              return (
                <div key={day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, height:'100%', justifyContent:'flex-end' }}>
                  <span style={{ fontSize:9, color:'var(--gray-400)', height:14 }}>{t.count||''}</span>
                  <motion.div
                    initial={{ height:0 }} animate={{ height:`${Math.max((t.count/maxT)*80, t.count?5:2)}px` }}
                    transition={{ duration:.8, delay:.1, ease:[.4,0,.2,1] }}
                    style={{ width:'100%', background:t.count?'linear-gradient(180deg,#7c3aed,#8b5cf6)':'var(--gray-100)', borderRadius:'3px 3px 0 0', minHeight:2 }}
                  />
                  <span style={{ fontSize:8.5, color:'var(--gray-400)' }}>{day.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plan breakdown */}
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--gray-100)', fontSize:13, fontWeight:700, color:'var(--gray-900)' }}>Plan Distribution</div>
          <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:10 }}>
            {['FREE','STARTER','BASIC','PRO','PREMIUM'].map(plan=>{
              const p=(data.planBreakdown||[]).find(x=>x._id===plan)||{count:0};
              return (
                <div key={plan} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:11.5, fontWeight:700, width:68, flexShrink:0, color:planColors[plan] }}>{plan}</span>
                  <div style={{ flex:1, background:'var(--gray-100)', borderRadius:99, height:7, overflow:'hidden' }}>
                    <motion.div initial={{ width:0 }} animate={{ width:`${Math.round((p.count/maxP)*100)}%` }}
                      transition={{ duration:1, delay:.2, ease:[.4,0,.2,1] }}
                      style={{ height:'100%', background:planColors[plan], borderRadius:99 }} />
                  </div>
                  <span style={{ fontSize:12, color:'var(--gray-500)', width:24, textAlign:'right', flexShrink:0 }}>{p.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {[
          { title:'Top Uploaders', icon:Upload, rows:data.topUploaders, valKey:'uploadCount', nameKey:'name' },
          { title:'Recent Signups', icon:Users, rows:data.recentSignups, nameKey:'name', showDate:true },
        ].map(({ title, icon:Icon, rows, valKey, nameKey, showDate })=>(
          <div key={title} className="card" style={{ overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--gray-100)', fontSize:13, fontWeight:700, color:'var(--gray-900)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              {title} <Icon size={14} style={{ color:'var(--gray-400)' }} />
            </div>
            {(rows||[]).length===0
              ? <div style={{ padding:'18px 16px', color:'var(--gray-400)', fontSize:13 }}>No data yet</div>
              : (rows||[]).map((u,i)=>(
                <motion.div key={u.phone||i} initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*.03 }}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 16px', borderBottom:i<rows.length-1?'1px solid var(--gray-100)':'none' }}>
                  <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--purple-bg)', border:'1px solid var(--purple-border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, flexShrink:0, color:'#7c3aed' }}>
                    {u.name?u.name[0].toUpperCase():'?'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color:'var(--gray-800)' }}>{u[nameKey]||u.phone}</div>
                    <div style={{ fontSize:11, color:'var(--gray-400)', marginTop:1 }}>{u.plan}</div>
                  </div>
                  {valKey && <div style={{ fontSize:14, fontWeight:800, color:'#7c3aed', flexShrink:0 }}>{u[valKey]}</div>}
                  {showDate && <div style={{ fontSize:11, color:'var(--gray-400)', flexShrink:0 }}>{new Date(u.createdAt).toLocaleDateString()}</div>}
                </motion.div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   USERS (STUDENTS) TAB
   ══════════════════════════════════════════════════════════════════ */
function UsersTab({ api, toast }) {
  const [users, setUsers]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [pages, setPages]   = useState(1);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [planModal, setPlanModal]   = useState(false);
  const [planPhone, setPlanPhone]   = useState('');
  const [newPlan, setNewPlan]       = useState('FREE');
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingPhone, setDeletingPhone] = useState('');
  const [deletingName, setDeletingName]   = useState('');
  const [bulkModal, setBulkModal] = useState(false);
  const searchTimer = useRef();

  useEffect(()=>{ loadUsers(); },[page, planFilter]);

  function onSearch(v) {
    setSearch(v); clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(()=>{ setPage(1); loadUsers(v); }, 320);
  }

  async function loadUsers(s) {
    setLoading(true);
    const q = new URLSearchParams({ page, limit:30, search:s??search, ...(planFilter&&{plan:planFilter}) });
    try { const d=await api('GET',`/api/users?${q}`); setUsers(d.users); setTotal(d.total); setPages(d.pages); }
    catch(e) { toast(e.message,'error'); }
    setLoading(false);
  }

  function toggleSelect(phone) { setSelectedPhones(p=>p.includes(phone)?p.filter(x=>x!==phone):[...p,phone]); }
  function toggleAll(c) { setSelectedPhones(c?users.map(u=>u.phone):[]); }

  async function savePlan() {
    try { await api('PATCH',`/api/users/${planPhone}/plan`,{plan:newPlan}); toast('Plan updated','success'); setPlanModal(false); loadUsers(); }
    catch(e) { toast(e.message,'error'); }
  }
  async function confirmDelete() {
    try { await api('DELETE',`/api/users/${deletingPhone}`); toast('Student deleted','success'); setDeleteModal(false); loadUsers(); }
    catch(e) { toast(e.message,'error'); }
  }
  async function confirmBulkDelete() {
    try { const d=await api('DELETE','/api/users',{phones:selectedPhones}); toast(`${d.deleted} student(s) deleted`,'success'); setSelectedPhones([]); setBulkModal(false); loadUsers(); }
    catch(e) { toast(e.message,'error'); }
  }

  return (
    <div style={{ padding:24, display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <div>
          <h2 style={{ fontSize:18, fontWeight:800, color:'var(--gray-900)' }}>Students</h2>
          <p style={{ fontSize:12.5, color:'var(--gray-500)', marginTop:2 }}>{total} registered users</p>
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--gray-400)', pointerEvents:'none' }} />
          <input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Search by phone, name, school…" style={{ paddingLeft:32 }} />
        </div>
        <select value={planFilter} onChange={e=>{setPlanFilter(e.target.value);setPage(1);}} style={{ width:'auto', fontSize:13 }}>
          <option value="">All plans</option>
          {PLANS.map(p=><option key={p} value={p}>{p}</option>)}
        </select>
        <Btn variant="ghost" size="sm" onClick={()=>loadUsers()}><RefreshCw size={13}/></Btn>
      </div>

      <BulkBar count={selectedPhones.length} label="students" onDelete={()=>setBulkModal(true)} onClear={()=>setSelectedPhones([])} />

      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--gray-100)', background:'var(--gray-50)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:13.5, fontWeight:700, color:'var(--gray-900)' }}>Students <span style={{ color:'#7c3aed', fontWeight:800 }}>{total}</span></span>
          {selectedPhones.length>0 && <span style={{ fontSize:12, color:'var(--gray-500)' }}>{selectedPhones.length} selected</span>}
        </div>

        {loading ? (
          <div style={{ padding:52, textAlign:'center' }}><span className="spinner"/></div>
        ) : users.length===0 ? (
          <div style={{ padding:'56px 20px', textAlign:'center', color:'var(--gray-400)' }}>
            <Users size={36} style={{ marginBottom:12, opacity:.3 }} />
            <div style={{ fontSize:15, fontWeight:700, color:'var(--gray-600)', marginBottom:4 }}>No students found</div>
            <div style={{ fontSize:13 }}>Try a different search or filter.</div>
          </div>
        ) : (
          <>
            <div style={{ overflowX:'auto' }}>
              <table className="data-table" style={{ minWidth:680 }}>
                <thead>
                  <tr>
                    <th style={{ width:34 }}>
                      <input type="checkbox" checked={users.length>0&&selectedPhones.length===users.length} onChange={e=>toggleAll(e.target.checked)} />
                    </th>
                    {['Phone','Name','Plan','School / Grade','Uploads','Joined','Actions'].map(h=><th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u,i)=>(
                    <motion.tr key={u.phone} className={selectedPhones.includes(u.phone)?'row-selected':''} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*.015 }}>
                      <td><input type="checkbox" checked={selectedPhones.includes(u.phone)} onChange={()=>toggleSelect(u.phone)} /></td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--purple-bg)', border:'1.5px solid var(--purple-border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#7c3aed', flexShrink:0 }}>
                            {u.name?u.name[0].toUpperCase():'?'}
                          </div>
                          <span style={{ fontFamily:'monospace', fontSize:11.5, color:'var(--gray-500)' }}>{u.phone}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight:600, color:'var(--gray-800)', fontSize:13 }}>{u.name||<span style={{ color:'var(--gray-300)' }}>—</span>}</td>
                      <td><span className={PLAN_BADGE[u.plan]||'badge badge-gray'}>{u.plan}</span></td>
                      <td style={{ fontSize:12.5, color:'var(--gray-500)' }}>
                        {u.school||u.grade ? `${u.school||''}${u.school&&u.grade?' · ':''}${u.grade||''}` : <span style={{ color:'var(--gray-300)' }}>—</span>}
                      </td>
                      <td style={{ fontWeight:700, color:'#7c3aed', fontSize:13 }}>{u.uploadCount||0}</td>
                      <td style={{ fontSize:12, color:'var(--gray-400)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display:'flex', gap:4 }}>
                          <Btn variant="ghost" size="xs" onClick={()=>{ setPlanPhone(u.phone); setNewPlan(u.plan); setPlanModal(true); }}><UserCheck size={10}/> Plan</Btn>
                          <Btn variant="danger" size="xs" onClick={()=>{ setDeletingPhone(u.phone); setDeletingName(u.name||u.phone); setDeleteModal(true); }}><Trash2 size={10}/></Btn>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', borderTop:'1px solid var(--gray-100)', background:'var(--gray-50)', fontSize:12.5, color:'var(--gray-500)' }}>
              <span>Page {page} of {pages} · {total} students</span>
              <div style={{ display:'flex', gap:4 }}>
                <Btn variant="ghost" size="xs" disabled={page<=1} onClick={()=>setPage(p=>p-1)}><ChevronLeft size={12}/></Btn>
                <Btn variant="ghost" size="xs" disabled={page>=pages} onClick={()=>setPage(p=>p+1)}><ChevronRight size={12}/></Btn>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Plan modal */}
      <Modal open={planModal} onClose={()=>setPlanModal(false)} title="Change Student Plan"
        footer={<><Btn variant="ghost" onClick={()=>setPlanModal(false)}>Cancel</Btn><Btn variant="primary" onClick={savePlan}>Save Plan</Btn></>}>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <p style={{ fontSize:13, color:'var(--gray-600)' }}>Updating plan for <strong style={{ color:'var(--purple)', fontFamily:'monospace', fontSize:12 }}>{planPhone}</strong></p>
          <FormGroup label="New Plan">
            <select value={newPlan} onChange={e=>setNewPlan(e.target.value)}>
              {PLANS.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
          </FormGroup>
        </div>
      </Modal>

      {/* Delete single */}
      <Modal open={deleteModal} onClose={()=>setDeleteModal(false)} title="Delete Student"
        footer={<><Btn variant="ghost" onClick={()=>setDeleteModal(false)}>Cancel</Btn><Btn variant="danger" onClick={confirmDelete}><Trash2 size={13}/> Delete</Btn></>}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ display:'flex', gap:10, padding:'12px 14px', background:'var(--red-bg)', border:'1.5px solid var(--red-border)', borderRadius:9, alignItems:'flex-start' }}>
            <AlertCircle size={16} style={{ color:'var(--red)', flexShrink:0, marginTop:1 }} />
            <div style={{ fontSize:13, color:'#7f1d1d' }}>This will permanently delete the student and all their data.</div>
          </div>
          <p style={{ fontSize:13.5, color:'var(--gray-600)' }}>Delete <strong style={{ color:'var(--gray-900)' }}>{deletingName}</strong>?</p>
        </div>
      </Modal>

      {/* Bulk delete */}
      <Modal open={bulkModal} onClose={()=>setBulkModal(false)} title={`Delete ${selectedPhones.length} Students`}
        footer={<><Btn variant="ghost" onClick={()=>setBulkModal(false)}>Cancel</Btn><Btn variant="danger" onClick={confirmBulkDelete}><Trash2 size={13}/> Delete {selectedPhones.length}</Btn></>}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ display:'flex', gap:10, padding:'12px 14px', background:'var(--red-bg)', border:'1.5px solid var(--red-border)', borderRadius:9, alignItems:'flex-start' }}>
            <AlertCircle size={16} style={{ color:'var(--red)', flexShrink:0, marginTop:1 }} />
            <div style={{ fontSize:13, color:'#7f1d1d' }}>This cannot be undone. All data will be permanently removed.</div>
          </div>
          <p style={{ fontSize:13.5, color:'var(--gray-600)' }}>Delete <strong style={{ color:'var(--gray-900)' }}>{selectedPhones.length} student{selectedPhones.length!==1?'s':''}</strong>?</p>
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
  async function reject(id)  { if (!window.confirm('Delete this submission?')) return; try { await api('DELETE',`/api/materials/${id}`); toast('Rejected','info'); load(); } catch(e){ toast(e.message,'error'); } }
  async function approveAll() {
    if (!window.confirm(`Approve all ${items.length} submissions?`)) return;
    await Promise.all(items.map(m=>api('POST',`/api/materials/${m._id}/approve`).catch(()=>{})));
    toast(`${items.length} approved`,'success'); load();
  }

  return (
    <div style={{ padding:24, display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <div>
          <h2 style={{ fontSize:18, fontWeight:800, color:'var(--gray-900)' }}>Pending Review</h2>
          <p style={{ fontSize:12.5, color:'var(--gray-500)', marginTop:2 }}>{items.length} submission{items.length!==1?'s':''} awaiting approval</p>
        </div>
        {items.length>0 && <Btn variant="success" onClick={approveAll}><CheckCircle size={14}/> Approve All</Btn>}
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:52, textAlign:'center' }}><span className="spinner"/></div>
        ) : items.length===0 ? (
          <div style={{ padding:'64px 20px', textAlign:'center' }}>
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:220, damping:14 }}>
              <CheckCircle size={44} style={{ color:'var(--green)', marginBottom:16 }} />
            </motion.div>
            <div style={{ fontSize:16, fontWeight:800, color:'var(--gray-900)', marginBottom:5 }}>All caught up!</div>
            <div style={{ fontSize:13.5, color:'var(--gray-500)' }}>No pending materials to review.</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>{['Title','Category','Level','Subject','Submitted By','Date','Actions'].map(h=><th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {items.map((m,i)=>(
                <motion.tr key={m._id} initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*.025 }}>
                  <td style={{ maxWidth:180 }}><div style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:170, fontWeight:600 }}>{m.title}</div></td>
                  <td><span className={CAT_BADGE[m.category]||'badge badge-gray'}>{CAT_LABEL[m.category]||m.category}</span></td>
                  <td style={{ fontSize:12.5, color:'var(--gray-500)' }}>{LVL_LABEL[m.level]||m.level}</td>
                  <td>{m.subject}</td>
                  <td style={{ fontFamily:'monospace', fontSize:11.5, color:'var(--gray-400)' }}>{m.uploadedBy||'—'}</td>
                  <td style={{ fontSize:12, color:'var(--gray-400)' }}>{new Date(m.createdAt).toLocaleDateString()}</td>
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
  { id:'resources', label:'Resources',  icon:Database },
  { id:'analytics', label:'Analytics',  icon:BarChart3 },
  { id:'users',     label:'Students',   icon:Users },
  { id:'pending',   label:'Pending',    icon:Clock },
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
    <div style={{ minHeight:'100vh', background:'#fff' }}>
      {/* Top nav */}
      <div style={{
        position:'sticky', top:0, zIndex:200,
        background:'rgba(255,255,255,.95)', backdropFilter:'blur(12px)',
        borderBottom:'1px solid var(--gray-200)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 24px', height:60,
        boxShadow:'0 1px 3px rgba(0,0,0,.05)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:34, height:34, borderRadius:9,
            background:'linear-gradient(135deg,#7c3aed,#8b5cf6)',
            display:'flex', alignItems:'center', justifyContent:'center',
            overflow:'hidden', flexShrink:0, boxShadow:'0 2px 8px rgba(124,58,237,.25)',
          }}>
            <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';}} />
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:'var(--gray-900)', letterSpacing:'-.2px' }}>Fundo AI</div>
            <div style={{ fontSize:10.5, color:'var(--gray-400)', lineHeight:1 }}>Admin Portal</div>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:5, background:'var(--purple-bg)', border:'1px solid var(--purple-border)', borderRadius:6, padding:'4px 10px', fontSize:12, fontWeight:700, color:'var(--purple-text)' }}>
            <Shield size={11}/> Admin
          </div>
          <Btn variant="ghost" size="sm" onClick={logout}><LogOut size={13}/> Logout</Btn>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{
        display:'flex', gap:0, borderBottom:'1px solid var(--gray-200)',
        background:'#fff', padding:'0 24px',
        position:'sticky', top:60, zIndex:100,
      }}>
        {TABS.map(tab=>(
          <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
            style={{
              padding:'12px 16px', fontSize:13, fontWeight:600,
              color:activeTab===tab.id?'#7c3aed':'var(--gray-500)',
              cursor:'pointer', border:'none', background:'none',
              borderBottom:`2.5px solid ${activeTab===tab.id?'#7c3aed':'transparent'}`,
              transition:'all .18s', fontFamily:'inherit',
              display:'flex', alignItems:'center', gap:7,
              marginBottom:'-1px',
            }}
            onMouseEnter={e=>{ if (activeTab!==tab.id) e.currentTarget.style.color='var(--gray-700)'; }}
            onMouseLeave={e=>{ if (activeTab!==tab.id) e.currentTarget.style.color='var(--gray-500)'; }}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.id==='pending' && pendingCount>0 && (
              <span style={{ background:'#fffbeb', color:'#d97706', borderRadius:99, padding:'1px 7px', fontSize:10, fontWeight:800, border:'1px solid #fde68a' }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:.14, ease:[.4,0,.2,1] }}>
          {activeTab==='resources' && <ResourcesTab api={api} upload={upload} toast={toast} />}
          {activeTab==='analytics' && <AnalyticsTab api={api} toast={toast} />}
          {activeTab==='users'     && <UsersTab api={api} toast={toast} />}
          {activeTab==='pending'   && <PendingTab api={api} toast={toast} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
