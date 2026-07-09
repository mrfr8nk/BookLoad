import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Shield, Award, Users, Zap,
  BookOpen, Check, X, Star, ChevronLeft, ChevronRight,
  MessageSquare, Image, FolderOpen, ArrowRight, Edit3,
  Gift, Coins, RefreshCw,
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
const CAT_ABBREV = { paper:'P', textbook:'TB', syllabus:'SYL', marking_scheme:'MS' };
const years = () => { const c = new Date().getFullYear(); return Array.from({ length:20 }, (_,i) => String(c-i)); };

const REVIEWS = [
  { quote:'Fundo AI helped me ace my ZIMSEC Maths exam. The past papers are exactly what I needed!', name:'Tendai M.', role:'Form 4 · Harare', stars:5 },
  { quote:'I uploaded 12 past papers and got rewarded with extra AI chats. Amazing community platform!', name:'Rudo C.', role:'Lower 6 · Bulawayo', stars:5 },
  { quote:'Cambridge resources here are top quality. Found everything I needed for IGCSE Chemistry.', name:'Simba K.', role:'O-Level · Gweru', stars:5 },
  { quote:'The AI study bot knows the ZIMSEC curriculum perfectly. Better than any other tool.', name:'Nyasha D.', role:'A-Level · Mutare', stars:5 },
];

const FEATURES = [
  { icon:BookOpen, title:'ZIMSEC & Cambridge', text:'All levels from Grade 1 through A-Level, both exam boards covered.', color:'#7c3aed', bg:'#f5f3ff' },
  { icon:Zap, title:'Earn Rewards', text:'Get bonus AI chats, image credits, and a project slot for every 3 approved uploads.', color:'#d97706', bg:'#fffbeb' },
  { icon:Shield, title:'Quality Verified', text:'Our admin team reviews every submission before it goes live to students.', color:'#059669', bg:'#ecfdf5' },
  { icon:Users, title:'1,000+ Students', text:'A growing community of learners from across all of Zimbabwe.', color:'#2563eb', bg:'#eff6ff' },
];

const STEPS = [
  { num:1, icon:Upload, title:'Choose Your Files', text:'Drag and drop past papers, textbooks, syllabuses or marking schemes. Up to 30 files at once.', color:'#7c3aed' },
  { num:2, icon:Edit3, title:'Set Title & Details', text:'Give each file a clear name. The smarter the title, the faster admin approval.', color:'#059669' },
  { num:3, icon:Shield, title:'Admin Review', text:'Our quality team verifies every submission. Approved materials go live for thousands of students.', color:'#d97706' },
  { num:4, icon:Award, title:'Collect Rewards', text:'Every 3 approved uploads earns you bonus AI chats, image credits and a project slot.', color:'#2563eb' },
];

function suggestTitle({ file, subject, curriculum, category, year, paperNum }) {
  const ext = file.name.match(/\.([^.]+)$/)?.[1] || '';
  const baseName = file.name.replace(/\.[^.]+$/, '');
  if (!subject) return baseName;
  const curr = curriculum && curriculum !== '' ? ` ${curriculum}` : '';
  const cat = CAT_LABEL[category] || 'Document';
  if (year) {
    const pNum = paperNum ? ` Paper ${paperNum}` : '';
    return `${subject}${curr} ${year}${pNum} ${cat}`;
  }
  return `${subject}${curr} ${cat}`;
}

function NavBar() {
  return (
    <nav style={{
      position:'sticky', top:0, zIndex:200,
      background:'rgba(255,255,255,.97)', backdropFilter:'blur(12px)',
      borderBottom:'1px solid #e5e7eb',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 clamp(16px,4vw,48px)', height:62,
      boxShadow:'0 1px 3px rgba(0,0,0,.04)',
    }}>
      <a href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
        <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
          <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';}} />
        </div>
        <span style={{ fontSize:17, fontWeight:900, color:'#111827', letterSpacing:'-.3px' }}>Fundo<span style={{ color:'#7c3aed' }}>AI</span></span>
      </a>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <a href="/" style={{ fontSize:13.5, fontWeight:600, color:'#6b7280', textDecoration:'none', display:'none' }} className="desktop-nav">Home</a>
        <a href="/student/app" style={{ fontSize:13, fontWeight:600, color:'#6b7280', textDecoration:'none', padding:'7px 13px', borderRadius:8, border:'1.5px solid #e5e7eb', transition:'all .15s' }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='#7c3aed';e.currentTarget.style.color='#7c3aed';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.color='#6b7280';}}>
          My Portal
        </a>
        <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
          style={{ display:'flex', alignItems:'center', gap:6, background:'#7c3aed', color:'#fff', textDecoration:'none', padding:'8px 14px', borderRadius:8, fontSize:13, fontWeight:700, transition:'all .15s' }}
          onMouseEnter={e=>e.currentTarget.style.background='#6d28d9'} onMouseLeave={e=>e.currentTarget.style.background='#7c3aed'}>
          <MessageSquare size={13}/> WhatsApp
        </a>
      </div>
    </nav>
  );
}

function Footer() {
  const links = {
    Platform: [
      { label:'Upload Materials', href:'/upload' },
      { label:'Student Portal', href:'/student/app' },
      { label:'Admin Portal', href:'/admin' },
      { label:'WhatsApp Bot', href:'https://wa.me/263719647303' },
    ],
    Support: [
      { label:'Help Centre', href:'/help' },
      { label:'Contact Us', href:'/contact' },
      { label:'Privacy Policy', href:'/privacy' },
      { label:'Terms of Service', href:'/terms' },
    ],
  };
  return (
    <footer style={{ background:'#111827', color:'#fff', padding:'44px clamp(16px,4vw,80px) 28px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:40, marginBottom:40 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:12 }}>
              <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';}} />
              </div>
              <span style={{ fontSize:15, fontWeight:900, letterSpacing:'-.2px' }}>FundoAI</span>
            </div>
            <p style={{ fontSize:13, color:'#9ca3af', lineHeight:1.7, maxWidth:260, margin:'0 0 14px' }}>
              Zimbabwe's leading AI-powered educational platform, built for ZIMSEC and Cambridge students.
            </p>
            <a href="mailto:support.fundo.ai@gmail.com" style={{ fontSize:12, color:'#7c3aed', textDecoration:'none' }}>support.fundo.ai@gmail.com</a>
          </div>
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.6px', textTransform:'uppercase', color:'#6b7280', marginBottom:14 }}>{section}</div>
              {items.map(l => (
                <div key={l.label} style={{ marginBottom:9 }}>
                  <a href={l.href} style={{ fontSize:13, color:'#d1d5db', textDecoration:'none' }}
                    onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='#d1d5db'}>{l.label}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid #374151', paddingTop:20, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <p style={{ fontSize:12, color:'#6b7280', margin:0 }}>© 2026 Fundo AI. Created by Team Fundo AI — Darrell Mucheri & Crejinai Makanyisa.</p>
          <p style={{ fontSize:12, color:'#6b7280', margin:0 }}>fundoai.gleeze.com</p>
        </div>
      </div>
      <style>{`
        @media (max-width:640px) {
          footer > div > div:first-child { grid-template-columns:1fr !important; gap:28px !important; }
        }
      `}</style>
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
  useEffect(() => { timer.current = setInterval(next, 4000); return () => clearInterval(timer.current); }, []);
  const slide = {
    enter: d => ({ x:d>0?200:-200, opacity:0 }),
    center: { x:0, opacity:1 },
    exit: d => ({ x:d>0?-200:200, opacity:0 }),
  };
  return (
    <section style={{ padding:'64px clamp(16px,4vw,80px)', background:'#f9fafb' }}>
      <div style={{ maxWidth:720, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#f5f3ff', border:'1px solid #ddd6fe', borderRadius:99, padding:'5px 14px', fontSize:12, fontWeight:700, color:'#7c3aed', marginBottom:14 }}>
            <Star size={11} fill="currentColor"/> Student Reviews
          </div>
          <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:800, color:'#111827', letterSpacing:'-.4px' }}>
            Loved by students across <span style={{ color:'#7c3aed', fontStyle:'italic' }}>Zimbabwe</span>
          </h2>
        </div>
        <div style={{ position:'relative', overflow:'hidden' }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={current} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration:.35 }}>
              <div style={{ background:'#fff', borderRadius:16, padding:'32px', boxShadow:'0 4px 20px rgba(0,0,0,0.07)', border:'1px solid #e5e7eb', textAlign:'center' }}>
                <div style={{ display:'flex', justifyContent:'center', gap:3, marginBottom:16 }}>
                  {Array.from({length:REVIEWS[current].stars}).map((_,i) => <Star key={i} size={17} style={{ color:'#f59e0b' }} fill="#f59e0b"/>)}
                </div>
                <p style={{ fontSize:'clamp(0.95rem,2vw,1.1rem)', color:'#374151', lineHeight:1.75, fontStyle:'italic', marginBottom:22 }}>"{REVIEWS[current].quote}"</p>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800, color:'#fff', marginBottom:4 }}>{REVIEWS[current].name[0]}</div>
                  <div style={{ fontWeight:700, color:'#111827', fontSize:13.5 }}>{REVIEWS[current].name}</div>
                  <div style={{ fontSize:12, color:'#6b7280' }}>{REVIEWS[current].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:14, marginTop:20 }}>
            <button onClick={prev} style={{ width:34, height:34, borderRadius:'50%', border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#6b7280', transition:'all .15s' }} onMouseEnter={e=>{e.currentTarget.style.borderColor='#7c3aed';e.currentTarget.style.color='#7c3aed';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.color='#6b7280';}}><ChevronLeft size={14}/></button>
            <div style={{ display:'flex', gap:6 }}>
              {REVIEWS.map((_,i) => <button key={i} onClick={()=>{setDir(i>current?1:-1);setCurrent(i);}} style={{ width:i===current?22:7, height:7, borderRadius:99, background:i===current?'#7c3aed':'#e5e7eb', border:'none', cursor:'pointer', padding:0, transition:'all .3s' }}/>)}
            </div>
            <button onClick={next} style={{ width:34, height:34, borderRadius:'50%', border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#6b7280', transition:'all .15s' }} onMouseEnter={e=>{e.currentTarget.style.borderColor='#7c3aed';e.currentTarget.style.color='#7c3aed';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.color='#6b7280';}}><ChevronRight size={14}/></button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Credits Panel ─────────────────────────────────────────────── */
function CreditsPanel({ phone }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!phone) return;
    fetch(`/api/community/uploader-credits?phone=${encodeURIComponent(phone)}`)
      .then(r=>r.json()).then(d=>setData(d)).catch(()=>{});
  }, [phone]);
  if (!phone || !data) return null;
  const approved = data.approvedUploads || 0;
  const cycle = approved % 3;
  const rewards = Math.floor(approved / 3);
  return (
    <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
      style={{ background:'linear-gradient(135deg,#f5f3ff,#ede9fe)', border:'1.5px solid #c4b5fd', borderRadius:14, padding:'16px 18px', marginBottom:18 }}>
      <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:12 }}>
        <div style={{ width:32, height:32, borderRadius:9, background:'#7c3aed', display:'flex', alignItems:'center', justifyContent:'center' }}><Coins size={15} color="#fff"/></div>
        <div>
          <div style={{ fontSize:13, fontWeight:800, color:'#4c1d95' }}>Your Upload Credits</div>
          <div style={{ fontSize:11.5, color:'#7c3aed' }}>{approved} approved upload{approved!==1?'s':''} · {rewards} reward{rewards!==1?'s':''} earned</div>
        </div>
      </div>
      <div style={{ marginBottom:8 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
          <span style={{ fontSize:12, color:'#6d28d9', fontWeight:600 }}>Progress to next reward</span>
          <span style={{ fontSize:12, color:'#7c3aed', fontWeight:700 }}>{cycle}/3</span>
        </div>
        <div style={{ height:7, borderRadius:99, background:'#ddd6fe', overflow:'hidden' }}>
          <div style={{ height:'100%', borderRadius:99, background:'linear-gradient(90deg,#7c3aed,#8b5cf6)', width:`${(cycle/3)*100}%`, transition:'width .4s' }}/>
        </div>
      </div>
      <div style={{ fontSize:11.5, color:'#6d28d9' }}>
        {3-cycle} more approved upload{3-cycle!==1?'s':''} needed → earn <strong>+10 AI chats · +2 images · +1 project slot</strong>
      </div>
    </motion.div>
  );
}

/* ── Upload Form ─────────────────────────────────────────────────── */
function UploadForm() {
  const toast = useToast();
  const fileInputRef = useRef();
  const [fileItems, setFileItems] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [level, setLevel]         = useState('olevel');
  const [category, setCategory]   = useState('paper');
  const [grade, setGrade]         = useState('Form 1');
  const [subject, setSubject]     = useState('');
  const [curriculum, setCurriculum] = useState('ZIMSEC');
  const [year, setYear]           = useState('');
  const [paperNum, setPaperNum]   = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const [phone, setPhone]         = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState({ done:0, total:0, label:'' });
  const [success, setSuccess]     = useState(null);
  const [error, setError]         = useState('');
  const [editingIdx, setEditingIdx] = useState(null);

  const subjects = SUBJECTS[level] || [];
  const grades   = GRADES[level]   || [];

  function addFiles(newFiles) {
    const arr = [...newFiles].slice(0, 30 - fileItems.length);
    setFileItems(p => [...p, ...arr.map(f => ({
      file: f,
      title: suggestTitle({ file:f, subject, curriculum, category, year, paperNum }),
    }))]);
  }

  function updateAllTitles() {
    setFileItems(p => p.map(item => ({
      ...item,
      title: suggestTitle({ file:item.file, subject, curriculum, category, year, paperNum }),
    })));
  }

  function setItemTitle(i, val) {
    setFileItems(p => p.map((item, idx) => idx===i ? { ...item, title:val } : item));
  }

  function removeFile(i) {
    setFileItems(p => p.filter((_,j) => j!==i));
  }

  async function doUpload(e) {
    e.preventDefault();
    if (!fileItems.length) { setError('Please select at least one file.'); return; }
    if (!subject) { setError('Please select a subject.'); return; }
    setError(''); setUploading(true);
    const subjectFull = curriculum ? `${subject} (${curriculum})` : subject;
    let done=0, ok=0, fail=0;
    for (const item of fileItems) {
      setProgress({ done, total:fileItems.length, label:`Uploading ${done+1} of ${fileItems.length}: ${item.title || item.file.name}` });
      const fd = new FormData();
      fd.append('file', item.file, item.file.name);
      fd.append('title', item.title || item.file.name.replace(/\.[^.]+$/, ''));
      fd.append('category', category);
      fd.append('level', level);
      fd.append('grade', grade);
      fd.append('subject', subjectFull);
      fd.append('year', year || '');
      fd.append('uploaderName', uploaderName);
      fd.append('uploaderPhone', phone);
      fd.append('referralCode', referralCode);
      try {
        const r = await fetch('/api/community/upload', { method:'POST', body:fd });
        const rj = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(rj.error || `Server error ${r.status}`);
        ok++;
      } catch(err) {
        fail++;
        if (fail === 1) setError(err.message || 'Upload failed. Please try again.');
      }
      done++;
    }
    setUploading(false);
    if (ok) {
      setSuccess({ count:ok });
      setFileItems([]);
      toast(`${ok} file${ok>1?'s':''} submitted for review!`, 'success');
    }
    if (fail) toast(`${fail} file${fail>1?'s':''} failed to upload`, 'error');
  }

  if (success) return (
    <motion.div initial={{ opacity:0, scale:.96 }} animate={{ opacity:1, scale:1 }} style={{ textAlign:'center', padding:'48px 20px' }}>
      <div style={{ width:62, height:62, borderRadius:'50%', background:'#ecfdf5', border:'2px solid #a7f3d0', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px' }}>
        <Check size={26} style={{ color:'#059669' }} strokeWidth={2.5}/>
      </div>
      <h3 style={{ fontSize:21, fontWeight:800, color:'#111827', marginBottom:8 }}>Submission Received!</h3>
      <p style={{ fontSize:14.5, color:'#6b7280', lineHeight:1.7, maxWidth:360, margin:'0 auto 20px' }}>
        <strong>{success.count} file{success.count>1?'s':''}</strong> submitted for review. Once approved, they'll be live for students across Zimbabwe. You earn rewards for every 3 approvals!
      </p>
      {phone && <CreditsPanel phone={phone}/>}
      <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
        <button onClick={()=>setSuccess(null)} style={{ padding:'11px 22px', borderRadius:10, background:'#7c3aed', color:'#fff', border:'none', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit' }}>
          Upload More
        </button>
        <a href="/student/app" style={{ padding:'11px 22px', borderRadius:10, background:'#f5f3ff', color:'#7c3aed', border:'1.5px solid #ddd6fe', fontWeight:700, fontSize:14, textDecoration:'none', display:'inline-flex', alignItems:'center' }}>
          View My Uploads
        </a>
      </div>
    </motion.div>
  );

  return (
    <form onSubmit={doUpload} style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {phone && <CreditsPanel phone={phone}/>}

      {/* Drop zone */}
      <div
        onDragOver={e=>{e.preventDefault();setDragging(true);}}
        onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);addFiles(e.dataTransfer.files);}}
        onClick={()=>fileInputRef.current?.click()}
        style={{ border:`2px dashed ${dragging?'#7c3aed':'#c4b5fd'}`, borderRadius:14, padding:'30px 20px', textAlign:'center', cursor:'pointer', background:dragging?'#f5f3ff':'#faf9ff', transition:'all .2s' }}>
        <div style={{ width:48, height:48, borderRadius:13, background:'#ede9fe', border:'1.5px solid #c4b5fd', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
          <Upload size={20} style={{ color:'#7c3aed' }}/>
        </div>
        <div style={{ fontSize:14.5, fontWeight:700, color:'#1f2937', marginBottom:4 }}>
          {fileItems.length ? `${fileItems.length} file${fileItems.length>1?'s':''} selected — click or drop to add more` : 'Drop files here or click to browse'}
        </div>
        <div style={{ fontSize:12, color:'#9ca3af' }}>PDF, DOC, DOCX · up to 80MB each · max 30 files</div>
        <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx" style={{ display:'none' }} onChange={e=>{addFiles(e.target.files);e.target.value='';}}/>
      </div>

      {/* File list with editable titles */}
      {fileItems.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'.5px' }}>Files ({fileItems.length})</span>
            <button type="button" onClick={updateAllTitles} style={{ background:'none', border:'none', fontSize:12, color:'#7c3aed', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontFamily:'inherit' }}>
              <RefreshCw size={11}/> Refresh all titles
            </button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:5, maxHeight:240, overflowY:'auto' }}>
            {fileItems.map((item, i) => (
              <motion.div key={i} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*.04 }}
                style={{ background:'#fff', border:`1.5px solid ${editingIdx===i?'#7c3aed':'#e5e7eb'}`, borderRadius:10, padding:'8px 10px', transition:'border .15s' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <FileText size={13} style={{ color:'#7c3aed', flexShrink:0 }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    {editingIdx === i ? (
                      <input
                        autoFocus
                        value={item.title}
                        onChange={e=>setItemTitle(i, e.target.value)}
                        onBlur={()=>setEditingIdx(null)}
                        onKeyDown={e=>e.key==='Enter'&&setEditingIdx(null)}
                        style={{ width:'100%', border:'none', outline:'none', fontSize:13, color:'#111827', fontWeight:600, fontFamily:'inherit', background:'transparent' }}/>
                    ) : (
                      <span style={{ fontSize:13, color:'#111827', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', display:'block' }}>{item.title || item.file.name}</span>
                    )}
                    <span style={{ fontSize:11, color:'#9ca3af' }}>{item.file.name} · {(item.file.size/1024/1024).toFixed(1)} MB</span>
                  </div>
                  <button type="button" onClick={()=>setEditingIdx(editingIdx===i?null:i)}
                    style={{ background:'none', border:'none', color:'#9ca3af', cursor:'pointer', padding:'2px', display:'flex', flexShrink:0 }}
                    title="Edit title">
                    <Edit3 size={12} style={{ color:editingIdx===i?'#7c3aed':'#9ca3af' }}/>
                  </button>
                  <button type="button" onClick={()=>removeFile(i)}
                    style={{ background:'none', border:'none', color:'#d1d5db', cursor:'pointer', padding:'2px', display:'flex', flexShrink:0 }}
                    onMouseEnter={e=>e.currentTarget.style.color='#dc2626'} onMouseLeave={e=>e.currentTarget.style.color='#d1d5db'}>
                    <X size={12}/>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Global metadata */}
      <div style={{ borderTop:'1px solid #f3f4f6', paddingTop:14 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:10 }}>Material Details</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>

          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', color:'#6b7280', marginBottom:4, letterSpacing:'.3px' }}>Type</label>
            <select value={category} onChange={e=>setCategory(e.target.value)} style={{ width:'100%', padding:'10px 11px', borderRadius:9, border:'1.5px solid #e5e7eb', background:'#fff', color:'#111827', fontSize:13.5, fontFamily:'inherit', outline:'none' }}>
              {Object.entries(CAT_LABEL).map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', color:'#6b7280', marginBottom:4, letterSpacing:'.3px' }}>Level</label>
            <select value={level} onChange={e=>{setLevel(e.target.value);setSubject('');setGrade(GRADES[e.target.value]?.[0]||'');}} style={{ width:'100%', padding:'10px 11px', borderRadius:9, border:'1.5px solid #e5e7eb', background:'#fff', color:'#111827', fontSize:13.5, fontFamily:'inherit', outline:'none' }}>
              <option value="primary">Primary</option>
              <option value="olevel">O-Level</option>
              <option value="alevel">A-Level</option>
            </select>
          </div>

          <div style={{ gridColumn:'1/-1' }}>
            <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', color:'#6b7280', marginBottom:4, letterSpacing:'.3px' }}>Subject <span style={{ color:'#dc2626' }}>*</span></label>
            <select value={subject} onChange={e=>setSubject(e.target.value)} required style={{ width:'100%', padding:'10px 11px', borderRadius:9, border:'1.5px solid #e5e7eb', background:'#fff', color:subject?'#111827':'#9ca3af', fontSize:13.5, fontFamily:'inherit', outline:'none' }}>
              <option value="">— Select subject —</option>
              {subjects.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', color:'#6b7280', marginBottom:4, letterSpacing:'.3px' }}>Curriculum</label>
            <select value={curriculum} onChange={e=>setCurriculum(e.target.value)} style={{ width:'100%', padding:'10px 11px', borderRadius:9, border:'1.5px solid #e5e7eb', background:'#fff', color:'#111827', fontSize:13.5, fontFamily:'inherit', outline:'none' }}>
              <option value="">General</option>
              <option value="ZIMSEC">ZIMSEC</option>
              <option value="Cambridge">Cambridge</option>
            </select>
          </div>

          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', color:'#6b7280', marginBottom:4, letterSpacing:'.3px' }}>Grade / Form</label>
            <select value={grade} onChange={e=>setGrade(e.target.value)} style={{ width:'100%', padding:'10px 11px', borderRadius:9, border:'1.5px solid #e5e7eb', background:'#fff', color:'#111827', fontSize:13.5, fontFamily:'inherit', outline:'none' }}>
              {grades.map(g=><option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', color:'#6b7280', marginBottom:4, letterSpacing:'.3px' }}>Year (optional)</label>
            <select value={year} onChange={e=>setYear(e.target.value)} style={{ width:'100%', padding:'10px 11px', borderRadius:9, border:'1.5px solid #e5e7eb', background:'#fff', color:'#111827', fontSize:13.5, fontFamily:'inherit', outline:'none' }}>
              <option value="">None</option>
              {years().map(y=><option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', color:'#6b7280', marginBottom:4, letterSpacing:'.3px' }}>Paper # (optional)</label>
            <input type="text" value={paperNum} onChange={e=>setPaperNum(e.target.value)} placeholder="e.g. 1, 2, 3"
              style={{ width:'100%', padding:'10px 11px', borderRadius:9, border:'1.5px solid #e5e7eb', background:'#fff', color:'#111827', fontSize:13.5, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}/>
          </div>

        </div>

        {/* Smart title preview */}
        {subject && (
          <div style={{ marginTop:10, padding:'9px 13px', borderRadius:9, background:'#f0fdf4', border:'1px solid #a7f3d0' }}>
            <span style={{ fontSize:12, color:'#065f46', fontWeight:600 }}>📝 Auto-title preview: </span>
            <span style={{ fontSize:12, color:'#047857' }}>{suggestTitle({ file:{ name:'file.pdf' }, subject, curriculum, category, year, paperNum })}</span>
            <button type="button" onClick={updateAllTitles} style={{ marginLeft:8, fontSize:11.5, color:'#7c3aed', fontWeight:700, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>Apply to all files →</button>
          </div>
        )}
      </div>

      {/* Your info */}
      <div style={{ borderTop:'1px solid #f3f4f6', paddingTop:14 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:10 }}>Your Info — to earn rewards</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <div>
            <input type="text" value={uploaderName} onChange={e=>setUploaderName(e.target.value)} placeholder="Your name"
              style={{ width:'100%', padding:'10px 11px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, fontFamily:'inherit', outline:'none', boxSizing:'border-box', color:'#111827' }}/>
          </div>
          <div>
            <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="WhatsApp e.g. 263778…"
              style={{ width:'100%', padding:'10px 11px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, fontFamily:'inherit', outline:'none', boxSizing:'border-box', color:'#111827' }}/>
          </div>
          <div style={{ gridColumn:'1/-1' }}>
            <div style={{ position:'relative' }}>
              <Gift size={14} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}/>
              <input type="text" value={referralCode} onChange={e=>setReferralCode(e.target.value.toUpperCase())} placeholder="Referral code (optional)"
                style={{ width:'100%', padding:'10px 11px 10px 34px', borderRadius:9, border:'1.5px solid #e5e7eb', fontSize:14, fontFamily:'inherit', outline:'none', boxSizing:'border-box', color:'#111827', textTransform:'uppercase', letterSpacing:1 }}/>
            </div>
          </div>
        </div>
        <p style={{ fontSize:11.5, color:'#9ca3af', marginTop:7 }}>
          Add your WhatsApp number to track rewards. Every 3 approved uploads earns bonus AI chats, image credits &amp; a project slot.
        </p>
      </div>

      {error && (
        <div style={{ display:'flex', alignItems:'center', gap:8, color:'#dc2626', fontSize:13, padding:'10px 13px', background:'#fef2f2', border:'1.5px solid #fecaca', borderRadius:9 }}>
          <X size={14}/> {error}
        </div>
      )}

      {uploading && (
        <div style={{ background:'#f5f3ff', border:'1.5px solid #ddd6fe', borderRadius:10, padding:'12px 14px' }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#7c3aed', marginBottom:8 }}>{progress.label}</div>
          <div style={{ height:6, borderRadius:99, background:'#ede9fe', overflow:'hidden' }}>
            <div style={{ height:'100%', borderRadius:99, background:'linear-gradient(90deg,#7c3aed,#8b5cf6)', width:`${progress.total?(progress.done/progress.total)*100:0}%`, transition:'width .3s' }}/>
          </div>
          <div style={{ fontSize:11.5, color:'#9ca3af', marginTop:5 }}>{progress.done} of {progress.total} complete</div>
        </div>
      )}

      <button type="submit" disabled={uploading || !fileItems.length}
        style={{ width:'100%', padding:'13px', border:'none', borderRadius:12, background:uploading||!fileItems.length?'#c4b5fd':'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'#fff', fontSize:15, fontWeight:700, cursor:uploading||!fileItems.length?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'inherit', transition:'all .15s', boxShadow:uploading||!fileItems.length?'none':'0 4px 18px rgba(124,58,237,0.3)' }}>
        {uploading ? <><span style={{ width:15, height:15, borderRadius:'50%', border:'2.5px solid rgba(255,255,255,.4)', borderTopColor:'#fff', animation:'spin .7s linear infinite', display:'inline-block' }}/> Uploading…</> : <><Upload size={15}/> Submit {fileItems.length > 0 ? `${fileItems.length} File${fileItems.length>1?'s':''}` : ''} for Review</>}
      </button>
    </form>
  );
}

/* ══════════════════════════════════════════════════════════════════
   UPLOAD PAGE
   ══════════════════════════════════════════════════════════════════ */
export default function UploadPage() {
  const [stats, setStats] = useState({ totalResources:0, totalUsers:0 });
  useEffect(() => {
    fetch('/api/community/stats').then(r=>r.json()).then(d=>{
      setStats({ totalResources:d.totalResources||0, totalUsers:d.totalUsers||0 });
    }).catch(()=>{});
  }, []);

  return (
    <div style={{ minHeight:'100vh', background:'#fff', fontFamily:'Inter, system-ui, sans-serif' }}>
      <NavBar/>

      {/* ── HERO ── */}
      <section style={{ background:'linear-gradient(180deg,#f5f3ff 0%,#fff 100%)', padding:'64px clamp(16px,4vw,80px) 72px', textAlign:'center' }}>
        <div style={{ maxWidth:760, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'#f5f3ff', border:'1px solid #c4b5fd', borderRadius:99, padding:'6px 16px', fontSize:12.5, fontWeight:700, color:'#7c3aed', marginBottom:22 }}>
              <Star size={12} fill="currentColor"/> #1 Educational Resource Platform in Zimbabwe
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, delay:.08 }}
            style={{ fontSize:'clamp(1.9rem,5vw,3rem)', fontWeight:900, color:'#111827', lineHeight:1.15, marginBottom:18, letterSpacing:'-.04em' }}>
            Share What You Know.<br/>
            <span style={{ color:'#7c3aed', fontStyle:'italic' }}>Help Zimbabwe Learn.</span>
          </motion.h1>
          <motion.p initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, delay:.16 }}
            style={{ fontSize:'clamp(0.95rem,2vw,1.1rem)', color:'#4b5563', lineHeight:1.75, maxWidth:560, margin:'0 auto 32px' }}>
            Upload past papers, textbooks and syllabuses. Help thousands of ZIMSEC and Cambridge students — and earn bonus AI credits for every approved upload.
          </motion.p>

          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, delay:.24 }}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:28, flexWrap:'wrap', marginBottom:40 }}>
            {[
              { val:`${stats.totalResources||0}+`, label:'Resources shared' },
              { val:`${stats.totalUsers||0}+`, label:'Students using Fundo AI' },
              { val:'3', label:'Uploads per reward cycle' },
            ].map(s => (
              <div key={s.label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:26, fontWeight:900, color:'#7c3aed', letterSpacing:'-1px', lineHeight:1 }}>{s.val}</div>
                <div style={{ fontSize:12, color:'#6b7280', marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, delay:.32 }}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, flexWrap:'wrap' }}>
            {[
              { icon:MessageSquare, label:'+10 AI chats', color:'#7c3aed', bg:'#f5f3ff', border:'#ddd6fe' },
              { icon:Image,         label:'+2 Images',   color:'#2563eb', bg:'#eff6ff', border:'#bfdbfe' },
              { icon:FolderOpen,    label:'+1 Project',  color:'#059669', bg:'#ecfdf5', border:'#a7f3d0' },
            ].map(r => (
              <div key={r.label} style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', borderRadius:99, background:r.bg, border:`1px solid ${r.border}`, fontSize:13, fontWeight:600, color:r.color }}>
                <r.icon size={13}/> {r.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section style={{ padding:'64px clamp(16px,4vw,80px)', background:'#fff' }} id="upload">
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,440px)', gap:60, alignItems:'start' }}>

            {/* Left: How it works */}
            <div>
              <div style={{ marginBottom:40 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#f5f3ff', border:'1px solid #c4b5fd', borderRadius:99, padding:'5px 14px', fontSize:12, fontWeight:700, color:'#7c3aed', marginBottom:14 }}>
                  <Zap size={11}/> How it works
                </div>
                <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.3rem)', fontWeight:900, color:'#111827', letterSpacing:'-.04em', lineHeight:1.2, marginBottom:10 }}>
                  Four simple steps <span style={{ color:'#7c3aed', fontStyle:'italic' }}>to impact</span>
                </h2>
                <p style={{ fontSize:15, color:'#6b7280', lineHeight:1.7 }}>
                  Upload your materials and help students all across Zimbabwe. Each approved upload brings you closer to earning bonus AI credits.
                </p>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {STEPS.map((s,i) => (
                  <motion.div key={s.num} initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:.4, delay:i*.07 }}>
                    <div style={{ display:'flex', gap:14, padding:'18px 20px', borderRadius:14, border:'1.5px solid #f3f4f6', background:'#fff', transition:'all .2s' }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color+'50';e.currentTarget.style.boxShadow=`0 4px 16px ${s.color}15`;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='#f3f4f6';e.currentTarget.style.boxShadow='none';}}>
                      <div style={{ width:40, height:40, borderRadius:10, background:s.color+'18', border:`1.5px solid ${s.color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <s.icon size={17} style={{ color:s.color }}/>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                          <span style={{ fontSize:10, fontWeight:800, background:s.color+'18', color:s.color, padding:'2px 8px', borderRadius:99, letterSpacing:'.2px' }}>Step {s.num}</span>
                          <span style={{ fontSize:14, fontWeight:700, color:'#111827' }}>{s.title}</span>
                        </div>
                        <p style={{ fontSize:13.5, color:'#6b7280', lineHeight:1.6, margin:0 }}>{s.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Features grid — desktop only */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:40 }}>
                {FEATURES.map(f => (
                  <div key={f.title} style={{ padding:'18px', borderRadius:13, background:f.bg, border:`1px solid ${f.color}20` }}>
                    <div style={{ width:36, height:36, borderRadius:9, background:f.color+'20', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
                      <f.icon size={16} style={{ color:f.color }}/>
                    </div>
                    <div style={{ fontSize:13.5, fontWeight:700, color:'#111827', marginBottom:4 }}>{f.title}</div>
                    <p style={{ fontSize:12.5, color:'#6b7280', lineHeight:1.55, margin:0 }}>{f.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Upload form card */}
            <div style={{ position:'sticky', top:90 }}>
              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, delay:.2 }}
                style={{ background:'#fff', borderRadius:20, border:'1.5px solid #e5e7eb', boxShadow:'0 8px 40px rgba(0,0,0,0.08)', padding:'28px 24px', overflow:'hidden' }}>
                <div style={{ marginBottom:20 }}>
                  <h3 style={{ fontSize:18, fontWeight:800, color:'#111827', marginBottom:4 }}>Upload Resources</h3>
                  <p style={{ fontSize:13.5, color:'#6b7280' }}>Help students across Zimbabwe and earn rewards.</p>
                </div>
                <UploadForm/>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      <ReviewCarousel/>

      <Footer/>

      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }

        @media (max-width:900px) {
          section[id="upload"] > div > div {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          section[id="upload"] > div > div > div:last-child {
            position: static !important;
          }
        }

        @media (max-width:640px) {
          section:first-of-type {
            padding-top: 44px !important;
            padding-bottom: 52px !important;
          }
          section[id="upload"] {
            padding: 36px 16px !important;
          }
        }

        input:focus, select:focus {
          border-color: #7c3aed !important;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1) !important;
          outline: none !important;
        }
        input::placeholder { color: #9ca3af; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ddd6fe; border-radius: 10px; }
      `}</style>
    </div>
  );
}

