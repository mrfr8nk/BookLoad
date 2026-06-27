import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Shield, Clock, Award, Users, Zap,
  BookOpen, Check, X, Star, ChevronLeft, ChevronRight,
  MessageSquare, Image, FolderOpen, ArrowRight,
} from 'lucide-react';
import { useToast } from '../hooks/useToast.jsx';

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
const years = () => { const c=new Date().getFullYear(); return Array.from({length:20},(_,i)=>String(c-i)); };

const REVIEWS = [
  { quote:'Fundo AI helped me ace my ZIMSEC Maths exam. The past papers are exactly what I needed!', name:'Tendai M.', role:'Form 4 · Harare', stars:5 },
  { quote:'I uploaded 12 past papers and got rewarded with extra AI chats. Amazing community platform!', name:'Rudo C.', role:'Lower 6 · Bulawayo', stars:5 },
  { quote:'Cambridge resources here are top quality. Found everything I needed for IGCSE Chemistry in one place.', name:'Simba K.', role:'O-Level · Gweru', stars:5 },
  { quote:'The AI study bot knows the ZIMSEC curriculum perfectly. Better than any other tool I have tried.', name:'Nyasha D.', role:'A-Level · Mutare', stars:5 },
];

const FEATURES = [
  { icon:BookOpen, title:'ZIMSEC & Cambridge', text:'All levels from Grade 1 through A-Level, both exam boards fully covered.', color:'#7c3aed', bg:'#f5f3ff' },
  { icon:Zap, title:'Earn Rewards', text:'Get bonus AI messages and image credits for every 3 approved uploads.', color:'#d97706', bg:'#fffbeb' },
  { icon:Shield, title:'Quality Verified', text:'Our admin team reviews every submission before it goes live.', color:'#059669', bg:'#ecfdf5' },
  { icon:Users, title:'1,000+ Students', text:'A growing community of learners from across all of Zimbabwe.', color:'#2563eb', bg:'#eff6ff' },
];

const STEPS = [
  { num:1, icon:Upload, title:'Choose Your Files', text:'Drag and drop past papers, textbooks, syllabuses or marking schemes. Up to 30 files at once.', color:'#7c3aed' },
  { num:2, icon:FileText, title:'Add Your Details', text:'Select the subject, level, curriculum and type. More detail means faster review and higher rewards.', color:'#059669' },
  { num:3, icon:Shield, title:'Admin Review', text:'Our quality team verifies every submission. Approved materials go live for thousands of students.', color:'#d97706' },
  { num:4, icon:Award, title:'Collect Rewards', text:'Every 3 approved uploads earns you bonus AI messages, image credits and a project slot.', color:'#2563eb' },
];

function NavBar() {
  return (
    <nav style={{
      position:'sticky', top:0, zIndex:200,
      background:'rgba(255,255,255,.97)', backdropFilter:'blur(12px)',
      borderBottom:'1px solid var(--gray-200)',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 clamp(16px,4vw,48px)', height:66,
      boxShadow:'0 1px 2px rgba(0,0,0,.04)',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#7c3aed,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', boxShadow:'0 2px 8px rgba(124,58,237,.22)', flexShrink:0 }}>
          <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="Fundo" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';}} />
        </div>
        <span style={{ fontSize:17, fontWeight:900, color:'var(--gray-900)', letterSpacing:'-.3px' }}>Fundo<span style={{ color:'#7c3aed' }}>AI</span></span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <a href="/admin" style={{ fontSize:13.5, fontWeight:600, color:'var(--gray-600)', textDecoration:'none' }}
          onMouseEnter={e=>e.target.style.color='var(--gray-900)'} onMouseLeave={e=>e.target.style.color='var(--gray-600)'}>
          Admin
        </a>
        <a
          href="https://wa.me/263778000000"
          target="_blank" rel="noopener noreferrer"
          style={{ display:'flex', alignItems:'center', gap:7, background:'#7c3aed', color:'#fff', textDecoration:'none', padding:'8px 16px', borderRadius:8, fontSize:13.5, fontWeight:700, boxShadow:'0 2px 8px rgba(124,58,237,.22)', transition:'all .15s' }}
          onMouseEnter={e=>e.currentTarget.style.background='#6d28d9'} onMouseLeave={e=>e.currentTarget.style.background='#7c3aed'}
        >
          Try on WhatsApp <ArrowRight size={13}/>
        </a>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ background:'var(--gray-900)', color:'#fff', padding:'52px clamp(16px,4vw,80px) 32px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:48, marginBottom:48 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:14 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';}} />
              </div>
              <span style={{ fontSize:16, fontWeight:900, letterSpacing:'-.2px' }}>FundoAI</span>
            </div>
            <p style={{ fontSize:13.5, color:'#9ca3af', lineHeight:1.7, maxWidth:280 }}>
              Zimbabwe's leading AI-powered educational platform, built for ZIMSEC and Cambridge students.
            </p>
            <div style={{ marginTop:16, display:'flex', gap:10 }}>
              {['support.fundo.ai@gmail.com'].map(e=>(
                <a key={e} href={`mailto:${e}`} style={{ fontSize:12, color:'#7c3aed', textDecoration:'none' }}>{e}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:11.5, fontWeight:700, letterSpacing:'.6px', textTransform:'uppercase', color:'#6b7280', marginBottom:16 }}>Platform</div>
            {['Upload Materials','Admin Portal','WhatsApp Bot','Study Resources'].map(l=>(
              <div key={l} style={{ marginBottom:10 }}><a href="#" style={{ fontSize:13.5, color:'#d1d5db', textDecoration:'none', transition:'color .15s' }} onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='#d1d5db'}>{l}</a></div>
            ))}
          </div>
          <div>
            <div style={{ fontSize:11.5, fontWeight:700, letterSpacing:'.6px', textTransform:'uppercase', color:'#6b7280', marginBottom:16 }}>Support</div>
            {['Help Center','Contact Us','Community','Privacy Policy'].map(l=>(
              <div key={l} style={{ marginBottom:10 }}><a href="#" style={{ fontSize:13.5, color:'#d1d5db', textDecoration:'none', transition:'color .15s' }} onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='#d1d5db'}>{l}</a></div>
            ))}
          </div>
        </div>
        <div style={{ borderTop:'1px solid #374151', paddingTop:24, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <p style={{ fontSize:12.5, color:'#6b7280' }}>© 2026 Fundo AI. All rights reserved. Created by Darrell Mucheri.</p>
          <p style={{ fontSize:12.5, color:'#6b7280' }}>fundoai.gleeze.com</p>
        </div>
      </div>
    </footer>
  );
}

function ReviewCarousel() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const timer = useRef();
  const total = REVIEWS.length;

  function next() { setDir(1); setCurrent(c=>(c+1)%total); }
  function prev() { setDir(-1); setCurrent(c=>(c-1+total)%total); }

  useEffect(()=>{
    timer.current = setInterval(next, 4000);
    return ()=>clearInterval(timer.current);
  },[]);

  const slide = {
    enter: d=>({ x:d>0?200:-200, opacity:0 }),
    center:{ x:0, opacity:1 },
    exit: d=>({ x:d>0?-200:200, opacity:0 }),
  };

  return (
    <section style={{ padding:'80px clamp(16px,4vw,80px)', background:'var(--gray-50)' }}>
      <div style={{ maxWidth:800, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'var(--purple-bg)', border:'1px solid var(--purple-border)', borderRadius:99, padding:'5px 14px', fontSize:12, fontWeight:700, color:'var(--purple-text)', marginBottom:16 }}>
            <Star size={11} fill="currentColor"/> Student Reviews
          </div>
          <h2 style={{ fontSize:'clamp(1.7rem,3vw,2.3rem)', fontWeight:800, color:'var(--gray-900)', letterSpacing:'-.4px' }}>
            Loved by students <span className="italic-purple">across Zimbabwe</span>
          </h2>
        </div>

        <div style={{ position:'relative', overflow:'hidden' }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={current} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration:.35, ease:[.4,0,.2,1] }}>
              <div className="card" style={{ padding:'36px 40px', textAlign:'center', boxShadow:'var(--shadow-md)' }}>
                <div style={{ display:'flex', justifyContent:'center', gap:3, marginBottom:20 }}>
                  {Array.from({length:REVIEWS[current].stars}).map((_,i)=>(
                    <Star key={i} size={18} style={{ color:'#f59e0b' }} fill="#f59e0b" />
                  ))}
                </div>
                <p style={{ fontSize:'clamp(1rem,2vw,1.15rem)', color:'var(--gray-700)', lineHeight:1.75, fontStyle:'italic', marginBottom:24 }}>
                  "{REVIEWS[current].quote}"
                </p>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div style={{ width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#fff', marginBottom:6 }}>
                    {REVIEWS[current].name[0]}
                  </div>
                  <div style={{ fontWeight:700, color:'var(--gray-900)', fontSize:14 }}>{REVIEWS[current].name}</div>
                  <div style={{ fontSize:12.5, color:'var(--gray-500)' }}>{REVIEWS[current].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:16, marginTop:24 }}>
            <button onClick={prev} style={{ width:36, height:36, borderRadius:'50%', border:'1.5px solid var(--gray-200)', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gray-500)', transition:'all .15s' }} onMouseEnter={e=>{e.currentTarget.style.borderColor='#7c3aed';e.currentTarget.style.color='#7c3aed';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--gray-200)';e.currentTarget.style.color='var(--gray-500)';}}>
              <ChevronLeft size={15}/>
            </button>
            <div style={{ display:'flex', gap:6 }}>
              {REVIEWS.map((_,i)=>(
                <button key={i} onClick={()=>{setDir(i>current?1:-1);setCurrent(i);}} style={{ width:i===current?24:8, height:8, borderRadius:99, background:i===current?'#7c3aed':'var(--gray-200)', border:'none', cursor:'pointer', padding:0, transition:'all .3s' }} />
              ))}
            </div>
            <button onClick={next} style={{ width:36, height:36, borderRadius:'50%', border:'1.5px solid var(--gray-200)', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gray-500)', transition:'all .15s' }} onMouseEnter={e=>{e.currentTarget.style.borderColor='#7c3aed';e.currentTarget.style.color='#7c3aed';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--gray-200)';e.currentTarget.style.color='var(--gray-500)';}}>
              <ChevronRight size={15}/>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Upload Form ─────────────────────────────────────────────────── */
function UploadForm() {
  const toast = useToast();
  const fileInputRef = useRef();
  const [files, setFiles]   = useState([]);
  const [dragging, setDragging] = useState(false);
  const [level, setLevel]   = useState('olevel');
  const [category, setCategory] = useState('paper');
  const [grade, setGrade]   = useState('Form 1');
  const [subject, setSubject]   = useState('');
  const [curriculum, setCurriculum] = useState('');
  const [name, setName]   = useState('');
  const [phone, setPhone] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState({ done:0, total:0, label:'' });
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const subjects = SUBJECTS[level] || [];
  const grades   = GRADES[level]   || [];

  async function doUpload(e) {
    e.preventDefault();
    if (!files.length) { setError('Please select at least one file.'); return; }
    if (!subject) { setError('Please select a subject.'); return; }
    setError(''); setUploading(true);
    const subjectFull = curriculum ? `${subject} (${curriculum})` : subject;
    let done=0, ok=0, fail=0;
    for (const f of files) {
      setProgress({ done, total:files.length, label:`Uploading ${done+1} of ${files.length}…` });
      const fd = new FormData();
      fd.append('file',f,f.name); fd.append('title',f.name.replace(/\.[^.]+$/,''));
      fd.append('category',category); fd.append('level',level); fd.append('grade',grade);
      fd.append('subject',subjectFull); fd.append('year',''); fd.append('uploaderName',name); fd.append('uploaderPhone',phone);
      try {
        const r = await fetch('/api/community/upload', { method:'POST', body:fd });
        const rj = await r.json().catch(()=>({}));
        if (!r.ok) throw new Error(rj.error || `Server error ${r.status}`);
        ok++;
      } catch(err) { fail++; if(fail===1) setError(err.message || 'Upload failed. Please try again.'); }
      done++;
    }
    setUploading(false);
    if (ok) { setSuccess(true); setFiles([]); toast(`${ok} file${ok>1?'s':''} submitted!`,'success'); }
    if (fail) toast(`${fail} file${fail>1?'s':''} failed to upload`,'error');
  }

  if (success) return (
    <motion.div initial={{ opacity:0, scale:.96 }} animate={{ opacity:1, scale:1 }} style={{ textAlign:'center', padding:'52px 20px' }}>
      <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--green-bg)', border:'2px solid var(--green-border)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
        <Check size={28} style={{ color:'var(--green)' }} strokeWidth={2.5} />
      </div>
      <h3 style={{ fontSize:22, fontWeight:800, color:'var(--gray-900)', marginBottom:8 }}>Submission Received!</h3>
      <p style={{ fontSize:15, color:'var(--gray-500)', lineHeight:1.65, maxWidth:380, margin:'0 auto 24px' }}>
        Your material is under review. Once approved, it will be live for students across Zimbabwe. You will earn rewards for every 3 approved uploads!
      </p>
      <button onClick={()=>setSuccess(false)} className="btn btn-purple" style={{ margin:'0 auto' }}>
        Submit More Files
      </button>
    </motion.div>
  );

  return (
    <form onSubmit={doUpload} style={{ display:'flex', flexDirection:'column', gap:18 }}>
      {/* Drop zone */}
      <div
        onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);setFiles(p=>[...p,...[...e.dataTransfer.files]].slice(0,30));}}
        onClick={()=>fileInputRef.current?.click()}
        style={{
          border:`2px dashed ${dragging?'#7c3aed':'#ddd6fe'}`,
          borderRadius:14, padding:'36px 20px', textAlign:'center', cursor:'pointer',
          background:dragging?'var(--purple-bg)':'var(--gray-50)',
          transition:'all .2s',
        }}
      >
        <div style={{ width:52, height:52, borderRadius:14, background:'var(--purple-bg)', border:'1.5px solid var(--purple-border)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
          <Upload size={22} style={{ color:'#7c3aed' }} />
        </div>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--gray-800)', marginBottom:4 }}>
          {files.length ? `${files.length} file${files.length>1?'s':''} ready` : 'Drop your files here or click to browse'}
        </div>
        <div style={{ fontSize:12.5, color:'var(--gray-500)' }}>PDF, DOC, DOCX — up to 80MB each</div>
        <input ref={fileInputRef} type="file" multiple style={{ display:'none' }} onChange={e=>{setFiles(p=>[...p,...[...e.target.files]].slice(0,30));e.target.value='';}} />
      </div>

      {files.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:5, maxHeight:150, overflowY:'auto' }}>
          {files.map((f,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:'1px solid var(--gray-200)', borderRadius:8, padding:'7px 10px' }}>
              <FileText size={13} style={{ color:'#7c3aed', flexShrink:0 }} />
              <span style={{ flex:1, fontSize:12.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color:'var(--gray-700)' }}>{f.name}</span>
              <span style={{ fontSize:11, color:'var(--gray-400)', flexShrink:0 }}>{(f.size/1024/1024).toFixed(1)}MB</span>
              <button type="button" onClick={()=>setFiles(p=>p.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', color:'var(--gray-300)', cursor:'pointer', padding:0, display:'flex', transition:'color .15s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--red)'} onMouseLeave={e=>e.currentTarget.style.color='var(--gray-300)'}><X size={12}/></button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div>
          <label style={{ display:'block', fontSize:11.5, fontWeight:700, letterSpacing:'.4px', textTransform:'uppercase', color:'var(--gray-500)', marginBottom:5 }}>Material Type</label>
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            {Object.entries(CAT_LABEL).map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display:'block', fontSize:11.5, fontWeight:700, letterSpacing:'.4px', textTransform:'uppercase', color:'var(--gray-500)', marginBottom:5 }}>Education Level</label>
          <select value={level} onChange={e=>{setLevel(e.target.value);setSubject('');setGrade(GRADES[e.target.value]?.[0]||'');}}>
            <option value="primary">Primary</option><option value="olevel">O-Level</option><option value="alevel">A-Level</option>
          </select>
        </div>
        <div>
          <label style={{ display:'block', fontSize:11.5, fontWeight:700, letterSpacing:'.4px', textTransform:'uppercase', color:'var(--gray-500)', marginBottom:5 }}>Subject <span style={{ color:'#dc2626' }}>*</span></label>
          <select value={subject} onChange={e=>setSubject(e.target.value)} required>
            <option value="">— Select a subject —</option>
            {subjects.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display:'block', fontSize:11.5, fontWeight:700, letterSpacing:'.4px', textTransform:'uppercase', color:'var(--gray-500)', marginBottom:5 }}>Grade / Form</label>
          <select value={grade} onChange={e=>setGrade(e.target.value)}>
            {grades.map(g=><option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display:'block', fontSize:11.5, fontWeight:700, letterSpacing:'.4px', textTransform:'uppercase', color:'var(--gray-500)', marginBottom:5 }}>Curriculum</label>
          <select value={curriculum} onChange={e=>setCurriculum(e.target.value)}>
            <option value="">General</option><option value="ZIMSEC">ZIMSEC</option><option value="Cambridge">Cambridge</option>
          </select>
        </div>
        <div>
          <label style={{ display:'block', fontSize:11.5, fontWeight:700, letterSpacing:'.4px', textTransform:'uppercase', color:'var(--gray-500)', marginBottom:5 }}>Year (optional)</label>
          <select>
            <option value="">None</option>
            {years().map(y=><option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div style={{ borderTop:'1px solid var(--gray-100)', paddingTop:16 }}>
        <div style={{ fontSize:11.5, fontWeight:700, letterSpacing:'.4px', textTransform:'uppercase', color:'var(--gray-500)', marginBottom:10 }}>Your Info (optional — to earn rewards)</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div>
            <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="WhatsApp number (e.g. 263778...)" />
          </div>
        </div>
        <p style={{ fontSize:12, color:'var(--gray-400)', marginTop:8 }}>
          Add your WhatsApp number to receive upload rewards (bonus AI chats & credits).
        </p>
      </div>

      {error && (
        <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--red)', fontSize:13, padding:'10px 13px', background:'var(--red-bg)', border:'1.5px solid var(--red-border)', borderRadius:8 }}>
          <X size={14}/> {error}
        </div>
      )}

      {uploading && (
        <div style={{ background:'var(--purple-bg)', border:'1.5px solid var(--purple-border)', borderRadius:10, padding:'12px 14px' }}>
          <div style={{ fontSize:13, fontWeight:600, color:'var(--purple-text)', marginBottom:8 }}>{progress.label}</div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width:`${progress.total?(progress.done/progress.total)*100:0}%` }} />
          </div>
        </div>
      )}

      <button type="submit" disabled={uploading||!files.length} className="btn btn-purple" style={{ width:'100%', justifyContent:'center', fontSize:15, padding:'13px', fontWeight:700 }}>
        {uploading ? <><span className="spinner spinner-sm"/> Uploading…</> : <><Upload size={16}/> Submit for Review</>}
      </button>
    </form>
  );
}

/* ══════════════════════════════════════════════════════════════════
   UPLOAD PAGE — Mindgrasp-inspired
   ══════════════════════════════════════════════════════════════════ */
export default function UploadPage() {
  const [stats, setStats] = useState({ totalResources:0, totalUsers:0 });

  useEffect(()=>{
    fetch('/api/community/stats').then(r=>r.json()).then(d=>{
      setStats({ totalResources:d.totalResources||0, totalUsers:d.totalUsers||0 });
    }).catch(()=>{});
  },[]);

  return (
    <div style={{ minHeight:'100vh', background:'#fff' }}>
      <NavBar />

      {/* ── HERO ── */}
      <section style={{ background:'linear-gradient(180deg,#f5f3ff 0%,#fff 100%)', padding:'72px clamp(16px,4vw,80px) 80px', textAlign:'center' }}>
        <div style={{ maxWidth:780, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'var(--purple-bg)', border:'1px solid var(--purple-border)', borderRadius:99, padding:'6px 16px', fontSize:12.5, fontWeight:700, color:'var(--purple-text)', marginBottom:24 }}>
              <Star size={12} fill="currentColor"/> #1 Educational Resource Platform in Zimbabwe
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, delay:.08, ease:[.4,0,.2,1] }}
            style={{ fontSize:'clamp(2rem,5vw,3.2rem)', fontWeight:900, color:'var(--gray-900)', lineHeight:1.15, marginBottom:20, letterSpacing:'-.04em' }}
          >
            Share What You Know.<br />
            <span className="italic-purple">Help Zimbabwe Learn.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, delay:.16 }}
            style={{ fontSize:'clamp(1rem,2vw,1.18rem)', color:'var(--gray-600)', lineHeight:1.75, maxWidth:580, margin:'0 auto 36px' }}
          >
            Upload past papers, textbooks and syllabuses. Help thousands of ZIMSEC and Cambridge students across Zimbabwe — and earn bonus AI rewards for every approved upload.
          </motion.p>

          {/* Stats row */}
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, delay:.24 }}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:32, flexWrap:'wrap', marginBottom:48 }}>
            {[
              { val:stats.totalResources+'+'||'500+', label:'Resources shared' },
              { val:stats.totalUsers+'+'||'1,000+', label:'Students using Fundo AI' },
              { val:'4', label:'Files per reward cycle' },
            ].map(s=>(
              <div key={s.label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:26, fontWeight:900, color:'#7c3aed', letterSpacing:'-1px', lineHeight:1 }}>{s.val}</div>
                <div style={{ fontSize:12, color:'var(--gray-500)', marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Reward pills */}
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, delay:.32 }}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, flexWrap:'wrap' }}>
            {[
              { icon:MessageSquare, label:'Bonus AI chats', color:'#7c3aed', bg:'#f5f3ff', border:'#ddd6fe' },
              { icon:Image,         label:'Image credits',  color:'#2563eb', bg:'#eff6ff', border:'#bfdbfe' },
              { icon:FolderOpen,    label:'Project slot',   color:'#059669', bg:'#ecfdf5', border:'#a7f3d0' },
            ].map(r=>(
              <div key={r.label} style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', borderRadius:99, background:r.bg, border:`1px solid ${r.border}`, fontSize:13, fontWeight:600, color:r.color }}>
                <r.icon size={14}/> {r.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── UPLOAD FORM + HOW IT WORKS ── */}
      <section style={{ padding:'72px clamp(16px,4vw,80px)', background:'#fff' }} id="upload">
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 420px', gap:64, alignItems:'start' }}>
          {/* Left: How it works */}
          <div>
            <div style={{ marginBottom:44 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'var(--purple-bg)', border:'1px solid var(--purple-border)', borderRadius:99, padding:'5px 14px', fontSize:12, fontWeight:700, color:'var(--purple-text)', marginBottom:16 }}>
                <Zap size={11}/> How it works
              </div>
              <h2 style={{ fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:900, color:'var(--gray-900)', letterSpacing:'-.04em', lineHeight:1.2, marginBottom:12 }}>
                Four simple steps <span className="italic-purple">to impact</span>
              </h2>
              <p style={{ fontSize:15, color:'var(--gray-500)', lineHeight:1.7 }}>
                Upload your materials and help students all across Zimbabwe. Each approved upload brings you closer to earning bonus AI credits.
              </p>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {STEPS.map((s,i)=>(
                <motion.div key={s.num} initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:.45, delay:i*.07, ease:[.4,0,.2,1] }}>
                  <div style={{ display:'flex', gap:16, padding:'20px 22px', borderRadius:14, border:'1.5px solid var(--gray-200)', background:'#fff', cursor:'default', transition:'all .2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color+'60';e.currentTarget.style.boxShadow=`0 6px 20px ${s.color}18`;e.currentTarget.style.background='#fafafa';}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--gray-200)';e.currentTarget.style.boxShadow='none';e.currentTarget.style.background='#fff';}}>
                    <div style={{ width:42, height:42, borderRadius:11, background:s.color+'18', border:`1.5px solid ${s.color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <s.icon size={18} style={{ color:s.color }} />
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
                        <span style={{ fontSize:10, fontWeight:800, background:s.color+'18', color:s.color, padding:'2px 8px', borderRadius:99, letterSpacing:'.3px' }}>Step {s.num}</span>
                        <span style={{ fontSize:14.5, fontWeight:700, color:'var(--gray-900)' }}>{s.title}</span>
                      </div>
                      <p style={{ fontSize:13, color:'var(--gray-500)', lineHeight:1.65 }}>{s.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Feature pills */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:32 }}>
              {FEATURES.map(f=>(
                <div key={f.title} style={{ display:'flex', alignItems:'center', gap:10, padding:'14px', borderRadius:12, border:'1px solid var(--gray-200)', background:'#fff' }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <f.icon size={15} style={{ color:f.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize:12.5, fontWeight:700, color:'var(--gray-800)', marginBottom:1 }}>{f.title}</div>
                    <div style={{ fontSize:11, color:'var(--gray-500)', lineHeight:1.4 }}>{f.text.slice(0,48)}…</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Upload form */}
          <div>
            <div className="card" style={{ padding:32, position:'sticky', top:90, boxShadow:'var(--shadow-md)', border:'1.5px solid var(--purple-border)' }}>
              <div style={{ marginBottom:22 }}>
                <h3 style={{ fontSize:19, fontWeight:800, color:'var(--gray-900)', marginBottom:5 }}>Upload Your Materials</h3>
                <p style={{ fontSize:13, color:'var(--gray-500)' }}>Submit for review. Earn rewards on approval.</p>
              </div>
              <UploadForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <ReviewCarousel />

      {/* ── CTA ── */}
      <section style={{ padding:'80px clamp(16px,4vw,80px)', background:'#7c3aed', textAlign:'center' }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.5 }}>
          <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:900, color:'#fff', letterSpacing:'-.04em', marginBottom:16 }}>
            Your next study session<br/>can be smarter.
          </h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,.8)', lineHeight:1.7, maxWidth:500, margin:'0 auto 32px' }}>
            Turn lectures and readings into a complete AI study system. Available 24/7 on WhatsApp.
          </p>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:14, flexWrap:'wrap' }}>
            <a href="https://wa.me/263778000000" target="_blank" rel="noopener noreferrer"
              style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', color:'#7c3aed', textDecoration:'none', padding:'12px 28px', borderRadius:10, fontSize:15, fontWeight:800, boxShadow:'0 4px 16px rgba(0,0,0,.15)', transition:'all .15s' }}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='none'}>
              Try on WhatsApp <ArrowRight size={15}/>
            </a>
            <a href="#upload"
              style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,.15)', color:'#fff', textDecoration:'none', padding:'12px 28px', borderRadius:10, fontSize:15, fontWeight:700, border:'1.5px solid rgba(255,255,255,.3)', transition:'all .15s' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.22)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.15)'}>
              <Upload size={15}/> Upload Materials
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
