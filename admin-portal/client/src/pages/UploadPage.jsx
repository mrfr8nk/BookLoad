import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useInView } from 'framer-motion';
import {
  Upload, FileText, Database, Send, X, Plus, CheckCircle, AlertCircle,
  RefreshCw, Star, Zap, Shield, Clock, Award, Users, Sparkles,
  BookOpen, ChevronRight, ArrowRight, Quote, ChevronLeft,
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import SpotlightCard from '../components/SpotlightCard.jsx';
import ChatWidget from '../components/ChatWidget.jsx';
import { useToast } from '../hooks/useToast.jsx';

/* ── Constants ──────────────────────────────────────────────────── */
const SUBJECTS = {
  primary: ['Mathematics','English','Shona','Ndebele','Science','Social Studies','Environmental Science','Art & Craft'],
  olevel: ['Mathematics','English Language','English Literature','History','Geography','Biology','Chemistry','Physics','Combined Science','Agriculture','Commerce','Accounting','Economics','Business Studies','Computer Science','Food & Nutrition','Fashion & Fabrics','Art','Shona','Ndebele'],
  alevel: ['Mathematics','Pure Mathematics','Statistics','Further Mathematics','Physics','Chemistry','Biology','History','Geography','Economics','Business Studies','Accounting','Computer Science','English Literature'],
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

/* ── Carousel slides ─────────────────────────────────────────────── */
const CAROUSEL_ITEMS = [
  { quote: 'Fundo AI helped me ace my ZIMSEC Maths exam. The past papers are exactly what I needed!', name: 'Tendai M.', role: 'Form 4 · Harare', stars: 5, color: '#a5b4fc', bg: 'rgba(99,102,241,0.1)' },
  { quote: 'I uploaded 12 past papers and got rewarded with extra AI chats. Amazing community platform!', name: 'Rudo C.', role: 'Lower 6 · Bulawayo', stars: 5, color: '#6ee7b7', bg: 'rgba(16,185,129,0.1)' },
  { quote: 'Cambridge resources here are top quality. Found everything I needed for IGCSE Chemistry in one place.', name: 'Simba K.', role: 'O-Level · Gweru', stars: 5, color: '#67e8f9', bg: 'rgba(6,182,212,0.1)' },
  { quote: 'The AI study bot knows the ZIMSEC curriculum perfectly. Better than any other tool I have tried.', name: 'Nyasha D.', role: 'A-Level · Mutare', stars: 5, color: '#fcd34d', bg: 'rgba(245,158,11,0.1)' },
  { quote: 'Shared syllabuses for all my subjects and now other students download them daily. Feels great!', name: 'Tapiwa F.', role: 'Grade 7 · Masvingo', stars: 5, color: '#c4b5fd', bg: 'rgba(139,92,246,0.1)' },
];

/* ── Feature data ────────────────────────────────────────────────── */
const FEATURES = [
  { icon: BookOpen, title: 'ZIMSEC & Cambridge', text: 'All levels from Grade 1 through A-Level, both exam boards fully covered.', color:'#a5b4fc', bg:'rgba(99,102,241,0.1)' },
  { icon: Zap,      title: 'Earn Rewards',       text: 'Get bonus AI messages and image credits for every approved upload.',   color:'#fcd34d', bg:'rgba(245,158,11,0.1)' },
  { icon: Shield,   title: 'Quality Verified',   text: 'Our admin team reviews every submission before it goes live.',          color:'#6ee7b7', bg:'rgba(16,185,129,0.1)' },
  { icon: Users,    title: '1,000+ Students',    text: 'A growing community of learners from across all of Zimbabwe.',         color:'#67e8f9', bg:'rgba(6,182,212,0.1)' },
];

/* ── Animation variants ─────────────────────────────────────────── */
const fadeUp    = { hidden:{ opacity:0, y:40 },      visible:{ opacity:1, y:0 } };
const fadeLeft  = { hidden:{ opacity:0, x:-48 },     visible:{ opacity:1, x:0 } };
const fadeRight = { hidden:{ opacity:0, x:48 },      visible:{ opacity:1, x:0 } };
const scaleIn   = { hidden:{ opacity:0, scale:0.88 }, visible:{ opacity:1, scale:1 } };
const stagger   = { visible:{ transition:{ staggerChildren:0.09 } } };

/* ── Hooks ───────────────────────────────────────────────────────── */
function useCountUp(target, inView) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const t = setInterval(() => { start += step; if (start >= target) { setVal(target); clearInterval(t); } else setVal(Math.floor(start)); }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return val;
}

/* ── StatPill ────────────────────────────────────────────────────── */
function StatPill({ icon: Icon, target, suffix='', label, delay }) {
  const ref = useRef();
  const inView = useInView(ref, { once: true });
  const val = useCountUp(target, inView);
  return (
    <motion.div
      ref={ref}
      initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp}
      transition={{ duration:0.6, delay, ease:[0.4,0,.2,1] }}
      style={{ flex:1, padding:'28px 20px', textAlign:'center', borderRight:'1px solid rgba(255,255,255,0.07)', position:'relative' }}
    >
      <div style={{ width:42, height:42, borderRadius:13, background:'linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.12) 50%,rgba(6,182,212,.10))', border:'1px solid rgba(99,102,241,.22)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', boxShadow:'0 0 28px rgba(99,102,241,.14)' }}>
        <Icon size={19} style={{ color:'#a5b4fc' }} />
      </div>
      <motion.div
        initial={{ opacity:0, scale:0.5 }} animate={inView ? { opacity:1, scale:1 } : {}}
        transition={{ delay:delay+0.2, type:'spring', stiffness:240, damping:13 }}
        style={{ fontSize:34, fontWeight:900, letterSpacing:'-2px', lineHeight:1 }}
      >
        {val.toLocaleString()}{suffix}
      </motion.div>
      <div style={{ fontSize:12, color:'rgba(238,240,255,.42)', marginTop:5, fontWeight:500 }}>{label}</div>
    </motion.div>
  );
}

/* ── AnimatedWord ────────────────────────────────────────────────── */
function AnimatedWords({ text, style, delay=0, className }) {
  const words = text.split(' ');
  return (
    <span style={{ display:'inline' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity:0, y:40, rotateX:'-35deg' }}
          animate={{ opacity:1, y:0, rotateX:'0deg' }}
          transition={{ duration:0.65, delay:delay + i*0.1, ease:[0.4,0,.2,1] }}
          style={{ display:'inline-block', marginRight: i < words.length-1 ? '0.28em' : 0, ...style }}
          className={className}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ── Carousel ────────────────────────────────────────────────────── */
function Carousel() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir]         = useState(1);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);
  const total = CAROUSEL_ITEMS.length;
  const AUTO_INTERVAL = 4500;
  const timer = useRef();

  const startTimer = useCallback(() => {
    clearInterval(timer.current);
    timer.current = setInterval(() => next(), AUTO_INTERVAL);
  }, []);

  useEffect(() => { startTimer(); return () => clearInterval(timer.current); }, []);

  function next() { setDir(1); setCurrent(c => (c+1) % total); startTimer(); }
  function prev() { setDir(-1); setCurrent(c => (c-1+total) % total); startTimer(); }
  function goTo(i) { setDir(i > current ? 1 : -1); setCurrent(i); startTimer(); }

  const slide = { enter:d => ({ x:d>0?260:-260, opacity:0, scale:0.9 }), center:{ x:0, opacity:1, scale:1 }, exit:d => ({ x:d>0?-260:260, opacity:0, scale:0.9 }) };

  return (
    <section style={{ padding:'0 0 88px', overflow:'hidden' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, margin:'-60px' }} variants={fadeUp} transition={{ duration:0.5 }} style={{ marginBottom:48, textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:11, fontWeight:700, letterSpacing:'1.6px', color:'#a5b4fc', textTransform:'uppercase', marginBottom:14 }}>
            <Star size={12} /> Student Reviews
          </div>
          <h2 style={{ fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:900, letterSpacing:'-0.9px' }}>Loved by students across Zimbabwe</h2>
        </motion.div>

        <div style={{ position:'relative' }}>
          {/* Main card */}
          <div style={{ overflow:'hidden', borderRadius:24, perspective:800 }}>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={current}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration:0.42, ease:[0.4,0,.2,1] }}
              >
                <SpotlightCard
                  glowColor={`${CAROUSEL_ITEMS[current].color}18`}
                  style={{
                    background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.10)',
                    borderRadius:24, padding:'48px 52px',
                    position:'relative', overflow:'hidden',
                    backdropFilter:'blur(28px)',
                    boxShadow:'0 32px 80px rgba(0,0,0,0.4)',
                  }}
                >
                  {/* bg glow */}
                  <div style={{ position:'absolute', top:-80, right:-60, width:280, height:280, borderRadius:'50%', background:`radial-gradient(circle, ${CAROUSEL_ITEMS[current].color}18 0%, transparent 70%)`, pointerEvents:'none' }} />
                  {/* Top accent */}
                  <div style={{ position:'absolute', top:0, left:'15%', right:'15%', height:1, background:`linear-gradient(90deg,transparent,${CAROUSEL_ITEMS[current].color}55,transparent)` }} />

                  <Quote size={40} style={{ color:CAROUSEL_ITEMS[current].color, opacity:.25, marginBottom:18 }} />
                  <p style={{ fontSize:'clamp(1rem,2vw,1.25rem)', lineHeight:1.72, color:'rgba(238,240,255,0.85)', fontWeight:500, fontStyle:'italic', maxWidth:680, marginBottom:32, position:'relative', zIndex:1 }}>
                    "{CAROUSEL_ITEMS[current].quote}"
                  </p>
                  <div style={{ display:'flex', alignItems:'center', gap:16, position:'relative', zIndex:1 }}>
                    <div style={{ width:48, height:48, borderRadius:'50%', background:CAROUSEL_ITEMS[current].bg, border:`1px solid ${CAROUSEL_ITEMS[current].color}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, color:CAROUSEL_ITEMS[current].color, flexShrink:0 }}>
                      {CAROUSEL_ITEMS[current].name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize:15, fontWeight:800, marginBottom:2 }}>{CAROUSEL_ITEMS[current].name}</div>
                      <div style={{ fontSize:12.5, color:'rgba(238,240,255,0.45)' }}>{CAROUSEL_ITEMS[current].role}</div>
                    </div>
                    <div style={{ marginLeft:'auto', display:'flex', gap:3 }}>
                      {Array.from({length:CAROUSEL_ITEMS[current].stars}).map((_,i)=>(
                        <motion.div key={i} initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*0.06, type:'spring', stiffness:240, damping:12 }}>
                          <Star size={16} style={{ color:'#fcd34d' }} fill="#fcd34d" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Arrow buttons */}
          {[{fn:prev,dir:-1,pos:'left'},{fn:next,dir:1,pos:'right'}].map(({fn,pos})=>(
            <motion.button key={pos} onClick={fn} whileHover={{ scale:1.1 }} whileTap={{ scale:.93 }}
              style={{ position:'absolute', top:'50%', [pos]:pos==='left'?-20:-20, transform:'translateY(-50%)', width:44, height:44, borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(238,240,255,.7)', backdropFilter:'blur(12px)', transition:'all .2s', zIndex:10 }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(99,102,241,0.14)';e.currentTarget.style.borderColor='rgba(99,102,241,0.3)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.borderColor='rgba(255,255,255,0.12)';}}
            >
              {pos==='left'?<ChevronLeft size={18}/>:<ChevronRight size={18}/>}
            </motion.button>
          ))}

          {/* Dots */}
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:24 }}>
            {CAROUSEL_ITEMS.map((_,i)=>(
              <motion.button
                key={i} onClick={()=>goTo(i)}
                animate={{ scale:i===current?1:0.7, opacity:i===current?1:0.4, width:i===current?28:8 }}
                transition={{ duration:.3, ease:[0.4,0,.2,1] }}
                style={{ height:8, borderRadius:99, background:i===current?`linear-gradient(90deg,#6366f1,#8b5cf6)`:'rgba(255,255,255,0.2)', border:'none', cursor:'pointer', padding:0 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Steps Section ────────────────────────────────────────────────── */
function StepsSection() {
  const STEPS = [
    { icon:Upload,      num:1, title:'Choose Your Files',    text:'Drag and drop past papers, textbooks, syllabuses or marking schemes. Up to 30 files at once.', color:'#a5b4fc', bg:'rgba(99,102,241,0.12)', side:'left' },
    { icon:FileText,    num:2, title:'Add Your Details',     text:'Select the subject, level, curriculum, and type. More detail means faster review and higher rewards.', color:'#6ee7b7', bg:'rgba(16,185,129,0.12)', side:'right' },
    { icon:Shield,      num:3, title:'Admin Review',         text:'Our quality team verifies every submission. Approved materials go live for thousands of students instantly.', color:'#fcd34d', bg:'rgba(245,158,11,0.12)', side:'left' },
    { icon:Award,       num:4, title:'Collect Rewards',      text:'Every 3 approved uploads earns you bonus AI messages, image credits, and a project slot. The more you share, the more you earn.', color:'#c4b5fd', bg:'rgba(139,92,246,0.12)', side:'right' },
  ];
  return (
    <section id="how" style={{ padding:'0 0 88px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, margin:'-60px' }} variants={fadeUp} transition={{ duration:0.5 }} style={{ marginBottom:64, textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:11, fontWeight:700, letterSpacing:'1.6px', color:'#a5b4fc', textTransform:'uppercase', marginBottom:14 }}>
            <Zap size={12}/> How it works
          </div>
          <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.6rem)', fontWeight:900, letterSpacing:'-1px', lineHeight:1.1 }}>Four steps to impact</h2>
        </motion.div>

        <div style={{ display:'flex', flexDirection:'column', gap:20 }} className="steps-col">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              initial="hidden"
              whileInView="visible"
              viewport={{ once:true, margin:'-80px' }}
              variants={s.side==='left' ? fadeLeft : fadeRight}
              transition={{ duration:0.65, delay:0.05, ease:[0.4,0,.2,1] }}
            >
              <SpotlightCard
                glowColor={`${s.color}14`}
                style={{
                  display:'grid',
                  gridTemplateColumns: s.side==='left' ? '1fr auto' : 'auto 1fr',
                  gap:0, borderRadius:22, overflow:'hidden',
                  background:'rgba(255,255,255,0.04)',
                  border:'1px solid rgba(255,255,255,0.09)',
                  backdropFilter:'blur(24px)',
                  transition:'border-color .3s, box-shadow .3s',
                  cursor:'default',
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=`${s.color}33`;e.currentTarget.style.boxShadow=`0 24px 60px rgba(0,0,0,0.4),0 0 80px ${s.color}14`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.09)';e.currentTarget.style.boxShadow='none';}}
              >
                {/* Text side */}
                <div style={{ padding:'36px 40px', order: s.side==='left' ? 0 : 1 }}>
                  {/* Step number tag */}
                  <div style={{ display:'inline-flex', alignItems:'center', gap:6, marginBottom:18, padding:'4px 12px', borderRadius:99, background:s.bg, border:`1px solid ${s.color}33`, fontSize:11, fontWeight:800, color:s.color, letterSpacing:'.5px' }}>
                    Step {s.num}
                  </div>
                  <h3 style={{ fontSize:'clamp(1.2rem,2vw,1.55rem)', fontWeight:900, letterSpacing:'-0.5px', marginBottom:12, lineHeight:1.15 }}>{s.title}</h3>
                  <p style={{ fontSize:15, color:'rgba(238,240,255,0.52)', lineHeight:1.75, maxWidth:400 }}>{s.text}</p>
                </div>

                {/* Icon side */}
                <div style={{
                  width:180, background:`linear-gradient(135deg, ${s.bg}, rgba(0,0,0,0.1))`,
                  borderLeft: s.side==='left' ? `1px solid rgba(255,255,255,0.07)` : 'none',
                  borderRight: s.side==='right' ? `1px solid rgba(255,255,255,0.07)` : 'none',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  flexDirection:'column', gap:12,
                  order: s.side==='left' ? 1 : 0,
                  position:'relative', overflow:'hidden',
                }} className="step-icon-side">
                  {/* bg glow */}
                  <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at center, ${s.color}14 0%, transparent 70%)` }} />
                  <motion.div
                    animate={{ y:[0,-10,0] }}
                    transition={{ duration:3+i*0.5, repeat:Infinity, ease:'easeInOut' }}
                    style={{ position:'relative', zIndex:1 }}
                  >
                    <div style={{ width:72, height:72, borderRadius:22, background:s.bg, border:`1px solid ${s.color}44`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 32px ${s.color}22` }}>
                      <s.icon size={32} style={{ color:s.color, strokeWidth:1.6 }} />
                    </div>
                  </motion.div>
                  <div style={{ fontSize:40, fontWeight:900, color:s.color, opacity:.12, position:'absolute', bottom:-8, right:12, lineHeight:1 }}>{s.num}</div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Feature Cards ───────────────────────────────────────────────── */
function FeaturesSection() {
  return (
    <section style={{ padding:'0 0 88px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, margin:'-60px' }} variants={fadeUp} transition={{ duration:0.5 }} style={{ marginBottom:44, textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:11, fontWeight:700, letterSpacing:'1.6px', color:'#a5b4fc', textTransform:'uppercase', marginBottom:14 }}>
            <Star size={12}/> Why choose us
          </div>
          <h2 style={{ fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:900, letterSpacing:'-0.9px' }}>Everything you need to excel</h2>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:14 }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once:true, margin:'-60px' }}
              variants={i%2===0 ? fadeLeft : fadeRight}
              transition={{ duration:0.55, delay:i*0.07, ease:[0.4,0,.2,1] }}
            >
              <SpotlightCard
                glowColor={`${f.color}14`}
                className="glass-card"
                style={{ padding:'28px 24px', cursor:'default', position:'relative', overflow:'hidden' }}
              >
                <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:1, background:`linear-gradient(90deg,transparent,${f.color}44,transparent)` }} />
                <div style={{ width:50, height:50, borderRadius:16, background:f.bg, border:`1px solid ${f.color}33`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18, boxShadow:`0 0 24px ${f.color}18` }}>
                  <f.icon size={22} style={{ color:f.color, strokeWidth:1.7 }} />
                </div>
                <div style={{ fontSize:16, fontWeight:800, marginBottom:8, letterSpacing:'-0.2px' }}>{f.title}</div>
                <div style={{ fontSize:13.5, color:'rgba(238,240,255,0.48)', lineHeight:1.7 }}>{f.text}</div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Upload Form helpers ─────────────────────────────────────────── */
function FormGroup({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontSize:10.5, fontWeight:800, letterSpacing:'1px', textTransform:'uppercase', color:'rgba(238,240,255,0.4)' }}>{label}</label>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function UploadPage() {
  const toast = useToast();
  const fileInputRef = useRef();
  const [stats, setStats]   = useState({ totalResources:0, totalUsers:0 });
  const [recent, setRecent] = useState([]);
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

  useEffect(() => {
    fetch('/api/community/stats').then(r=>r.json()).then(d=>{
      setStats({ totalResources:d.totalResources||0, totalUsers:d.totalUsers||0 });
      setRecent(d.recentApproved||[]);
    }).catch(()=>{});
  }, []);

  const onDrop = useCallback(e => { e.preventDefault(); setDragging(false); addFiles([...e.dataTransfer.files]); }, []);
  function addFiles(newFiles) { setFiles(prev=>[...prev,...newFiles].slice(0,30)); }
  function removeFile(i) { setFiles(prev=>prev.filter((_,idx)=>idx!==i)); }

  async function doUpload() {
    setError('');
    if (!files.length) { setError('Please select at least one file.'); return; }
    if (!subject) { setError('Please select a subject.'); return; }
    setUploading(true);
    const total=files.length; let done=0, ok=0, fail=0;
    const subjectFull = curriculum ? `${subject} (${curriculum})` : subject;
    for (const f of files) {
      setProgress({ done, total, label:`Uploading ${done+1} of ${total}…` });
      const fd=new FormData();
      fd.append('file',f,f.name); fd.append('title',f.name.replace(/\.[^.]+$/,''));
      fd.append('category',category); fd.append('level',level);
      fd.append('grade',grade); fd.append('subject',subjectFull);
      fd.append('uploaderName',name); fd.append('uploaderPhone',phone);
      try { const res=await fetch('/api/public/upload',{method:'POST',body:fd}); const data=await res.json().catch(()=>({})); if(!res.ok) throw new Error(data.error||'Upload failed'); ok++; }
      catch { fail++; }
      done++;
    }
    setProgress({ done:total, total, label:`Done — ${ok} uploaded${fail?`, ${fail} failed`:''}` });
    setUploading(false);
    if (ok>0) {
      setTimeout(()=>{ setSuccess(true); fetch('/api/community/stats').then(r=>r.json()).then(d=>{ setStats({ totalResources:d.totalResources||0, totalUsers:d.totalUsers||0 }); setRecent(d.recentApproved||[]); }).catch(()=>{}); },700);
    } else { setError(`All ${fail} upload(s) failed. Please try again.`); }
  }

  function reset() { setFiles([]); setSuccess(false); setError(''); setProgress({ done:0, total:0, label:'' }); }

  const subjects = SUBJECTS[level]||[];
  const grades   = GRADES[level]||[];

  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1 }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{ position:'relative', textAlign:'center', padding:'80px 24px 80px', overflow:'hidden' }}>
        {/* Hero glow blob */}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-55%)', width:'min(800px,90vw)', height:500, background:'radial-gradient(ellipse, rgba(99,102,241,.14) 0%, rgba(139,92,246,.07) 40%, transparent 70%)', pointerEvents:'none', filter:'blur(48px)' }} />

        {/* Badge */}
        <motion.div initial={{ opacity:0, y:-14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} style={{ marginBottom:32 }}>
          <span className="glow-badge"><Sparkles size={11}/> Community Resource Hub</span>
        </motion.div>

        {/* ANIMATED HEADLINE */}
        <div style={{ marginBottom:28, lineHeight:1.04 }}>
          {/* Line 1 */}
          <div style={{ fontSize:'clamp(2.6rem,7vw,5.2rem)', fontWeight:900, letterSpacing:'-3px', display:'block' }}>
            <AnimatedWords text="Share Knowledge," delay={0.08} style={{ color:'#eef0ff' }} />
          </div>
          {/* Line 2 — gradient with letter-by-letter stagger */}
          <div style={{ fontSize:'clamp(2.6rem,7vw,5.2rem)', fontWeight:900, letterSpacing:'-3px', display:'block', marginTop:'-0.04em' }}>
            {['E','a','r','n',' ','R','e','w','a','r','d','s'].map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity:0, y:60, rotateX:'-60deg', filter:'blur(8px)' }}
                animate={{ opacity:1, y:0, rotateX:'0deg', filter:'blur(0px)' }}
                transition={{ duration:0.55, delay:0.35 + i*0.045, ease:[0.4,0,.2,1] }}
                style={{ display:'inline-block', whiteSpace: ch===' '?'pre':undefined }}
                className="grad-text"
              >
                {ch === ' ' ? '\u00A0' : ch}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.65, delay:0.85 }}
          style={{ fontSize:'clamp(15px,2.5vw,19px)', color:'rgba(238,240,255,0.52)', maxWidth:500, margin:'0 auto 56px', lineHeight:1.72, fontWeight:400 }}
        >
          Upload past papers, textbooks, and syllabuses.{' '}
          Get rewarded when your materials are approved.
        </motion.p>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity:0, y:32, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:0.7, delay:1, ease:[0.4,0,.2,1] }}
          style={{ display:'flex', alignItems:'stretch', justifyContent:'center', border:'1px solid rgba(255,255,255,0.09)', borderRadius:24, background:'rgba(255,255,255,0.035)', backdropFilter:'blur(32px) saturate(160%)', maxWidth:'min(580px,95vw)', margin:'0 auto 52px', overflow:'hidden', boxShadow:'0 0 0 1px rgba(99,102,241,.06),0 24px 80px rgba(0,0,0,.35),0 0 120px rgba(99,102,241,.07)' }}
        >
          <StatPill icon={Database} target={stats.totalResources} label="Study Materials" delay={0} />
          <StatPill icon={Users}    target={stats.totalUsers}     label="Active Students" delay={0.06} />
          <div style={{ flex:1, padding:'28px 20px', textAlign:'center' }}>
            <div style={{ width:42, height:42, borderRadius:13, background:'linear-gradient(135deg,rgba(99,102,241,.15),rgba(6,182,212,.10))', border:'1px solid rgba(99,102,241,.22)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
              <Award size={19} style={{ color:'#a5b4fc' }} />
            </div>
            <div style={{ fontSize:34, fontWeight:900, letterSpacing:'-2px' }}>Free</div>
            <div style={{ fontSize:12, color:'rgba(238,240,255,.42)', marginTop:5, fontWeight:500 }}>Always Free</div>
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.15, duration:0.5 }}
          style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
          <motion.a href="#upload" whileHover={{ scale:1.05, y:-3 }} whileTap={{ scale:.97 }}
            style={{ display:'inline-flex', alignItems:'center', gap:9, padding:'14px 30px', borderRadius:13, background:'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', color:'#fff', fontSize:'clamp(13px,2vw,15px)', fontWeight:700, textDecoration:'none', boxShadow:'0 8px 36px rgba(99,102,241,.5)', border:'1px solid rgba(255,255,255,.12)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,.14),transparent)', borderRadius:'inherit' }} />
            <Upload size={17} strokeWidth={2.2} style={{ position:'relative' }} />
            <span style={{ position:'relative' }}>Upload Materials</span>
          </motion.a>
          <motion.a href="#how" whileHover={{ scale:1.05, y:-3 }}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 26px', borderRadius:13, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.11)', color:'rgba(238,240,255,.75)', fontSize:'clamp(13px,2vw,15px)', fontWeight:600, textDecoration:'none', backdropFilter:'blur(12px)' }}>
            How it works <ChevronRight size={16}/>
          </motion.a>
        </motion.div>
      </section>

      {/* ── Trust pills ──────────────────────────────────────── */}
      <section style={{ padding:'0 24px 72px' }}>
        <div style={{ maxWidth:860, margin:'0 auto', textAlign:'center' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, margin:'-60px' }} variants={fadeUp} transition={{ duration:0.5 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'1.8px', textTransform:'uppercase', color:'rgba(238,240,255,0.28)', marginBottom:24 }}>
              Supporting Zimbabwe's exam boards
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, flexWrap:'wrap' }}>
              {['ZIMSEC O-Level','ZIMSEC A-Level','Cambridge IGCSE','Cambridge A-Level','Primary Curriculum'].map((b,i)=>(
                <motion.div key={b} initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.07, duration:0.4 }}
                  style={{ padding:'8px 16px', borderRadius:99, fontSize:12, fontWeight:600, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', color:'rgba(238,240,255,0.5)' }}>
                  {b}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CAROUSEL ─────────────────────────────────────────── */}
      <Carousel />

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <FeaturesSection />

      {/* ── STEPS ────────────────────────────────────────────── */}
      <StepsSection />

      {/* ── UPLOAD FORM ──────────────────────────────────────── */}
      <section style={{ padding:'0 0 96px' }} id="upload">
        <div style={{ maxWidth:720, margin:'0 auto', padding:'0 24px' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, margin:'-60px' }} variants={fadeUp} transition={{ duration:0.5 }} style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:11, fontWeight:700, letterSpacing:'1.6px', color:'#a5b4fc', textTransform:'uppercase', marginBottom:14 }}>
              <Upload size={12}/> Submit Materials
            </div>
            <h2 style={{ fontSize:'clamp(1.7rem,3vw,2.2rem)', fontWeight:900, letterSpacing:'-0.8px' }}>Share your study materials</h2>
          </motion.div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.16)', borderRadius:28, padding:'64px 36px', textAlign:'center', backdropFilter:'blur(40px)', boxShadow:'0 40px 80px rgba(0,0,0,.5),0 0 120px rgba(16,185,129,.06)', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:1, background:'linear-gradient(90deg,transparent,rgba(16,185,129,.5),transparent)' }} />
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:.18, type:'spring', stiffness:220, damping:12 }}
                  style={{ width:80, height:80, borderRadius:'50%', background:'rgba(16,185,129,.08)', border:'1px solid rgba(16,185,129,.28)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', position:'relative' }}>
                  <CheckCircle size={34} style={{ color:'#6ee7b7' }} />
                  <div style={{ position:'absolute', inset:-10, borderRadius:'50%', border:'1px solid rgba(16,185,129,.18)', animation:'pulse-ring 1.6s ease-out infinite' }} />
                </motion.div>
                <h3 style={{ fontSize:'1.6rem', fontWeight:900, color:'#6ee7b7', marginBottom:10, letterSpacing:'-0.5px' }}>Upload Submitted!</h3>
                <p style={{ fontSize:14.5, color:'rgba(238,240,255,.5)', lineHeight:1.7, maxWidth:340, margin:'0 auto 32px' }}>
                  Your materials are under review. You will be rewarded once they are approved.
                </p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, flexWrap:'wrap', marginBottom:32 }}>
                  {[{icon:Zap,text:'+10 messages'},{icon:Star,text:'+2 images'},{icon:Award,text:'Per 3 uploads'}].map(({icon:Icon,text})=>(
                    <div key={text} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(99,102,241,.1)', border:'1px solid rgba(99,102,241,.22)', borderRadius:99, padding:'7px 14px', fontSize:12, fontWeight:600, color:'#a5b4fc' }}>
                      <Icon size={12}/> {text}
                    </div>
                  ))}
                </div>
                <motion.button onClick={reset} whileHover={{ scale:1.03, y:-2 }}
                  style={{ background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.16)', color:'#eef0ff', padding:'12px 28px', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:8 }}>
                  <RefreshCw size={14}/> Upload More
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55 }}>
                <SpotlightCard
                  glowColor="rgba(99,102,241,0.10)"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:28, padding:'clamp(24px,5vw,48px)', backdropFilter:'blur(40px) saturate(180%)', boxShadow:'0 40px 80px rgba(0,0,0,.5),0 0 120px rgba(99,102,241,.06)', position:'relative', overflow:'hidden' }}
                >
                  <div style={{ position:'absolute', top:0, left:'15%', right:'15%', height:1, background:'linear-gradient(90deg,transparent,rgba(99,102,241,.5),transparent)' }} />
                  <h2 style={{ fontSize:'clamp(1.2rem,3vw,1.55rem)', fontWeight:900, letterSpacing:'-0.6px', marginBottom:6 }}>Upload Study Materials</h2>
                  <p style={{ fontSize:13.5, color:'rgba(238,240,255,.47)', marginBottom:28, lineHeight:1.6 }}>Submit past papers, syllabuses, textbooks, or marking schemes for the community.</p>

                  {/* Drop zone */}
                  <motion.div
                    onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={onDrop}
                    onClick={()=>fileInputRef.current?.click()}
                    animate={{ borderColor:dragging?'rgba(99,102,241,.7)':'rgba(99,102,241,.35)', background:dragging?'rgba(99,102,241,.08)':'rgba(99,102,241,.025)', scale:dragging?1.015:1 }}
                    transition={{ duration:.22 }}
                    style={{ border:'1.5px dashed rgba(99,102,241,.35)', borderRadius:14, padding:'clamp(28px,5vw,48px) 20px', textAlign:'center', cursor:'pointer', marginBottom:18, position:'relative', overflow:'hidden' }}
                  >
                    <motion.div animate={{ y:[0,-9,0] }} transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
                      style={{ width:60, height:60, borderRadius:18, background:'rgba(99,102,241,.1)', border:'1px solid rgba(99,102,241,.24)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 0 28px rgba(99,102,241,.15)' }}>
                      <Upload size={28} style={{ color:'#a5b4fc', strokeWidth:1.6 }} />
                    </motion.div>
                    <div style={{ fontSize:'clamp(13px,2vw,15.5px)', fontWeight:700, marginBottom:5 }}>
                      {dragging ? 'Drop to add files' : 'Drop files here or click to browse'}
                    </div>
                    <div style={{ fontSize:12.5, color:'rgba(238,240,255,.4)', marginBottom:14 }}>PDF, DOC, DOCX, PPTX — up to 80MB per file</div>
                    <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(99,102,241,.1)', border:'1px solid rgba(99,102,241,.2)', borderRadius:99, padding:'5px 13px', fontSize:11.5, fontWeight:600, color:'#a5b4fc' }}>
                      <Plus size={11}/> Up to 30 files at once
                    </div>
                    <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.pptx,.ppt" style={{ display:'none' }} onChange={e=>{addFiles([...e.target.files]);e.target.value='';}} />
                  </motion.div>

                  {/* File list */}
                  <AnimatePresence>
                    {files.length>0 && (
                      <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden', marginBottom:18 }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:11, fontWeight:700, letterSpacing:'.7px', textTransform:'uppercase', color:'rgba(238,240,255,.4)', marginBottom:9 }}>
                          <span>{files.length} file{files.length!==1?'s':''} queued</span>
                          <button onClick={()=>setFiles([])} style={{ background:'none', border:'none', color:'rgba(238,240,255,.4)', cursor:'pointer', fontSize:11, fontWeight:600, fontFamily:'inherit', padding:'3px 8px', borderRadius:6 }}>Clear all</button>
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', gap:7, maxHeight:180, overflowY:'auto' }}>
                          {files.map((f,i)=>(
                            <motion.div key={i} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*.03 }}
                              style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:10, padding:'10px 14px' }}>
                              <div style={{ width:34, height:34, borderRadius:9, background:'rgba(99,102,241,.1)', border:'1px solid rgba(99,102,241,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                <FileText size={15} style={{ color:'#a5b4fc' }} />
                              </div>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontSize:13, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{f.name}</div>
                                <div style={{ fontSize:11, color:'rgba(238,240,255,.4)', marginTop:1 }}>{(f.size/1024/1024).toFixed(2)} MB</div>
                              </div>
                              <button onClick={()=>removeFile(i)} style={{ background:'none', border:'none', color:'rgba(238,240,255,.4)', cursor:'pointer', padding:4, borderRadius:6, display:'flex' }}><X size={14}/></button>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Progress */}
                  <AnimatePresence>
                    {uploading && (
                      <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden', marginBottom:14 }}>
                        <div style={{ background:'rgba(99,102,241,.06)', border:'1px solid rgba(99,102,241,.18)', borderRadius:10, padding:'14px 16px' }}>
                          <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, fontWeight:600, marginBottom:9 }}>
                            <span>{progress.label}</span><span style={{ color:'rgba(238,240,255,.4)' }}>{progress.done}/{progress.total}</span>
                          </div>
                          <div style={{ height:5, background:'rgba(255,255,255,.07)', borderRadius:99, overflow:'hidden' }}>
                            <motion.div animate={{ width:`${progress.total?(progress.done/progress.total)*100:0}%` }} transition={{ duration:.35 }} style={{ height:'100%', background:'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', borderRadius:99 }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden', marginBottom:14 }}>
                        <div style={{ display:'flex', alignItems:'flex-start', gap:10, background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.22)', borderRadius:10, padding:'12px 16px', fontSize:13, color:'#fca5a5' }}>
                          <AlertCircle size={14} style={{ flexShrink:0, marginTop:1 }}/> {error}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Fields */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12, marginBottom:14 }}>
                    <FormGroup label="Category *">
                      <select value={category} onChange={e=>setCategory(e.target.value)}>
                        <option value="paper">Past Paper</option>
                        <option value="textbook">Textbook</option>
                        <option value="syllabus">Syllabus</option>
                        <option value="marking_scheme">Marking Scheme</option>
                      </select>
                    </FormGroup>
                    <FormGroup label="Level *">
                      <select value={level} onChange={e=>{setLevel(e.target.value);setSubject('');setGrade(GRADES[e.target.value]?.[0]||'');}}>
                        <option value="primary">Primary School</option>
                        <option value="olevel">O-Level</option>
                        <option value="alevel">A-Level</option>
                      </select>
                    </FormGroup>
                    <FormGroup label="Subject *">
                      <select value={subject} onChange={e=>setSubject(e.target.value)}>
                        <option value="">— Select —</option>
                        {subjects.map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                    </FormGroup>
                    <FormGroup label="Grade / Form">
                      <select value={grade} onChange={e=>setGrade(e.target.value)}>
                        {grades.map(g=><option key={g} value={g}>{g}</option>)}
                      </select>
                    </FormGroup>
                    <FormGroup label="Curriculum">
                      <select value={curriculum} onChange={e=>setCurriculum(e.target.value)}>
                        <option value="">General</option><option value="ZIMSEC">ZIMSEC</option><option value="Cambridge">Cambridge</option>
                      </select>
                    </FormGroup>
                  </div>

                  <div style={{ height:1, background:'rgba(255,255,255,.07)', margin:'18px 0' }} />
                  <p style={{ fontSize:12, color:'rgba(238,240,255,.38)', marginBottom:12 }}>Optional — add your info to receive rewards on the bot</p>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12, marginBottom:26 }}>
                    <FormGroup label="Your Name"><input type="text" placeholder="e.g. Tendai M." value={name} onChange={e=>setName(e.target.value)} /></FormGroup>
                    <FormGroup label="WhatsApp Number"><input type="text" placeholder="e.g. 263719647303" value={phone} onChange={e=>setPhone(e.target.value)} /></FormGroup>
                  </div>

                  <motion.button
                    onClick={doUpload} disabled={uploading||!files.length}
                    whileHover={!uploading&&files.length?{y:-2,boxShadow:'0 16px 48px rgba(99,102,241,.6)'}:{}}
                    style={{ width:'100%', padding:'15px', background:'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', color:'#fff', fontSize:'clamp(14px,2vw,15.5px)', fontWeight:700, border:'none', borderRadius:12, cursor:uploading||!files.length?'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:10, boxShadow:'0 8px 36px rgba(99,102,241,.45)', opacity:uploading||!files.length?.55:1, transition:'opacity .2s', position:'relative', overflow:'hidden' }}
                  >
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,.12),transparent)', borderRadius:'inherit' }} />
                    {uploading ? <><span className="spinner" style={{ width:18, height:18 }}/> Uploading…</> : <><Send size={17} strokeWidth={2.3} style={{ position:'relative' }}/><span style={{ position:'relative' }}>Submit for Review</span></>}
                  </motion.button>
                  <p style={{ fontSize:11.5, color:'rgba(238,240,255,.28)', textAlign:'center', marginTop:12, lineHeight:1.7 }}>
                    By uploading, you confirm these materials are for educational use. Rewards credited after admin approval.
                  </p>
                </SpotlightCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Recent Materials ──────────────────────────────────── */}
      {recent.length>0 && (
        <section style={{ padding:'0 0 88px' }}>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, margin:'-60px' }} variants={fadeUp} transition={{ duration:0.5 }} style={{ marginBottom:36 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:11, fontWeight:700, letterSpacing:'1.6px', color:'#a5b4fc', textTransform:'uppercase', marginBottom:14 }}><Clock size={12}/> Recently Added</div>
              <h2 style={{ fontSize:'clamp(1.4rem,2.5vw,1.8rem)', fontWeight:900, letterSpacing:'-0.6px' }}>Latest community uploads</h2>
            </motion.div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(165px,1fr))', gap:12 }}>
              {recent.map((m,i)=>(
                <motion.div key={m._id||i} initial="hidden" whileInView="visible" viewport={{ once:true, margin:'-40px' }} variants={i%2===0?fadeLeft:fadeRight} transition={{ duration:0.4, delay:i*0.04 }} className="glass-card" style={{ padding:'18px 16px' }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:CAT_BG[m.category]||'rgba(99,102,241,.12)', border:`1px solid ${CAT_COLOR[m.category]||'#a5b4fc'}33`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
                    <FileText size={15} style={{ color:CAT_COLOR[m.category]||'#a5b4fc', strokeWidth:1.8 }} />
                  </div>
                  <div style={{ fontSize:12.5, fontWeight:700, marginBottom:5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.title}</div>
                  <div style={{ fontSize:11, color:'rgba(238,240,255,.4)', lineHeight:1.6 }}>
                    {CAT_LABEL[m.category]||m.category} · {LVL_LABEL[m.level]||m.level}<br/>{m.subject}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <ChatWidget />
    </div>
  );
}
