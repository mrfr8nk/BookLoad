import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  BookOpen, FileText, ClipboardList, CheckCircle, BookMarked,
  Sparkles, Image as ImageIcon, Mic, FileSearch, HelpCircle,
  Users, Calendar, FlaskConical, Code2, Calculator, GraduationCap,
  Bot, Zap, TrendingUp, Briefcase, FolderOpen, Clock, Globe,
  ArrowRight, Star, ChevronDown, MessageCircle, Shield, Rocket,
  Check, Menu, X, Play, Youtube, Search, Film, Brain, Layers,
  Award, Lightbulb, BookCopy, Volume2,
} from 'lucide-react';

/* ──────────────────────────── DATA ──────────────────────────────── */
const FEATURES = [
  { icon: BookOpen,     title: 'School Projects & Research',          color: '#7c3aed', bg: '#f5f3ff' },
  { icon: FileText,     title: 'Assignments & Homework',              color: '#2563eb', bg: '#eff6ff' },
  { icon: ClipboardList,title: 'Past Exam Papers',                   color: '#059669', bg: '#ecfdf5' },
  { icon: CheckCircle,  title: 'Marking Schemes & Answer Guides',     color: '#d97706', bg: '#fffbeb' },
  { icon: BookCopy,     title: 'Green Books & Blue Books',            color: '#db2777', bg: '#fdf2f8' },
  { icon: BookMarked,   title: 'Textbooks & Study Notes',             color: '#0891b2', bg: '#ecfeff' },
  { icon: Sparkles,     title: 'AI-Powered Explanations',             color: '#7c3aed', bg: '#f5f3ff' },
  { icon: ImageIcon,    title: 'Image Analysis & Question Solving',   color: '#059669', bg: '#ecfdf5' },
  { icon: Volume2,      title: 'Audio Explanations & Voice Learning', color: '#9333ea', bg: '#faf5ff' },
  { icon: FileSearch,   title: 'PDF Analysis & Summarization',        color: '#e11d48', bg: '#fff1f2' },
  { icon: HelpCircle,   title: 'Interactive Quizzes & Test Prep',     color: '#d97706', bg: '#fffbeb' },
  { icon: Users,        title: 'Mentorship & Study Guidance',         color: '#2563eb', bg: '#eff6ff' },
  { icon: Calendar,     title: 'Revision Plans & Exam Strategies',    color: '#059669', bg: '#ecfdf5' },
  { icon: FlaskConical, title: 'Science Practical Guidance',          color: '#0891b2', bg: '#ecfeff' },
  { icon: Code2,        title: 'Coding & Programming Help',           color: '#7c3aed', bg: '#f5f3ff' },
  { icon: Calculator,   title: 'Mathematics Step-by-Step Solving',    color: '#db2777', bg: '#fdf2f8' },
  { icon: GraduationCap,title: 'O Level & A Level Support',           color: '#d97706', bg: '#fffbeb' },
  { icon: Bot,          title: 'AI Tutoring Available 24/7',          color: '#7c3aed', bg: '#f5f3ff' },
  { icon: Zap,          title: 'Instant Answer Checking',             color: '#e11d48', bg: '#fff1f2' },
  { icon: TrendingUp,   title: 'Progress Tracking & Smart Recs',      color: '#059669', bg: '#ecfdf5' },
  { icon: Briefcase,    title: 'Career Guidance & Uni Preparation',   color: '#2563eb', bg: '#eff6ff' },
  { icon: FolderOpen,   title: 'Notes Organisation & Resources',      color: '#9333ea', bg: '#faf5ff' },
  { icon: Users,        title: 'Group Study Support',                 color: '#d97706', bg: '#fffbeb' },
  { icon: Clock,        title: 'Fast, Accurate Help Anytime',         color: '#0891b2', bg: '#ecfeff' },
];

const NEW_UPDATES = [
  { icon: Brain,   color: '#7c3aed', bg: '#f5f3ff', title: 'Smarter Mock AI', desc: 'Mock AI feature works even better than before — more realistic, detailed feedback.' },
  { icon: Rocket,  color: '#059669', bg: '#ecfdf5', title: 'Stage 5 Projects', desc: 'Fundo now completes stage 5 for you on projects. Yep, it means that.' },
  { icon: Search,  color: '#2563eb', bg: '#eff6ff', title: 'Pinterest & Google Images', desc: 'Fetch images on Pinterest or Google. Just send /image dog (don\'t forget the /).' },
  { icon: Youtube, color: '#e11d48', bg: '#fff1f2', title: 'YouTube Media Fetch', desc: 'Get videos & audios from YouTube. Just send /youtube introduction to algebra.' },
];

const LEVELS = [
  { label: 'Primary',    icon: BookOpen,      color: '#059669', bg: '#ecfdf5', desc: 'Grade 1–7 curriculum support' },
  { label: 'Secondary',  icon: BookMarked,    color: '#2563eb', bg: '#eff6ff', desc: 'Form 1–4 comprehensive help' },
  { label: 'O Level',    icon: GraduationCap, color: '#7c3aed', bg: '#f5f3ff', desc: 'ZIMSEC & Cambridge O-Level' },
  { label: 'A Level',    icon: Award,         color: '#d97706', bg: '#fffbeb', desc: 'Upper & Lower 6 mastery' },
  { label: 'University', icon: Layers,        color: '#9333ea', bg: '#faf5ff', desc: 'Tertiary-level academic guidance' },
];

const PRICING = [
  {
    name: 'Starter', price: 2, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe',
    badge: null,
    tagline: 'Get started with AI academic help',
    features: ['Basic AI help', 'Homework support', 'Study resources access'],
    cta: 'Get Started Today!',
  },
  {
    name: 'Pro', price: 5, color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd',
    badge: 'Most Popular',
    tagline: 'Advanced tools for serious students',
    features: ['All Starter features', 'Advanced explanations', 'Past papers & marking', 'Priority support'],
    cta: 'Boost Your Studies!',
  },
  {
    name: 'Premium', price: 10, color: '#d97706', bg: '#fffbeb', border: '#fde68a',
    badge: 'Best Value',
    tagline: 'Maximum AI power — no limits',
    features: ['All Pro features', 'AI mock exams', 'Personalised guidance', '24/7 premium support', 'Smart progress tracking'],
    cta: 'Unlock Your Potential!',
  },
];

const BOTTOM_FEATURES = [
  { icon: Sparkles, title: 'Smarter',    desc: 'Learn better with AI.', color: '#7c3aed', bg: '#f5f3ff' },
  { icon: Zap,      title: 'Faster',     desc: 'Get answers in seconds.', color: '#059669', bg: '#ecfdf5' },
  { icon: Shield,   title: 'Reliable',   desc: 'Accurate, trusted academic help.', color: '#2563eb', bg: '#eff6ff' },
  { icon: Globe,    title: 'For Every Student', desc: 'From basic to advanced levels.', color: '#d97706', bg: '#fffbeb' },
  { icon: Clock,    title: '24/7 Support', desc: 'We\'re always here for you.', color: '#9333ea', bg: '#faf5ff' },
];

/* ──────────────────────────── HELPERS ───────────────────────────── */
function useCountUp(target, inView) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let cur = 0;
    const step = target / 60;
    const t = setInterval(() => { cur += step; if (cur >= target) { setV(target); clearInterval(t); } else setV(Math.floor(cur)); }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return v;
}

function CountStat({ value, suffix, label, delay }) {
  const ref  = useRef();
  const inV  = useInView(ref, { once: true });
  const val  = useCountUp(value, inV);
  return (
    <motion.div ref={ref} initial={{ opacity:0, y:16 }} animate={inV?{opacity:1,y:0}:{}} transition={{ duration:.5, delay }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'clamp(2.4rem,4vw,3.2rem)', fontWeight:900, letterSpacing:'-2px', color:'#7c3aed', lineHeight:1 }}>{val.toLocaleString()}{suffix}</div>
        <div style={{ fontSize:13.5, color:'var(--gray-500)', marginTop:6, fontWeight:500 }}>{label}</div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────── NAVBAR ────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [['Features','#features'],['Updates','#updates'],['Pricing','#pricing'],['Upload','#upload']];

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:300,
      background: scrolled ? 'rgba(255,255,255,.97)' : 'rgba(255,255,255,.9)',
      backdropFilter:'blur(16px)',
      borderBottom: scrolled ? '1px solid var(--gray-200)' : '1px solid transparent',
      boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,.06)' : 'none',
      transition:'all .25s',
      padding:'0 clamp(16px,4vw,56px)', height:68,
      display:'flex', alignItems:'center', justifyContent:'space-between',
    }}>
      {/* Brand */}
      <a href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
        <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#7c3aed,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', boxShadow:'0 2px 10px rgba(124,58,237,.3)', flexShrink:0 }}>
          <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="Fundo" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';}} />
        </div>
        <div>
          <div style={{ fontSize:18, fontWeight:900, color:'var(--gray-900)', letterSpacing:'-.3px', lineHeight:1.1 }}>Fundo<span style={{ color:'#7c3aed' }}>AI</span></div>
          <div style={{ fontSize:9.5, color:'var(--gray-400)', letterSpacing:'1.2px', fontWeight:700, textTransform:'uppercase', lineHeight:1 }}>2.0 — Unstoppable</div>
        </div>
      </a>

      {/* Desktop nav */}
      <div style={{ display:'flex', alignItems:'center', gap:2 }} className="hide-mobile">
        {links.map(([label, href]) => (
          <a key={href} href={href}
            style={{ fontSize:14, fontWeight:600, color:'var(--gray-600)', padding:'8px 14px', borderRadius:8, textDecoration:'none', transition:'all .15s' }}
            onMouseEnter={e=>{e.target.style.color='var(--gray-900)';e.target.style.background='var(--gray-100)';}}
            onMouseLeave={e=>{e.target.style.color='var(--gray-600)';e.target.style.background='none';}}
          >{label}</a>
        ))}
      </div>

      <div style={{ display:'flex', gap:8, alignItems:'center' }} className="hide-mobile">
        <a href="/admin" style={{ fontSize:13.5, fontWeight:600, color:'var(--gray-600)', padding:'7px 14px', borderRadius:8, border:'1.5px solid var(--gray-200)', textDecoration:'none', transition:'all .15s', background:'#fff' }}
          onMouseEnter={e=>e.currentTarget.style.borderColor='#7c3aed'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--gray-200)'}>
          Admin
        </a>
        <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
          style={{ display:'flex', alignItems:'center', gap:7, background:'#7c3aed', color:'#fff', textDecoration:'none', padding:'8px 20px', borderRadius:9, fontSize:14, fontWeight:700, boxShadow:'0 3px 12px rgba(124,58,237,.28)', transition:'all .15s' }}
          onMouseEnter={e=>e.currentTarget.style.background='#6d28d9'} onMouseLeave={e=>e.currentTarget.style.background='#7c3aed'}>
          <MessageCircle size={15}/> Start on WhatsApp
        </a>
      </div>

      {/* Mobile hamburger */}
      <button onClick={()=>setOpen(p=>!p)} style={{ display:'none', background:'none', border:'1.5px solid var(--gray-200)', borderRadius:8, padding:'7px', cursor:'pointer', color:'var(--gray-700)' }} className="hide-desktop">
        {open ? <X size={18}/> : <Menu size={18}/>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
            style={{ position:'absolute', top:68, left:0, right:0, background:'#fff', border:'1px solid var(--gray-200)', boxShadow:'var(--shadow-lg)', padding:20, display:'flex', flexDirection:'column', gap:6 }} className="hide-desktop">
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={()=>setOpen(false)}
                style={{ fontSize:15, fontWeight:600, color:'var(--gray-700)', padding:'10px 12px', borderRadius:9, textDecoration:'none', background:'var(--gray-50)' }}>
                {label}
              </a>
            ))}
            <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, background:'#7c3aed', color:'#fff', textDecoration:'none', padding:'12px', borderRadius:9, fontSize:15, fontWeight:700, marginTop:8 }}>
              <MessageCircle size={16}/> Start on WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ──────────────────────────── HERO ──────────────────────────────── */
function HeroSection() {
  return (
    <section style={{ minHeight:'100vh', paddingTop:68, background:'linear-gradient(160deg, #faf5ff 0%, #eff6ff 40%, #ecfdf5 80%, #fff 100%)', position:'relative', overflow:'hidden', display:'flex', alignItems:'center' }}>
      {/* Decorative blobs */}
      <div style={{ position:'absolute', top:-120, right:-160, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,.10) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-80, left:-100, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(37,99,235,.08) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'40%', left:'40%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(5,150,105,.06) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div style={{ maxWidth:1180, margin:'0 auto', padding:'72px clamp(16px,4vw,56px) 80px', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
        {/* Left */}
        <div>
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#f5f3ff,#eff6ff)', border:'1.5px solid #ddd6fe', borderRadius:99, padding:'7px 18px', fontSize:13, fontWeight:700, color:'#5b21b6', marginBottom:24 }}>
              <Sparkles size={13} style={{ color:'#7c3aed' }}/>
              Introducing Fundo AI 2.0 — Upgraded. Unstoppable.
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.55, delay:.07, ease:[.4,0,.2,1] }}
            style={{ fontSize:'clamp(2.4rem,5vw,3.8rem)', fontWeight:900, color:'var(--gray-900)', lineHeight:1.08, letterSpacing:'-.05em', marginBottom:20 }}>
            Academic <span className="italic-purple">Excellence</span><br />
            <span style={{ color:'var(--gray-900)' }}>Powered by AI</span>
          </motion.h1>

          <motion.p initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, delay:.15 }}
            style={{ fontSize:'clamp(1rem,2vw,1.15rem)', color:'var(--gray-600)', lineHeight:1.75, maxWidth:520, marginBottom:32 }}>
            Smarter AI. Stronger you. Better results. — Fundo AI gives every Zimbabwean student access to world-class academic support, 24/7 on WhatsApp.
          </motion.p>

          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, delay:.22 }}
            style={{ display:'flex', flexWrap:'wrap', gap:12, marginBottom:48 }}>
            <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:9, background:'#7c3aed', color:'#fff', textDecoration:'none', padding:'13px 28px', borderRadius:10, fontSize:15.5, fontWeight:800, boxShadow:'0 6px 24px rgba(124,58,237,.32)', transition:'all .18s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='#6d28d9';e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 10px 32px rgba(124,58,237,.38)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='#7c3aed';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 6px 24px rgba(124,58,237,.32)';}}>
              <MessageCircle size={17}/> Start for Free on WhatsApp
            </a>
            <a href="#pricing"
              style={{ display:'inline-flex', alignItems:'center', gap:9, background:'#fff', color:'var(--gray-900)', textDecoration:'none', padding:'13px 24px', borderRadius:10, fontSize:15, fontWeight:700, border:'1.5px solid var(--gray-200)', boxShadow:'var(--shadow-sm)', transition:'all .18s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='#7c3aed';e.currentTarget.style.color='#7c3aed';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--gray-200)';e.currentTarget.style.color='var(--gray-900)';}}>
              View Pricing <ArrowRight size={15}/>
            </a>
          </motion.div>

          {/* Quick badges */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.35, duration:.5 }}
            style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {[
              { label:'ZIMSEC Aligned', color:'#7c3aed', bg:'#f5f3ff', border:'#ddd6fe' },
              { label:'Cambridge Support', color:'#2563eb', bg:'#eff6ff', border:'#bfdbfe' },
              { label:'No App Needed', color:'#059669', bg:'#ecfdf5', border:'#a7f3d0' },
              { label:'All Levels', color:'#d97706', bg:'#fffbeb', border:'#fde68a' },
            ].map(b=>(
              <div key={b.label} style={{ padding:'5px 13px', borderRadius:99, background:b.bg, border:`1px solid ${b.border}`, fontSize:12.5, fontWeight:700, color:b.color }}>
                {b.label}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — visual card stack */}
        <div style={{ position:'relative', display:'flex', justifyContent:'center', alignItems:'center' }}>
          {/* Main glow orb */}
          <div style={{ position:'absolute', width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,.12) 0%, transparent 70%)' }} />

          {/* Center card */}
          <motion.div initial={{ opacity:0, scale:.92 }} animate={{ opacity:1, scale:1 }} transition={{ duration:.7, delay:.2, ease:[.4,0,.2,1] }}
            style={{ width:320, background:'#fff', border:'1.5px solid #ddd6fe', borderRadius:24, padding:32, boxShadow:'0 24px 64px rgba(124,58,237,.14), 0 4px 16px rgba(0,0,0,.06)', position:'relative', zIndex:2 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:'linear-gradient(135deg,#7c3aed,#8b5cf6)', overflow:'hidden', boxShadow:'0 4px 16px rgba(124,58,237,.28)', flexShrink:0 }}>
                <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="Fundo AI" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';}} />
              </div>
              <div>
                <div style={{ fontSize:16, fontWeight:900, color:'var(--gray-900)' }}>Fundo AI</div>
                <div style={{ fontSize:11.5, color:'var(--gray-500)', marginTop:1 }}>Your 24/7 Study Partner</div>
              </div>
              <div style={{ marginLeft:'auto', background:'#ecfdf5', border:'1px solid #a7f3d0', color:'#059669', borderRadius:99, padding:'3px 9px', fontSize:11, fontWeight:700 }}>● Live</div>
            </div>
            {[
              { q:'Can you help with O Level Maths?', a:'Absolutely! I can solve equations step-by-step, explain concepts, and give you past paper questions. What topic shall we start with?', delay:0 },
              { q:'Summarise this PDF for me', a:'Sure! Upload your PDF and I\'ll give you a clear summary with key points highlighted.', delay:.15 },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom:12 }}>
                <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:.5 + i*.3, duration:.4 }}
                  style={{ background:'var(--purple-bg)', borderRadius:'12px 12px 4px 12px', padding:'9px 13px', fontSize:12.5, color:'var(--purple-text)', fontWeight:600, marginBottom:7, display:'inline-block', maxWidth:'85%', float:'right', clear:'both' }}>
                  {item.q}
                </motion.div>
                <div style={{ clear:'both' }} />
                <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:.7 + i*.3, duration:.4 }}
                  style={{ background:'var(--gray-50)', border:'1px solid var(--gray-200)', borderRadius:'4px 12px 12px 12px', padding:'9px 13px', fontSize:12, color:'var(--gray-700)', marginBottom:4, display:'inline-block', maxWidth:'90%' }}>
                  {item.a}
                </motion.div>
                <div style={{ clear:'both' }} />
              </div>
            ))}
          </motion.div>

          {/* Floating cards */}
          {[
            { top:-28, left:-40, icon:Bot,    bg:'#f5f3ff', color:'#7c3aed', text:'AI Tutor',    sub:'24/7 help', delay:.4 },
            { top:40,  right:-52, icon:Zap,   bg:'#fffbeb', color:'#d97706', text:'Instant',     sub:'Answers', delay:.5 },
            { bottom:20, left:-50, icon:Award, bg:'#ecfdf5', color:'#059669', text:'All Levels',  sub:'P–University', delay:.6 },
            { bottom:-24, right:-24, icon:Shield, bg:'#eff6ff', color:'#2563eb', text:'ZIMSEC', sub:'Aligned', delay:.7 },
          ].map((c, i) => (
            <motion.div key={i} initial={{ opacity:0, scale:.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:c.delay, duration:.4, type:'spring', stiffness:220, damping:14 }}
              style={{
                position:'absolute', top:c.top, bottom:c.bottom, left:c.left, right:c.right,
                background:'#fff', border:`1.5px solid ${c.bg}`, borderRadius:14,
                padding:'10px 14px', boxShadow:'0 8px 24px rgba(0,0,0,.10)',
                display:'flex', alignItems:'center', gap:8, minWidth:130, zIndex:3,
              }}>
              <div style={{ width:34, height:34, borderRadius:9, background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <c.icon size={15} style={{ color:c.color }} />
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:800, color:'var(--gray-900)' }}>{c.text}</div>
                <div style={{ fontSize:10.5, color:'var(--gray-500)' }}>{c.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(255,255,255,.85)', backdropFilter:'blur(12px)', borderTop:'1px solid var(--gray-200)', padding:'24px clamp(16px,4vw,56px)' }}>
        <div style={{ maxWidth:1180, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }}>
          <CountStat value={2040}  suffix="+" label="Active Students"   delay={0} />
          <CountStat value={274}   suffix="+" label="Resources Shared"  delay={.08} />
          <CountStat value={24}    suffix="/7" label="Always Available"  delay={.16} />
          <CountStat value={5}     suffix=""  label="Education Levels"   delay={.24} />
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── FEATURES ─────────────────────────── */
function FeaturesSection() {
  return (
    <section id="features" style={{ padding:'100px clamp(16px,4vw,56px) 96px', background:'#fff' }}>
      <div style={{ maxWidth:1180, margin:'0 auto' }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.5 }}
          style={{ textAlign:'center', marginBottom:64 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'var(--purple-bg)', border:'1px solid var(--purple-border)', borderRadius:99, padding:'6px 18px', fontSize:12.5, fontWeight:700, color:'var(--purple-text)', marginBottom:18 }}>
            <Sparkles size={12}/> All academic help — one smart app
          </div>
          <h2 style={{ fontSize:'clamp(1.9rem,4vw,3rem)', fontWeight:900, color:'var(--gray-900)', letterSpacing:'-.05em', lineHeight:1.15, marginBottom:16 }}>
            Everything you need to <span className="italic-purple">excel academically</span>
          </h2>
          <p style={{ fontSize:16, color:'var(--gray-500)', lineHeight:1.75, maxWidth:580, margin:'0 auto' }}>
            24 powerful academic tools, all accessible from WhatsApp. No downloads. No logins. Just results.
          </p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-40px' }} transition={{ duration:.4, delay:(i%6)*.04, ease:[.4,0,.2,1] }}>
              <div
                className="card"
                style={{ padding:'20px', cursor:'default', transition:'all .2s', display:'flex', alignItems:'flex-start', gap:13 }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=f.color+'50';e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow=`0 8px 28px ${f.color}18`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--gray-200)';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='var(--shadow-sm)';}}
              >
                <div style={{ width:38, height:38, borderRadius:10, background:f.bg, border:`1px solid ${f.color}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                  <f.icon size={16} style={{ color:f.color }} />
                </div>
                <span style={{ fontSize:13.5, fontWeight:700, color:'var(--gray-800)', lineHeight:1.45 }}>{f.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── NEW UPDATES ───────────────────────── */
function UpdatesSection() {
  return (
    <section id="updates" style={{ padding:'96px clamp(16px,4vw,56px)', background:'var(--gray-50)' }}>
      <div style={{ maxWidth:1180, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center' }}>
          {/* Left */}
          <motion.div initial={{ opacity:0, x:-24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:.55, ease:[.4,0,.2,1] }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'linear-gradient(135deg,#ecfdf5,#d1fae5)', border:'1px solid #a7f3d0', borderRadius:99, padding:'6px 18px', fontSize:12.5, fontWeight:700, color:'#065f46', marginBottom:20 }}>
              <Rocket size={12}/> New Update!
            </div>
            <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:900, color:'var(--gray-900)', letterSpacing:'-.05em', lineHeight:1.15, marginBottom:18 }}>
              Things have got a<br /><span className="italic-purple">little bit smarter now</span>
            </h2>
            <p style={{ fontSize:15.5, color:'var(--gray-600)', lineHeight:1.75, marginBottom:32 }}>
              Fundo AI 2.0 ships with powerful new capabilities that make studying faster, more interactive, and more rewarding than ever before.
            </p>
            <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#7c3aed', color:'#fff', textDecoration:'none', padding:'11px 24px', borderRadius:10, fontSize:14.5, fontWeight:700, boxShadow:'0 4px 16px rgba(124,58,237,.28)', transition:'all .15s' }}
              onMouseEnter={e=>e.currentTarget.style.background='#6d28d9'} onMouseLeave={e=>e.currentTarget.style.background='#7c3aed'}>
              Try These Features <ArrowRight size={14}/>
            </a>
          </motion.div>

          {/* Right — update cards */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {NEW_UPDATES.map((u, i) => (
              <motion.div key={u.title} initial={{ opacity:0, x:24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:.45, delay:i*.08, ease:[.4,0,.2,1] }}>
                <div className="card" style={{ padding:'18px 22px', display:'flex', gap:16, alignItems:'flex-start', cursor:'default', transition:'all .2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=u.color+'40';e.currentTarget.style.boxShadow=`0 6px 20px ${u.color}18`;e.currentTarget.style.transform='translateX(4px)';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--gray-200)';e.currentTarget.style.boxShadow='var(--shadow-sm)';e.currentTarget.style.transform='none';}}>
                  <div style={{ width:42, height:42, borderRadius:12, background:u.bg, border:`1.5px solid ${u.color}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <u.icon size={18} style={{ color:u.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize:14.5, fontWeight:800, color:'var(--gray-900)', marginBottom:4 }}>{u.title}</div>
                    <div style={{ fontSize:13, color:'var(--gray-500)', lineHeight:1.6 }}>{u.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── LEVELS ────────────────────────────── */
function LevelsSection() {
  return (
    <section style={{ padding:'96px clamp(16px,4vw,56px)', background:'#fff' }}>
      <div style={{ maxWidth:1180, margin:'0 auto' }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.5 }}
          style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'var(--purple-bg)', border:'1px solid var(--purple-border)', borderRadius:99, padding:'6px 18px', fontSize:12.5, fontWeight:700, color:'var(--purple-text)', marginBottom:18 }}>
            <GraduationCap size={12}/> Supporting all levels
          </div>
          <h2 style={{ fontSize:'clamp(1.9rem,4vw,2.8rem)', fontWeight:900, color:'var(--gray-900)', letterSpacing:'-.05em', marginBottom:12 }}>
            From classroom to career,<br /><span className="italic-purple">we've got you covered</span>
          </h2>
          <p style={{ fontSize:15.5, color:'var(--gray-500)', lineHeight:1.7, maxWidth:540, margin:'0 auto' }}>
            Whether you're in Grade 1 or preparing for university, Fundo AI adapts to your level and curriculum.
          </p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16 }}>
          {LEVELS.map((lv, i) => (
            <motion.div key={lv.label} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.45, delay:i*.08, ease:[.4,0,.2,1] }}>
              <div className="card card-hover" style={{ padding:'28px 20px', textAlign:'center' }}>
                <div style={{ width:52, height:52, borderRadius:14, background:lv.bg, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                  <lv.icon size={22} style={{ color:lv.color }} />
                </div>
                <div style={{ fontSize:16, fontWeight:800, color:'var(--gray-900)', marginBottom:7 }}>{lv.label}</div>
                <div style={{ fontSize:12.5, color:'var(--gray-500)', lineHeight:1.5 }}>{lv.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── PRICING ───────────────────────────── */
function PricingSection() {
  return (
    <section id="pricing" style={{ padding:'100px clamp(16px,4vw,56px) 96px', background:'var(--gray-50)' }}>
      <div style={{ maxWidth:1180, margin:'0 auto' }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.5 }}
          style={{ textAlign:'center', marginBottom:60 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'var(--purple-bg)', border:'1px solid var(--purple-border)', borderRadius:99, padding:'6px 18px', fontSize:12.5, fontWeight:700, color:'var(--purple-text)', marginBottom:18 }}>
            <Star size={12} fill="currentColor"/> Simple, affordable pricing
          </div>
          <h2 style={{ fontSize:'clamp(1.9rem,4vw,3rem)', fontWeight:900, color:'var(--gray-900)', letterSpacing:'-.05em', lineHeight:1.15, marginBottom:14 }}>
            Invest in your <span className="italic-purple">academic future</span>
          </h2>
          <p style={{ fontSize:15.5, color:'var(--gray-500)', lineHeight:1.7, maxWidth:480, margin:'0 auto' }}>
            All plans include WhatsApp access — no app downloads, no complicated setup. Just open WhatsApp and start learning.
          </p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, alignItems:'start' }}>
          {PRICING.map((plan, i) => {
            const isPro = plan.name === 'Pro';
            return (
              <motion.div key={plan.name} initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.5, delay:i*.1, ease:[.4,0,.2,1] }}>
                <div style={{
                  background:'#fff', border:`2px solid ${isPro ? plan.color : plan.border}`,
                  borderRadius:20, padding:isPro?'36px 28px':'28px',
                  boxShadow: isPro ? `0 20px 56px ${plan.color}25, 0 4px 16px rgba(0,0,0,.06)` : 'var(--shadow)',
                  transform: isPro ? 'scale(1.04)' : 'none',
                  position:'relative', overflow:'hidden',
                }}>
                  {/* Top accent */}
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:`linear-gradient(90deg, ${plan.color}, ${plan.color}80)` }} />

                  {plan.badge && (
                    <div style={{ position:'absolute', top:18, right:18, background:plan.color, color:'#fff', borderRadius:99, padding:'3px 12px', fontSize:11, fontWeight:800 }}>
                      {plan.badge}
                    </div>
                  )}

                  <div style={{ marginBottom:20 }}>
                    <div style={{ fontSize:13.5, fontWeight:700, color:plan.color, letterSpacing:'.5px', textTransform:'uppercase', marginBottom:8 }}>{plan.name}</div>
                    <div style={{ display:'flex', alignItems:'flex-end', gap:4, marginBottom:8 }}>
                      <span style={{ fontSize:'clamp(3rem,5vw,4rem)', fontWeight:900, letterSpacing:'-3px', color:'var(--gray-900)', lineHeight:1 }}>${plan.price}</span>
                      <span style={{ fontSize:14, color:'var(--gray-400)', fontWeight:500, paddingBottom:8 }}>/month</span>
                    </div>
                    <p style={{ fontSize:13, color:'var(--gray-500)', lineHeight:1.55 }}>{plan.tagline}</p>
                  </div>

                  <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:20, height:20, borderRadius:'50%', background:plan.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <Check size={11} style={{ color:plan.color }} strokeWidth={3} />
                        </div>
                        <span style={{ fontSize:13.5, color:'var(--gray-700)', fontWeight:500 }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
                    style={{
                      display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                      background: isPro ? plan.color : 'transparent',
                      color: isPro ? '#fff' : plan.color,
                      border: `2px solid ${plan.color}`,
                      textDecoration:'none', padding:'12px', borderRadius:11,
                      fontSize:14, fontWeight:800, transition:'all .18s',
                      boxShadow: isPro ? `0 4px 16px ${plan.color}35` : 'none',
                    }}
                    onMouseEnter={e=>{e.currentTarget.style.background=plan.color;e.currentTarget.style.color='#fff';e.currentTarget.style.transform='translateY(-1px)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background=isPro?plan.color:'transparent';e.currentTarget.style.color=isPro?'#fff':plan.color;e.currentTarget.style.transform='none';}}>
                    {plan.cta} <ArrowRight size={14}/>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* "Study Anytime" callout */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.5, delay:.3 }}
          style={{ marginTop:40, background:'linear-gradient(135deg,#7c3aed,#6d28d9)', borderRadius:20, padding:'36px 40px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20, boxShadow:'0 12px 40px rgba(124,58,237,.3)' }}>
          <div>
            <div style={{ fontSize:'clamp(1.3rem,2.5vw,1.8rem)', fontWeight:900, color:'#fff', marginBottom:6, letterSpacing:'-.02em' }}>Study Anytime. Anywhere. On Any Device.</div>
            <p style={{ fontSize:14.5, color:'rgba(255,255,255,.75)', lineHeight:1.6 }}>WhatsApp on phone, tablet, or desktop — Fundo AI works everywhere.</p>
          </div>
          <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:9, background:'#fff', color:'#7c3aed', textDecoration:'none', padding:'13px 28px', borderRadius:11, fontSize:15, fontWeight:800, boxShadow:'0 4px 16px rgba(0,0,0,.15)', flexShrink:0, transition:'all .15s' }}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='none'}>
            <MessageCircle size={16}/> Start Now — It's Free
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────── BOTTOM FEATURES ───────────────────── */
function BottomFeaturesSection() {
  return (
    <section style={{ padding:'80px clamp(16px,4vw,56px)', background:'#fff', borderTop:'1px solid var(--gray-200)' }}>
      <div style={{ maxWidth:1180, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:20 }}>
          {BOTTOM_FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.4, delay:i*.07, ease:[.4,0,.2,1] }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ width:52, height:52, borderRadius:14, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                  <f.icon size={22} style={{ color:f.color }} />
                </div>
                <div style={{ fontSize:14.5, fontWeight:800, color:'var(--gray-900)', marginBottom:5 }}>{f.title}</div>
                <div style={{ fontSize:13, color:'var(--gray-500)', lineHeight:1.5 }}>{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── CTA SECTION ───────────────────────── */
function CTASection() {
  return (
    <section id="upload" style={{ padding:'100px clamp(16px,4vw,56px)', background:'linear-gradient(160deg,#1e1b4b 0%,#3730a3 50%,#7c3aed 100%)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-100, right:-100, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,255,255,.06) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-80, left:-80, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(167,243,208,.08) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div style={{ maxWidth:860, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.55 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)', borderRadius:99, padding:'7px 18px', fontSize:13, fontWeight:700, color:'rgba(255,255,255,.9)', marginBottom:28 }}>
            <Star size={13} fill="currentColor" style={{ color:'#fbbf24' }}/> Join thousands of students already winning with Fundo AI
          </div>
          <h2 style={{ fontSize:'clamp(2rem,4.5vw,3.4rem)', fontWeight:900, color:'#fff', letterSpacing:'-.05em', lineHeight:1.1, marginBottom:20 }}>
            Ready to level up your<br />academic game?
          </h2>
          <p style={{ fontSize:16.5, color:'rgba(255,255,255,.75)', lineHeight:1.7, marginBottom:40, maxWidth:540, margin:'0 auto 40px' }}>
            Contact us on WhatsApp and start your AI-powered study journey today. No downloads. No logins. Just results.
          </p>

          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
            <a href="https://wa.me/263719647303" target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:11, background:'#fff', color:'#7c3aed', textDecoration:'none', padding:'16px 36px', borderRadius:12, fontSize:17, fontWeight:900, boxShadow:'0 8px 32px rgba(0,0,0,.2)', transition:'all .2s' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 14px 40px rgba(0,0,0,.25)';}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,.2)';}}>
              <MessageCircle size={20} style={{ color:'#25D366' }}/>
              wa.me/263719647303
            </a>
            <div style={{ display:'flex', gap:28, flexWrap:'wrap', justifyContent:'center', marginTop:8 }}>
              {['WhatsApp Channel','Upload Materials','Admin Portal'].map((l, i) => (
                <a key={l} href={i===0?'https://whatsapp.com/channel/0029VbCigmv96H4JhJDwsd0X':i===1?'/upload':'/admin'}
                  target={i===0?'_blank':undefined} rel={i===0?'noopener noreferrer':undefined}
                  style={{ fontSize:14, color:'rgba(255,255,255,.65)', textDecoration:'none', transition:'color .15s' }}
                  onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,.65)'}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────── FOOTER ────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background:'var(--gray-900)', color:'#fff', padding:'56px clamp(16px,4vw,56px) 32px' }}>
      <div style={{ maxWidth:1180, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2.5fr 1fr 1fr 1fr', gap:48, marginBottom:48 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#7c3aed,#8b5cf6)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <img src="https://mrfranko-cdn.hf.space/edu/fundo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';}} />
              </div>
              <span style={{ fontSize:17, fontWeight:900 }}>Fundo<span style={{ color:'#8b5cf6' }}>AI</span></span>
            </div>
            <p style={{ fontSize:13.5, color:'#9ca3af', lineHeight:1.75, maxWidth:300, marginBottom:20 }}>
              Zimbabwe's #1 AI-powered academic platform. Supporting every student from primary through to university via WhatsApp.
            </p>
            <div style={{ fontSize:12.5, color:'#6b7280' }}>support.fundo.ai@gmail.com</div>
          </div>
          {[
            { title:'Product', links:['Features','Pricing','Upload','WhatsApp Bot'] },
            { title:'Support', links:['Help Centre','Contact Us','Community','Privacy Policy'] },
            { title:'Company', links:['About','Blog','Careers','Press Kit'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize:11.5, fontWeight:700, letterSpacing:'.6px', textTransform:'uppercase', color:'#6b7280', marginBottom:16 }}>{col.title}</div>
              {col.links.map(l => (
                <div key={l} style={{ marginBottom:10 }}>
                  <a href="#" style={{ fontSize:13.5, color:'#d1d5db', textDecoration:'none', transition:'color .15s' }}
                    onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='#d1d5db'}>{l}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid #374151', paddingTop:28, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <p style={{ fontSize:12.5, color:'#6b7280' }}>© 2026 Fundo AI. Created by Darrell Mucheri. All rights reserved.</p>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {['LEARN','INNOVATE','EXCEL'].map((w, i) => (
              <span key={w} style={{ fontSize:11.5, fontWeight:800, letterSpacing:'1.5px', color: i===1?'#8b5cf6':'#6b7280' }}>{w}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ──────────────────────────── PAGE ──────────────────────────────── */
export default function LandingPage() {
  return (
    <div style={{ minHeight:'100vh', background:'#fff' }}>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <UpdatesSection />
      <LevelsSection />
      <PricingSection />
      <BottomFeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
